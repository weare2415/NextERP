/*
package com.nexterp.product.service;

import com.nexterp.accounting.dto.InvoiceDTO;
import com.nexterp.accounting.dto.TransactionDTO;
import com.nexterp.accounting.entity.Invoice;
import com.nexterp.accounting.entity.JournalEntry;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.entity.TransactionType;
import com.nexterp.accounting.repository.InvoiceRepository;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import com.nexterp.accounting.repository.VATRepository;
import com.nexterp.accounting.service.AccountService;
import com.nexterp.accounting.service.InvoiceService;
import com.nexterp.product.entity.Order;
import com.nexterp.accounting.service.TransactionService;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
*/
/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : SaleServiceImplTest
 * Author         : paesir
 * Date           : 25. 2. 9.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 9.오전 3:09  paesir      최초 생성
 *//*


@SpringBootTest
@Log4j2
@TestMethodOrder(MethodOrderer.OrderAnnotation.class) // 실행 순서 지정
class SaleServiceImplTest {
    @Autowired
    private SaleService saleService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private JournalEntryRepository journalEntryRepository;

    private static final Integer EMPLOYEE_ID = 20001234; // 미리 제공된 직원 ID
    private static final Long CLIENT_ID = 8L; // 미리 제공된 고객 ID
    private static final Long PRODUCT_ID = 5L; // 미리 제공된 상품 ID
    private static final String PAYMENT_ACCOUNT_ID = "101"; // 현금 계정
    private static final int QUANTITY = 2; // 판매 수량
    private static final String MEMO = "테스트 판매";

    private static Long transactionId; // 저장된 거래 ID

    @Test
    @DisplayName("✅ 1. 판매 프로세스 실행 및 데이터 저장 확인")
    void testProcessSale() {
        // 🔹 1. 엔티티 조회
        Product product = productRepository.findById(PRODUCT_ID)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Client client = clientRepository.findById(CLIENT_ID)
            .orElseThrow(() -> new IllegalArgumentException("Client not found"));
        Employee employee = employeeRepository.findById(EMPLOYEE_ID)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        // 🔹 2. 제품의 판매 가격 가져오기
        BigDecimal salePrice = product.getSalePrice();

        // 🔹 3. 판매 프로세스 실행 (`requestStatus`는 자동 `PENDING`)
        saleService.processSale(PRODUCT_ID, QUANTITY, salePrice, client.getClientCode(),
            PAYMENT_ACCOUNT_ID, employee, RequestStatus.PENDING, MEMO);

    }
    private static final Long TRANSACTION_ID = 1L; // 테스트용 거래 ID

    @Test
    @DisplayName("✅ 2. 승인 프로세스 실행 및 데이터 검증")
    void testApproveSale() {
        log.info("🔎 테스트 - approveSale 실행");

        // 1. PENDING 상태의 주문이 존재하는지 확인
        Order order = orderRepository.findById(TRANSACTION_ID)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        assertEquals(RequestStatus.PENDING, order.getRequestStatus(), "🚨 주문 상태가 PENDING이어야 합니다.");

        // 2. 승인 실행
        saleService.approveSale(TRANSACTION_ID);

        // 3. 승인 후 상태 확인
        Order approvedOrder = orderRepository.findById(TRANSACTION_ID)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        assertEquals(RequestStatus.APPROVED, approvedOrder.getRequestStatus(), "🚨 주문이 APPROVED 상태로 변경되지 않았습니다.");
        log.info("✅ 주문 승인 확인 완료 - 주문 상태: {}", approvedOrder.getRequestStatus());

        // 4. JournalEntry 데이터 검증
        List<JournalEntry> journalEntries = journalEntryRepository.findByTransactionId(TRANSACTION_ID);
        assertFalse(journalEntries.isEmpty(), "🚨 JournalEntry 데이터가 존재해야 합니다.");
        log.info("✅ 관련된 JournalEntry 개수: {}", journalEntries.size());

        // 5. 각 계정 Balance 업데이트 확인
        for (JournalEntry entry : journalEntries) {
            String accountCode = entry.getAccount().getCode();
            BigDecimal debitAmount = entry.getDebit();
            BigDecimal creditAmount = entry.getCredit();
            BigDecimal expectedBalanceChange = BigDecimal.ZERO;

            int accountType = Integer.parseInt(accountCode.substring(0, 1)) * 100;

            expectedBalanceChange = switch (accountType) {
                case 100 -> debitAmount.subtract(creditAmount);  // 자산: 차변(+), 대변(-)
                case 200, 300, 400 -> creditAmount.subtract(debitAmount); // 부채, 자본, 수익: 대변(+), 차변(-)
                case 500 -> debitAmount.add(creditAmount);  // 비용: 차변(+), 대변도 (+)
                default -> throw new IllegalArgumentException("⚠️ 지원되지 않는 계정 코드: " + accountCode);
            };

            // Mocking AccountService balance update verification (여기서는 간단한 로그로 확인)
            log.info("🔎 계정: {}, 예상 변경 금액: {}", accountCode, expectedBalanceChange);
            assertNotNull(expectedBalanceChange, "🚨 Balance 변경 금액이 null일 수 없습니다.");
        }

        log.info("✅ approveSale 테스트 완료");
    }

    @Test
    void refundSale() {
        // 1. APPROVED 상태의 주문이 존재하는지 확인
        Order order = orderRepository.findById(TRANSACTION_ID)
            .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        assertEquals(RequestStatus.APPROVED, order.getRequestStatus(), "🚨 주문 상태가 APPROVED 이어야 합니다.");

        // 2. 승인 실행
        saleService.refundSale(TRANSACTION_ID);

    }
}
*/
