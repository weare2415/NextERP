package com.nexterp.product.service;

/*
 * Description    : 매입 서비스 구현
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : PurchaseServiceImpl
 * Author         : paesir
 * Date           : 25. 2. 7.
 */

import com.nexterp.accounting.dto.InvoiceDTO;
import com.nexterp.accounting.dto.InvoiceItemDTO;
import com.nexterp.accounting.dto.JournalEntryDTO;
import com.nexterp.accounting.dto.TransactionDTO;
import com.nexterp.accounting.entity.JournalEntry;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.entity.TransactionType;
import com.nexterp.accounting.entity.VAT;
import com.nexterp.accounting.repository.InvoiceItemRepository;
import com.nexterp.accounting.repository.InvoiceRepository;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import com.nexterp.accounting.service.*;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.employee.entity.Employee;
import com.nexterp.product.dto.OrderDTO;
import com.nexterp.product.entity.Order;
import com.nexterp.product.entity.OrderType;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Log4j2
@Service
@Transactional
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

  private final ProductRepository productRepository;
  private final ClientRepository clientRepository;
  private final TransactionService transactionService;
  private final TransactionRepository transactionRepository;
  private final OrderService orderService;
  private final OrderRepository orderRepository;
  private final AccountService accountService;
  private final JournalEntryService journalEntryService;
  private final JournalEntryRepository journalEntryRepository;
  private final VATService vatService;
  private final InvoiceService invoiceService;
  private final InvoiceRepository invoiceRepository;
  private final InvoiceItemService invoiceItemService;
  private final InvoiceItemRepository invoiceItemRepository;

  @Override
  public void processPurchase(Long productId, int quantity, BigDecimal purchasePrice, String supplierCode, String paymentAccountId, Employee employee, RequestStatus requestStatus, LocalDate purchaseDate, String memo) {
    // 1. 제품 재고 증가
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));

    product.setStock(product.getStock() + quantity);
    productRepository.save(product);
    log.info("제품 재고 증가 완료 - 현재 재고: {}", product.getStock());

    // 2. 매입 금액, 부가세, 총 금액 계산
    BigDecimal purchaseAmount = purchasePrice.multiply(BigDecimal.valueOf(quantity));
    BigDecimal vatAmount = purchaseAmount.multiply(BigDecimal.valueOf(0.10)); // VAT (10%)
    BigDecimal totalAmount = purchaseAmount.add(vatAmount);
    log.info("구매 금액: {}, VAT: {}, 총 금액: {}", purchaseAmount, vatAmount, totalAmount);

    // 3. Transaction 생성
    TransactionDTO transactionDTO = TransactionDTO.builder()
        .amount(totalAmount)
        .type(TransactionType.PURCHASE)
        .description("공급업체로부터 구매: " + supplierCode)
        .date(purchaseDate)
        .build();

    TransactionDTO savedTransactionDTO = transactionService.createTransaction(transactionDTO);

    // 4. Journal Entry 생성
    createJournalEntries(savedTransactionDTO, purchaseAmount, vatAmount, paymentAccountId, purchaseDate);

    // 5. VAT 처리
    vatService.createVAT(savedTransactionDTO.getId(), BigDecimal.valueOf(0.10), purchaseAmount);

    // 6. Invoice 생성
    InvoiceDTO invoiceDTO = InvoiceDTO.builder()
        .invoiceNumber("PUR" + savedTransactionDTO.getId())
        .date(purchaseDate)
        .buyer("My Company")
        .seller("Supplier " + supplierCode)
        .totalAmount(totalAmount)
        .vatAmount(vatAmount)
        .description("구매 명세서, 거래 ID: " + savedTransactionDTO.getId())
        .build();

    InvoiceDTO savedInvoiceDTO = invoiceService.createInvoice(invoiceDTO, savedTransactionDTO.getId());

    // 7. InvoiceItem 생성 (VAT 포함)
    createInvoiceItems(savedInvoiceDTO, product, purchasePrice, quantity, vatAmount);

    // 8. 공급업체 정보 설정
    Client supplier = clientRepository.findByClientCode(supplierCode)
        .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
    log.info("공급업체 - ID: {}", supplier.getId());

    // 9. 주문 생성
    OrderDTO orderDTO = OrderDTO.builder()
        .transactionId(savedTransactionDTO.getId())
        .productId(productId)
        .clientCode(supplierCode)
        .employeeId(employee.getId())
        .orderCount(quantity)
        .orderType(OrderType.PURCHASE)
        .memo(memo)
        .build();

    orderService.createOrder(orderDTO);
  }


  @Override
  public void approvePurchase(Long transactionId) {
    // 1. 주문 조회 및 승인 가능 상태 확인
    Order order = orderRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (order.getRequestStatus() != RequestStatus.PENDING) {
      throw new IllegalStateException("Only pending orders can be approved");
    }

    // 2. 주문 상태를 APPROVED로 변경
    order.setRequestStatus(RequestStatus.APPROVED);
    orderRepository.save(order);
    log.info("구매 승인 완료 - 주문 ID: {}, 상태: {}", order.getId(), order.getRequestStatus());

    // 3. JournalEntry에서 transactionId 기준으로 모든 계정 정보 조회
    List<JournalEntry> journalEntries = journalEntryRepository.findByTransactionId(transactionId);

    if (journalEntries.isEmpty()) {
      throw new IllegalStateException("No journal entries found for transaction: " + transactionId);
    }

    // 4. 계정 유형별 분리하여 Balance 업데이트
    for (JournalEntry entry : journalEntries) {
      String accountCode = entry.getAccount().getCode();
      BigDecimal debitAmount = entry.getDebit();
      BigDecimal creditAmount = entry.getCredit();
      BigDecimal amountToUpdate = BigDecimal.ZERO;

      int accountType = Integer.parseInt(accountCode.substring(0, 1)) * 100;

      amountToUpdate = switch (accountType) {
        case 100 -> debitAmount.subtract(creditAmount);  // 자산 (Asset) 100번대
        case 200, 300, 400 -> creditAmount.subtract(debitAmount); // 부채, 자본, 수익 200~400번대
        case 500 -> debitAmount.add(creditAmount);  // 비용 (Expense) 500번대
        default -> throw new IllegalArgumentException("지원되지 않는 계정 코드: " + accountCode);
      };

      accountService.updateBalance(accountCode, amountToUpdate);
      log.info(" Account 업데이트 - 계정: {}, 변경 금액: {}", accountCode, amountToUpdate);
    }
    log.info("승인 완료 - transactionId: {}", transactionId);
  }

  @Override
  public void rejectPurchase(Long transactionId) {
    // 1. 주문 조회 및 반려 가능 상태 확인
    Order order = orderRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (order.getRequestStatus() != RequestStatus.PENDING) {
      throw new IllegalStateException("Only pending orders can be rejected");
    }

    // 2. 제품 재고 복구
    Product product = productRepository.findById(order.getProduct().getId())
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));

    product.setStock(product.getStock() - order.getOrderCount());
    productRepository.save(product);
    log.info("제품 재고 복구 완료 - 제품명: {}, 현재 재고: {}", product.getProductName(), product.getStock());

    // 3. 주문 상태를 REJECTED로 변경
    order.setRequestStatus(RequestStatus.REJECTED);
    orderRepository.save(order);
    log.info("주문 반려 처리 완료 - 주문 ID: {}, 상태: {}", order.getId(), order.getRequestStatus());

    // 4. 기존 트랜잭션을 REFUND 타입으로 변경
    Transaction transaction = transactionRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

    transaction.setType(TransactionType.REFUND);
    transaction.setDescription(transaction.getDescription() + " (승인 거절됨)");
    transactionRepository.save(transaction);
    log.info("트랜잭션 상태 변경 완료 - ID: {}", transaction.getId());


    // 5. 관련된 데이터 삭제 처리
    invoiceItemRepository.deleteByInvoiceId(transactionId);
    invoiceRepository.deleteByTransactionId(transactionId);
    journalEntryRepository.deleteByTransactionId(transactionId);
    log.info("rejectPurchase 완료 - transactionId: {}", transactionId);
  }

  @Override
  public void refundPurchase(Long transactionId) {
    // 1. 주문 조회 및 환불 가능 상태 확인
    Order order = orderRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (order.getRequestStatus() != RequestStatus.APPROVED) {
      throw new IllegalStateException("Only approved orders can be refunded");
    }

    // 2. 제품 재고 차감 (구매 환불이므로 차감)
    Product product = productRepository.findById(order.getProduct().getId())
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));

    product.setStock(product.getStock() - order.getOrderCount());
    productRepository.save(product);
    log.info("제품 재고 차감 완료 - 제품명: {}, 현재 재고: {}", product.getProductName(), product.getStock());

    // 3. 주문 상태를 REFUNDED로 변경
    order.setRequestStatus(RequestStatus.REFUNDED);
    orderRepository.save(order);
    log.info("주문 환불 처리 완료 - 주문 ID: {}, 상태: {}", order.getId(), order.getRequestStatus());

    // 4. 기존 트랜잭션을 REFUND 타입으로 변경
    Transaction transaction = transactionRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

    transaction.setType(TransactionType.REFUND);
    transaction.setDescription(transaction.getDescription() + " (반품 처리됨)");
    transactionRepository.save(transaction);
    log.info("트랜잭션 상태 변경 완료 - ID: {}", transaction.getId());


    // 4. 승인 시 반영되었던 Account 업데이트를 반대로 적용
    List<JournalEntry> journalEntries = journalEntryRepository.findByTransactionId(transactionId);

    if (journalEntries.isEmpty()) {
      throw new IllegalStateException("No journal entries found for transaction: " + transactionId);
    }

    // 5. 계정 유형별로 반대로 처리
    for (JournalEntry entry : journalEntries) {
      String accountCode = entry.getAccount().getCode();
      BigDecimal debitAmount = entry.getDebit();
      BigDecimal creditAmount = entry.getCredit();
      BigDecimal amountToUpdate = BigDecimal.ZERO;

      int accountType = Integer.parseInt(accountCode.substring(0, 1)) * 100;

      amountToUpdate = switch (accountType) {
        case 100 -> creditAmount.subtract(debitAmount);
        case 200, 300, 400 -> debitAmount.subtract(creditAmount);
        case 500 -> creditAmount.subtract(debitAmount);
        default -> throw new IllegalArgumentException("지원되지 않는 계정 코드: " + accountCode);
      };
      accountService.updateBalance(accountCode, amountToUpdate);
    }

    // 6. 관련된 데이터 삭제 처리
    invoiceItemRepository.deleteByInvoiceId(transactionId);
    invoiceRepository.deleteByTransactionId(transactionId);
    journalEntryRepository.deleteByTransactionId(transactionId);
    log.info("refundPurchase 완료 - transactionId: {}", transactionId);
  }

  // Journal Entry 생성 메서드
  private void createJournalEntries(TransactionDTO transaction, BigDecimal purchaseAmount, BigDecimal vatAmount, String paymentAccountId, LocalDate purchaseDate) {
    // 1. 재고 자산 증가 (차변)
    journalEntryService.createJournalEntry(
        JournalEntryDTO.builder()
            .date(purchaseDate)
            .accountCode("120")
            .debit(purchaseAmount)
            .credit(BigDecimal.ZERO)
            .amount(purchaseAmount)
            .transactionId(transaction.getId())
            .description("구매로 인한 재고 자산 증가")
            .build()
    );

    // 2. 지급 계정 대변 (지출)
    journalEntryService.createJournalEntry(
        JournalEntryDTO.builder()
            .date(purchaseDate)
            .accountCode(paymentAccountId)
            .debit(BigDecimal.ZERO)
            .credit(purchaseAmount.add(vatAmount))
            .amount(purchaseAmount.add(vatAmount))
            .transactionId(transaction.getId())
            .description(getPaymentDescription(paymentAccountId))
            .build()
    );

    // 3. VAT 대급금(prepaid) (150) 증가 (차변)
    journalEntryService.createJournalEntry(
        JournalEntryDTO.builder()
            .date(purchaseDate)
            .accountCode("150")
            .debit(vatAmount)
            .credit(BigDecimal.ZERO)
            .amount(vatAmount)
            .transactionId(transaction.getId())
            .description("구매로 인한 VAT 대급금 증가")
            .build()
    );
  }

  private String getPaymentDescription(String paymentAccountId) {
    return switch (paymentAccountId) {
      case "101" -> "구매로 인한 현금 계정 감소";
      case "201" -> "구매로 인한 매입채무 계정 증가";
      default -> "구매로 인한 기타 지급 계정 감소";
    };
  }

  // InvoiceItem 생성 메서드
  private void createInvoiceItems(InvoiceDTO invoice, Product product, BigDecimal unitPrice, int quantity, BigDecimal vatAmount) {
    invoiceItemService.createInvoiceItem(
        InvoiceItemDTO.builder()
            .invoiceId(invoice.getId())
            .itemName(product.getProductName())
            .quantity(quantity)
            .unitPrice(unitPrice)
            .totalPrice(unitPrice.multiply(BigDecimal.valueOf(quantity)))
            .build()
    );

    invoiceItemService.createInvoiceItem(
        InvoiceItemDTO.builder()
            .invoiceId(invoice.getId())
            .itemName(product.getProductName() + " 부가세 (VAT)")
            .quantity(1)
            .unitPrice(vatAmount)
            .totalPrice(vatAmount)
            .build()
    );
  }
}