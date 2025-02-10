/*
package com.nexterp.product;

import com.nexterp.accounting.entity.*;
import com.nexterp.accounting.repository.*;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.order.entity.Order;
import com.nexterp.product.entity.Product;
import com.nexterp.order.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import com.nexterp.product.service.SaleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SaleServiceTest {

    @Autowired
    private SaleService saleService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private VATRepository vatRepository;

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    public void testCreateSaleTransactionWithCash() {
        testCreateSaleTransaction("101"); // 현금 계정 테스트
    }

    @Test
    public void testCreateSaleTransactionWithReceivable() {
        testCreateSaleTransaction("110"); // 매출채권 계정 테스트
    }

    private void testCreateSaleTransaction(String paymentAccountId) {
        // Given: 이미 등록된 제품을 조회
        Long productId = 5L;  // 테스트용으로 이미 등록된 제품 ID를 지정
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ✅ 실제 DB에 있는 employeeId 사용
        Integer employeeId = 12341234; // 실제 백엔드 DB에 있는 employeeId
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));

        saleService.processSale(productId, 2, BigDecimal.valueOf(2000), "TW", paymentAccountId, employee, RequestStatus.PENDING);

        // 제품이 잘 조회되었는지 확인
        assertNotNull(product, "Product should not be null");

        // 이전 재고 수량 기록
        int initialStock = product.getStock();

        int quantityToSell = 2;
        BigDecimal salePrice = BigDecimal.valueOf(2000);  // 제품 가격
        BigDecimal saleAmount = salePrice.multiply(BigDecimal.valueOf(quantityToSell)); // 총 판매 금액
        BigDecimal vatAmount = saleAmount.multiply(BigDecimal.valueOf(0.10)); // 부가세 10%
        BigDecimal totalAmount = saleAmount.add(vatAmount); // 총 금액

        // 지급 계정의 기존 잔액 확인
        Account paymentAccount = accountRepository.findById(paymentAccountId)
                .orElseThrow(() -> new RuntimeException("Payment account not found: " + paymentAccountId));
        BigDecimal initialPaymentBalance = paymentAccount.getBalance();

        // 부가세 계정(210)의 기존 잔액 확인
        Account vatAccount = accountRepository.findById("210")
                .orElseThrow(() -> new RuntimeException("VAT account not found"));
        BigDecimal initialVatBalance = vatAccount.getBalance();

        // 2. 재고 자산 계정(120)의 기존 잔액 확인
        Account inventoryAccount = accountRepository.findById("120")
                .orElseThrow(() -> new RuntimeException("Inventory asset account not found"));
        BigDecimal initialInventoryBalance = inventoryAccount.getBalance();

        // 매출원가(COGS) 계정(520)의 기존 잔액 확인
        Account cogsAccount = accountRepository.findById("520")
                .orElseThrow(() -> new RuntimeException("COGS account not found"));
        BigDecimal initialCogsBalance = cogsAccount.getBalance();

        // Then: 재고가 예상대로 업데이트 되었는지 확인
        Product updatedProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 판매된 수량만큼 재고가 감소했는지 확인
        assertEquals(initialStock - quantityToSell, updatedProduct.getStock(),
                "Product stock should be reduced by the quantity sold");

        // 2. 거래가 잘 생성되었는지 확인
        List<Transaction> transactions = transactionRepository.findAll();
        assertFalse(transactions.isEmpty(), "Transaction should not be empty");

        // 3. 분개(JournalEntry)가 잘 생성되었는지 확인
        List<JournalEntry> journalEntries = journalEntryRepository.findAll();
        assertFalse(journalEntries.isEmpty(), "Journal entries should not be empty");

        // 4. 인보이스(Invoice)가 잘 생성되었는지 확인
        List<Invoice> invoices = invoiceRepository.findAll();
        assertFalse(invoices.isEmpty(), "Invoices should not be empty");

        // 5. 인보이스 항목(InvoiceItem)이 잘 생성되었는지 확인
        List<InvoiceItem> invoiceItems = invoiceItemRepository.findAll();
        assertFalse(invoiceItems.isEmpty(), "Invoice items should not be empty");

        // 6. 지급 계정의 잔액 검증
        Account updatedPaymentAccount = accountRepository.findById(paymentAccountId)
                .orElseThrow(() -> new RuntimeException("Payment account not found"));
        BigDecimal expectedPaymentBalance = initialPaymentBalance.add(totalAmount); // 총 금액(판매 금액 + VAT)
        assertEquals(expectedPaymentBalance, updatedPaymentAccount.getBalance(),
                paymentAccountId + " account balance should increase by the total amount (sale + VAT)");

        // 7. 부가세 계정(210)의 잔액 검증
        Account updatedVatAccount = accountRepository.findById("210")
                .orElseThrow(() -> new RuntimeException("VAT account not found"));
        BigDecimal expectedVatBalance = initialVatBalance.add(vatAmount); // 부가세 금액만큼 증가
        assertEquals(expectedVatBalance, updatedVatAccount.getBalance(),
                "VAT account balance should increase by the VAT amount");

        // 8. 재고 자산 계정(120)의 잔액 검증
        Account updatedInventoryAccount = accountRepository.findById("120")
                .orElseThrow(() -> new RuntimeException("Inventory asset account not found"));
        BigDecimal expectedInventoryBalance = initialInventoryBalance.subtract(totalAmount); // 총 금액(판매 금액 + VAT) 차감
        assertEquals(expectedInventoryBalance, updatedInventoryAccount.getBalance(),
                "Inventory asset account balance should decrease by the total amount (sale + VAT)");

        // 9. 매출원가(COGS) 계정(520)의 잔액 검증
        Account updatedCogsAccount = accountRepository.findById("520")
                .orElseThrow(() -> new RuntimeException("COGS account not found"));
        BigDecimal expectedCogsBalance = initialCogsBalance.add(totalAmount); // 총 금액(판매 금액 + VAT)
        assertEquals(expectedCogsBalance, updatedCogsAccount.getBalance(),
                "COGS account balance should increase by the total amount (sale + VAT)");

        // 10. 부가세가 제대로 계산되고 저장되었는지 확인
        VAT vat = vatRepository.findByTransactionId(transactions.get(0).getId()); // 해당 거래 ID로 부가세 조회
        assertNotNull(vat, "VAT should be recorded for the transaction");

        // BigDecimal.compareTo()를 사용하여 값 비교
        assertEquals(0, vat.getVatAmount().compareTo(vatAmount), "VAT amount should match the calculated value");

        // ✅ 주문(Order) 생성 검증 추가
        List<Order> orders = orderRepository.findAll();
        assertFalse(orders.isEmpty(), "Orders should not be empty");

        Order order = orders.get(0);
        assertNotNull(order.getTransaction(), "Order should be linked to a transaction");
        assertEquals(productId, order.getProduct().getId(), "Order should be associated with the correct product");
        assertEquals(2L, order.getClient().getId(), "Order should be linked to the correct client");
    }
}
*/
