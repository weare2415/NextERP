package com.nexterp.product.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : PurchaseTest
 * Author         : paesir
 * Date           : 25. 2. 10.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 10.오전 11:41  paesir      최초 생성
 */

import com.nexterp.accounting.repository.InvoiceRepository;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.entity.Order;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Log4j2
@SpringBootTest
public class PurchaseTest {
  @Autowired
  private PurchaseService purchaseService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ClientRepository clientRepository;

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private TransactionRepository transactionRepository;

  @Autowired
  private JournalEntryRepository journalEntryRepository;

  @Autowired
  private InvoiceRepository invoiceRepository;
  @Autowired
  private OrderRepository orderRepository;

  private static final Integer EMPLOYEE_ID = 20001234; // 미리 제공된 직원 ID
  private static final Long CLIENT_ID = 1L; // 미리 제공된 고객 ID
  private static final Long PRODUCT_ID = 1L; // 미리 제공된 상품 ID
  private static final String PAYMENT_ACCOUNT_ID = "201"; // 매입채무 계정
  private static final int QUANTITY = 2; // 구매 수량
  private static final String MEMO = "테스트 구매";
  private static final BigDecimal PURCHASE_PRICE = BigDecimal.valueOf(50000); // 상품 단가

  private Employee employee;
  private Client client;
  private Product product;

  @Test
  void testPurchase() {
    Product product = productRepository.findById(PRODUCT_ID)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    Client client = clientRepository.findById(CLIENT_ID)
        .orElseThrow(() -> new IllegalArgumentException("Client not found"));
    Employee employee = employeeRepository.findById(EMPLOYEE_ID)
        .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

    BigDecimal purchasePrice = product.getPurchasePrice();

    purchaseService.processPurchase(PRODUCT_ID,QUANTITY,purchasePrice,client.getClientCode(),
        PAYMENT_ACCOUNT_ID,employee, RequestStatus.PENDING,MEMO);
  }

  private static final Long TRANSACTION_ID = 2L;
  @Test
  void testApprovePurchase() {
    // 1. PENDING 상태의 주문이 존재하는지 확인
    Order order = orderRepository.findById(TRANSACTION_ID)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    assertEquals(RequestStatus.PENDING, order.getRequestStatus(), "🚨 주문 상태가 PENDING이어야 합니다.");

    // 2. 승인 실행
    purchaseService.approvePurchase(TRANSACTION_ID);
  }

  @Test
  void refundPurchase() {
    // 1. PENDING 상태의 주문이 존재하는지 확인
    Order order = orderRepository.findById(TRANSACTION_ID)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    assertEquals(RequestStatus.APPROVED, order.getRequestStatus(), "🚨 주문 상태가 PENDING이어야 합니다.");

    // 2. 승인 실행
    purchaseService.refundPurchase(TRANSACTION_ID);
  }
}
