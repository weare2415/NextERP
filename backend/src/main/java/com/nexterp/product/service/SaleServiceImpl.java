package com.nexterp.product.service;

/*
 * Description    : 매출 서비스 구현
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : SaleServiceImpl
 * Author         : paesir
 * Date           : 25. 2. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 7.오후 12:42  paesir      최초 생성
 */

import com.nexterp.accounting.dto.InvoiceDTO;
import com.nexterp.accounting.dto.InvoiceItemDTO;
import com.nexterp.accounting.dto.JournalEntryDTO;
import com.nexterp.accounting.dto.TransactionDTO;
import com.nexterp.accounting.entity.JournalEntry;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.entity.TransactionType;
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
public class SaleServiceImpl implements SaleService {

  private final ProductRepository productRepository;
  private final ClientRepository clientRepository;
  private final TransactionService transactionService;
  private final OrderService orderService;
  private final AccountService accountService;
  private final JournalEntryService journalEntryService;
  private final VATService vatService;
  private final InvoiceService invoiceService;
  private final InvoiceItemService invoiceItemService;
  private final OrderRepository orderRepository;
  private final JournalEntryRepository journalEntryRepository;
  private final InvoiceItemRepository invoiceItemRepository;
  private final InvoiceRepository invoiceRepository;
  private final TransactionRepository transactionRepository;

  @Override
  public void processSale(Long productId, int quantity, BigDecimal salePrice, String clientCode, String paymentAccountId, Employee employee, RequestStatus requestStatus, LocalDate saleDate, String memo) {
    // 1. 제품 재고 차감
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));

    if (product.getStock() < quantity) {
      log.error("재고 부족 - 요청 수량: {}, 현재 재고: {}", quantity, product.getStock());
      throw new IllegalArgumentException("Not enough stock available");
    }

    product.setStock(product.getStock() - quantity);
    productRepository.save(product);
    log.info("제품 재고 차감 완료 - 남은 재고: {}", product.getStock());


    // 2. 판매 금액, 부가세, 총 금액 계산
    BigDecimal saleAmount = salePrice.multiply(BigDecimal.valueOf(quantity));
    BigDecimal vatAmount = saleAmount.multiply(BigDecimal.valueOf(0.10));
    BigDecimal totalAmount = saleAmount.add(vatAmount);
    BigDecimal purchaseAmount = product.getPurchasePrice().multiply(BigDecimal.valueOf(quantity));
    BigDecimal operatingProfit = saleAmount.subtract(purchaseAmount);
    log.info("판매금액: {}, VAT: {}, 총 금액: {}, 매출원가: {}, 영업이익: {}", saleAmount, vatAmount, totalAmount, purchaseAmount, operatingProfit);


    // 3. TransactionDTO 생성 후 createTransaction 호출
    TransactionDTO transactionDTO = TransactionDTO.builder()
        .amount(totalAmount)
        .type(TransactionType.SALE)
        .description("구매한 고객: " + clientCode)
        .date(saleDate)
        .build();

    TransactionDTO savedTransactionDTO = transactionService.createTransaction(transactionDTO);

    // 4. 매출 계정 증가에 따른 Journal Entry (대변) 생성
    journalEntryService.createJournalEntry(
        JournalEntryDTO.builder()
            .date(saleDate)
            .accountCode("401")
            .debit(BigDecimal.ZERO)
            .credit(saleAmount)
            .amount(saleAmount)
            .transactionId(savedTransactionDTO.getId())
            .description("매출 계정 반영, 거래 ID: " + savedTransactionDTO.getId())
            .build()
    );

    // 5. 지급 계정 증가에 대한 Journal Entry(차변) 생성
    String paymentDescription = getPaymentDescription(paymentAccountId) + ", 거래 ID: " + savedTransactionDTO.getId();

    JournalEntryDTO paymentDebitEntryDTO = JournalEntryDTO.builder()
        .date(saleDate)
        .accountCode(paymentAccountId)
        .debit(saleAmount)
        .credit(BigDecimal.ZERO)
        .amount(saleAmount)
        .transactionId(savedTransactionDTO.getId())
        .description(paymentDescription)
        .build();

    journalEntryService.createJournalEntry(paymentDebitEntryDTO);

    // 6. 재고 자산 감소에 대한 Journal Entry(대변) 생성
    String inventoryDescription = "재고 감소 반영 (COGS), 거래 ID:: " + savedTransactionDTO.getId();

    JournalEntryDTO inventoryCreditEntryDTO = JournalEntryDTO.builder()
        .date(saleDate)
        .accountCode("120")
        .debit(BigDecimal.ZERO)
        .credit(purchaseAmount)
        .amount(purchaseAmount)
        .transactionId(savedTransactionDTO.getId())
        .description(inventoryDescription)
        .build();
    journalEntryService.createJournalEntry(inventoryCreditEntryDTO);

    // 7. 매출원가 계정 Journal Entry(차변) 생성
    String cogsDescription = "매출원가 반영, 거래 ID: " + savedTransactionDTO.getId();

    JournalEntryDTO cogsDebitEntryDTO = JournalEntryDTO.builder()
        .date(saleDate)
        .accountCode("520")
        .debit(purchaseAmount)
        .credit(BigDecimal.ZERO)
        .amount(purchaseAmount)
        .transactionId(savedTransactionDTO.getId())
        .description(cogsDescription)
        .build();
    journalEntryService.createJournalEntry(cogsDebitEntryDTO);

    // 8. 영업이익 차변 처리
    journalEntryService.createJournalEntry(
        JournalEntryDTO.builder()
            .date(saleDate)
            .accountCode("320")
            .debit(BigDecimal.ZERO)
            .credit(operatingProfit)
            .amount(operatingProfit)
            .transactionId(savedTransactionDTO.getId())
            .description("영업이익 반영, 거래 ID: " + savedTransactionDTO.getId())
            .build()
    );

    // 9. 부가세 관련 처리 (VAT) - VAT 생성
    vatService.createVAT(savedTransactionDTO.getId(), BigDecimal.valueOf(0.10), saleAmount);

    // 10. 부가세 Journal Entry 생성 (대변)
    JournalEntryDTO vatCreditEntryDTO = JournalEntryDTO.builder()
        .date(saleDate)
        .accountCode("210")
        .debit(BigDecimal.ZERO)
        .credit(vatAmount)
        .amount(vatAmount)
        .transactionId(savedTransactionDTO.getId())
        .description("판매 부가세, 거래 ID: " + savedTransactionDTO.getId())
        .build();
    journalEntryService.createJournalEntry(vatCreditEntryDTO);

    // 11. 부가세 지급 계좌 차변 처리 (부가세 입금)
    JournalEntryDTO vatDebitEntryDTO = JournalEntryDTO.builder()
        .date(saleDate)
        .accountCode(paymentAccountId)
        .debit(vatAmount)
        .credit(BigDecimal.ZERO)
        .amount(vatAmount)
        .transactionId(savedTransactionDTO.getId())
        .description("판매 부가세 입금, 거래 ID: " + savedTransactionDTO.getId())
        .build();
    journalEntryService.createJournalEntry(vatDebitEntryDTO);

    // 12. Invoice 생성
    InvoiceDTO invoiceDTO = InvoiceDTO.builder()
        .invoiceNumber("SALE" + savedTransactionDTO.getId())
        .date(saleDate)
        .buyer(clientCode)
        .seller("Next-ERP")
        .totalAmount(totalAmount)
        .vatAmount(vatAmount)
        .description("판매 명세서, 거래 ID: " + savedTransactionDTO.getId())
        .build();

    InvoiceDTO savedInvoiceDTO = invoiceService.createInvoice(invoiceDTO, savedTransactionDTO.getId());
    log.info("✅ Invoice 생성 요청 완료 - 응답 ID: {}", savedInvoiceDTO != null ? savedInvoiceDTO.getId() : "null");

    if (savedInvoiceDTO == null || savedInvoiceDTO.getId() == null) {
      throw new RuntimeException("Invoice 생성 실패! transactionId: " + savedTransactionDTO.getId());
    }

    // 13. InvoiceItem 생성
    InvoiceItemDTO invoiceItemDTO = InvoiceItemDTO.builder()
        .invoiceId(savedInvoiceDTO.getId())
        .itemName(product.getProductName())
        .quantity(quantity)
        .unitPrice(salePrice)
        .totalPrice(salePrice.multiply(BigDecimal.valueOf(quantity)))
        .build();

    InvoiceItemDTO savedInvoiceItemDTO = invoiceItemService.createInvoiceItem(invoiceItemDTO);
    log.info("InvoiceItem 생성 완료 - ID: {}", savedInvoiceItemDTO != null ? savedInvoiceItemDTO.getId() : "null");

    // 13-1. VAT에 대한 InvoiceItem 추가
    InvoiceItemDTO vatInvoiceItemDTO = InvoiceItemDTO.builder()
        .invoiceId(savedInvoiceDTO.getId())
        .itemName(product.getProductName() + "부가세 (VAT)")
        .quantity(1)
        .unitPrice(vatAmount)
        .totalPrice(vatAmount)
        .build();

    InvoiceItemDTO savedVatInvoiceItemDTO = invoiceItemService.createInvoiceItem(vatInvoiceItemDTO);
    log.info("VAT InvoiceItem 생성 완료 - ID: {}", savedVatInvoiceItemDTO != null ? savedVatInvoiceItemDTO.getId() : "null");

    // 14. 거래처 설정
    Client client = clientRepository.findByClientCode(clientCode)
        .orElseThrow(() -> new IllegalArgumentException("Client not found"));
    log.info("client - ID: {}", client != null ? client.getId() : "null");

    // 15. Order 설정
    OrderDTO orderDTO = OrderDTO.builder()
        .transactionId(savedTransactionDTO.getId())
        .productId(productId)
        .clientCode(clientCode)
        .employeeId(employee.getId())
        .orderCount(quantity)
        .orderType(OrderType.SALE)
        .memo(memo)
        .build();

    OrderDTO savedOrderDTO = orderService.createOrder(orderDTO);
    log.info("order - ID: {}", savedOrderDTO != null ? savedOrderDTO.getId() : "null");
  }

  @Override
  public void approveSale(Long transactionId) {
    // 1. 주문 조회 및 승인 가능 상태 확인
    Order order = orderRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (order.getRequestStatus() != RequestStatus.PENDING) {
      throw new IllegalStateException("Only pending orders can be approved");
    }

    // 2. 주문 상태를 APPROVED로 변경
    order.setRequestStatus(RequestStatus.APPROVED);
    orderRepository.save(order);
    log.info("주문 승인 완료 - 주문 ID: {}, 상태: {}", order.getId(), order.getRequestStatus());

    // 3. JournalEntry에서 transactionId 기준으로 모든 계정 정보 조회
    List<JournalEntry> journalEntries = journalEntryRepository.findByTransactionId(transactionId);

    if (journalEntries.isEmpty()) {
      throw new IllegalStateException("No journal entries found for transaction: " + transactionId);
    }

    // 4. 계정 유형별 분리하여 Balance 업데이트
    for (JournalEntry entry : journalEntries) {
      String accountCode = entry.getAccount().getCode();
      BigDecimal debitAmount = entry.getDebit();  // 차변 금액
      BigDecimal creditAmount = entry.getCredit(); // 대변 금액
      BigDecimal amountToUpdate = BigDecimal.ZERO;

      int accountType = Integer.parseInt(accountCode.substring(0, 1)) * 100;

      amountToUpdate = switch (accountType) {
        // 자산 (Asset) 100번대
        case 100 -> debitAmount.subtract(creditAmount);  // 차변 +, 대변 -
        // 부채 (Liability) 200번대
        // 자본 (Equity) 300번대
        // 수익 (Revenue) 400번대
        case 200, 300, 400 -> creditAmount.subtract(debitAmount); // 대변 +, 차변 -
        case 500 -> // 비용 (Expense) 500번대
            debitAmount.add(creditAmount);  // 대변 +, 차변 -
        default ->
            throw new IllegalArgumentException("지원되지 않는 계정 코드: " + accountCode);
      };

      accountService.updateBalance(accountCode, amountToUpdate);
      log.info(" Account(계정과목) 업데이트 - 계정: {}, 변경 금액: {}", accountCode, amountToUpdate);
    }
    log.info("승인 완료 - transactionId: {}", transactionId);
  }

  @Override
  public void rejectSale(Long transactionId) {
    // 1. 주문 조회 및 반려 가능 상태 확인
    Order order = orderRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (order.getRequestStatus() != RequestStatus.PENDING) {
      throw new IllegalStateException("Only pending orders can be rejected");
    }

    // 2. 제품 재고 복구
    Product product = productRepository.findById(order.getProduct().getId())
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));

    product.setStock(product.getStock() + order.getOrderCount());
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
    transaction.setDescription(transaction.getDescription() + " (환불 처리됨)");
    transactionRepository.save(transaction);
    log.info("트랜잭션 상태 변경 완료 - ID: {}", transaction.getId());

        // 5. 관련된 데이터 삭제 처리
    invoiceRepository.deleteByTransactionId(transactionId);
    log.info("Invoice 삭제 완료");
    invoiceItemRepository.deleteByInvoiceId(transactionId);
    log.info("InvoiceItem 삭제 완료");
    journalEntryRepository.deleteByTransactionId(transactionId);
    log.info("JournalEntry 삭제 완료");
    log.info("rejectSale 완료 - transactionId: {}", transactionId);
  }

  @Override
  public void refundSale(Long transactionId) {
    // 1. 주문 조회 및 환불 가능 상태 확인
    Order order = orderRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    if (order.getRequestStatus() != RequestStatus.APPROVED) {
      throw new IllegalStateException("Only approved orders can be refunded");
    }

    // 2. 제품 재고 복구
    Product product = productRepository.findById(order.getProduct().getId())
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));

    product.setStock(product.getStock() + order.getOrderCount());
    productRepository.save(product);
    log.info("제품 재고 복구 완료 - 제품명: {}, 현재 재고: {}", product.getProductName(), product.getStock());

    // 3. 주문 상태를 REFUNDED로 변경
    order.setRequestStatus(RequestStatus.REFUNDED);
    orderRepository.save(order);
    log.info("주문 환불 처리 완료 - 주문 ID: {}, 상태: {}", order.getId(), order.getRequestStatus());

    // 4. 기존 트랜잭션을 REFUND 타입으로 변경
    Transaction transaction = transactionRepository.findById(transactionId)
        .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

    transaction.setType(TransactionType.REFUND);
    transaction.setDescription(transaction.getDescription() + " (환불 처리됨)");
    transactionRepository.save(transaction);
    log.info("트랜잭션 상태 변경 완료 - ID: {}", transaction.getId());

    // 5. 승인 시 반영되었던 Account 업데이트를 반대로 적용
    List<JournalEntry> journalEntries = journalEntryRepository.findByTransactionId(transactionId);

    if (journalEntries.isEmpty()) {
      throw new IllegalStateException("No journal entries found for transaction: " + transactionId);
    }

    // 6. 계정 유형별로 반대로 처리
    for (JournalEntry entry : journalEntries) {
      String accountCode = entry.getAccount().getCode();
      BigDecimal debitAmount = entry.getDebit();  // 차변 금액
      BigDecimal creditAmount = entry.getCredit(); // 대변 금액
      BigDecimal amountToUpdate = BigDecimal.ZERO;

      int accountType = Integer.parseInt(accountCode.substring(0, 1)) * 100;

      amountToUpdate = switch (accountType) {
        case 100 -> creditAmount.subtract(debitAmount);  // 자산 (Asset): 대변 +, 차변 -
        case 200, 300, 400 -> debitAmount.subtract(creditAmount);  // 부채, 자본, 수익: 차변 +, 대변 -
        case 500 -> creditAmount.subtract(debitAmount);  // 비용 (Expense): 차변 +, 대변 -
        default -> throw new IllegalArgumentException("지원되지 않는 계정 코드: " + accountCode);
      };
      accountService.updateBalance(accountCode, amountToUpdate);
    }

    // 7. 관련된 데이터 삭제 처리
    invoiceItemRepository.deleteByInvoiceId(transactionId);
    invoiceRepository.deleteByTransactionId(transactionId);
    journalEntryRepository.deleteByTransactionId(transactionId);
    log.info("refundSale 완료 - transactionId: {}", transactionId);
  }

  private String getPaymentDescription(String paymentAccountId) {
    return switch (paymentAccountId) {
      case "101" -> "판매로 인한 현금 계정 증가";
      case "110" -> "판매로 인한 매출채권 계정 증가";
      default -> "판매로 인한 기타 지급 계정 증가";
    };
  }
}
