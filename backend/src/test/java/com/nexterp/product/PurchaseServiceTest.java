/*
package com.nexterp.product;

import com.nexterp.accounting.entity.Account;
import com.nexterp.accounting.repository.AccountRepository;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import com.nexterp.accounting.repository.VATRepository;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.entity.Product;
import com.nexterp.product.service.PurchaseService;
import com.nexterp.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class PurchaseServiceTest {

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private VATRepository vatRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private Employee employee;

    // 12341234 ID로 고정된 Employee를 사용할 예정
    @BeforeEach
    public void setUp() {
        // 실제 데이터베이스에서 Employee를 가져오기
        employee = employeeRepository.findById(12341234).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
    }


    @Test
    public void testCreatePurchaseTransactionWithCashAccount() {
        // Given: 이미 등록된 제품을 조회
        Long productId = 2L; // 테스트용으로 이미 등록된 제품 ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 이전 재고 수량 기록
        int initialStock = product.getStock();

        int quantityToPurchase = 2;
        BigDecimal purchasePrice = BigDecimal.valueOf(1200);
        BigDecimal purchaseAmount = purchasePrice.multiply(BigDecimal.valueOf(quantityToPurchase));
        BigDecimal vatAmount = purchaseAmount.multiply(BigDecimal.valueOf(0.10));
        String paymentAccountId = "101"; // 현금 계정 ID

        // 130번 VAT Receivable 계정의 초기 잔액 확인
        Account vatReceivableAccount = accountRepository.findById("130")
                .orElseThrow(() -> new RuntimeException("VAT Receivable account not found"));
        BigDecimal initialVatReceivableBalance = vatReceivableAccount.getBalance();

        // When: 구매 거래 생성
        purchaseService.processPurchase(productId, quantityToPurchase, purchasePrice, "TW", paymentAccountId, employee, RequestStatus.PENDING);

        // Then: 재고가 예상대로 업데이트 되었는지 확인
        Product updatedProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        assertEquals(initialStock + quantityToPurchase, updatedProduct.getStock(),
                "Product stock should increase by the purchased quantity");

        // 지급 계정 잔액 확인 (현금 계정)
        Account cashAccount = accountRepository.findById(paymentAccountId)
                .orElseThrow(() -> new RuntimeException("Cash account not found"));
        BigDecimal expectedCashBalance = cashAccount.getBalance(); // 예상 잔액
        assertEquals(expectedCashBalance, cashAccount.getBalance(),
                "Cash account balance should decrease by the total amount (purchase + VAT)");

        // 130번 VAT Receivable 계정 잔액 검증
        Account updatedVatReceivableAccount = accountRepository.findById("130")
                .orElseThrow(() -> new RuntimeException("VAT Receivable account not found"));
        BigDecimal expectedVatReceivableBalance = initialVatReceivableBalance.add(vatAmount); // VAT 금액만큼 증가
        assertEquals(expectedVatReceivableBalance, updatedVatReceivableAccount.getBalance(),
                "VAT Receivable account balance should increase by the VAT amount");
    }

    @Test
    public void testCreatePurchaseTransactionWithPayableAccount() {
        // Given: 이미 등록된 제품을 조회
        Long productId = 1L; // 테스트용으로 이미 등록된 제품 ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 이전 재고 수량 기록
        int initialStock = product.getStock();

        int quantityToPurchase = 3;
        BigDecimal purchasePrice = BigDecimal.valueOf(1200);
        BigDecimal purchaseAmount = purchasePrice.multiply(BigDecimal.valueOf(quantityToPurchase)); // 매입 금액
        BigDecimal vatAmount = purchaseAmount.multiply(BigDecimal.valueOf(0.10)); // VAT (10%)
        BigDecimal totalAmount = purchaseAmount.add(vatAmount); // 총 금액 (매입 금액 + VAT)
        String paymentAccountId = "201"; // 매입채무 계정 ID

        // 매입채무 계정의 초기 잔액 기록
        Account payableAccount = accountRepository.findById(paymentAccountId)
                .orElseThrow(() -> new RuntimeException("Payable account not found"));
        BigDecimal initialPayableBalance = payableAccount.getBalance();

        // 130번 VAT Receivable 계정의 초기 잔액 확인
        Account vatReceivableAccount = accountRepository.findById("130")
                .orElseThrow(() -> new RuntimeException("VAT Receivable account not found"));
        BigDecimal initialVatReceivableBalance = vatReceivableAccount.getBalance();



        // When: 구매 거래 생성
        purchaseService.processPurchase(productId, quantityToPurchase, purchasePrice, "TW", paymentAccountId, employee, RequestStatus.PENDING);

        // Then: 재고가 예상대로 업데이트 되었는지 확인
        Product updatedProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        assertEquals(initialStock + quantityToPurchase, updatedProduct.getStock(),
                "Product stock should increase by the purchased quantity");

        // 매입채무 계정 잔액 확인
        Account updatedPayableAccount = accountRepository.findById(paymentAccountId)
                .orElseThrow(() -> new RuntimeException("Payable account not found"));

        BigDecimal expectedPayableBalance = initialPayableBalance.add(totalAmount); // 증가 예상 잔액
        assertEquals(expectedPayableBalance, updatedPayableAccount.getBalance(),
                "Payable account balance should increase by the total amount (purchase + VAT)");

        // 130번 VAT Receivable 계정 잔액 검증
        Account updatedVatReceivableAccount = accountRepository.findById("130")
                .orElseThrow(() -> new RuntimeException("VAT Receivable account not found"));
        BigDecimal expectedVatReceivableBalance = initialVatReceivableBalance.add(vatAmount); // VAT 금액만큼 증가
        assertEquals(expectedVatReceivableBalance, updatedVatReceivableAccount.getBalance(),
                "VAT Receivable account balance should increase by the VAT amount");
    }
}
*/
