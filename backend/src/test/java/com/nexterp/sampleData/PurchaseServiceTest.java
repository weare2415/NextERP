package com.nexterp.sampleData;

import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.entity.Order;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import com.nexterp.product.service.PurchaseService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class PurchaseServiceTest {

  @Autowired
  private PurchaseService purchaseService;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ClientRepository clientRepository;

  @Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private OrderRepository orderRepository;

  private String getStringCellValue(Cell cell) {
    if (cell == null) return "";
    return switch (cell.getCellType()) {
      case STRING -> cell.getStringCellValue().trim();
      case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
      case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
      default -> "";
    };
  }

  private List<PurchaseData> readExcelData() {
    List<PurchaseData> purchaseDataList = new ArrayList<>();

    try {
      ClassPathResource resource = new ClassPathResource("sample_purchase.xlsx");
      InputStream inputStream = resource.getInputStream();
      Workbook workbook = new XSSFWorkbook(inputStream);
      Sheet sheet = workbook.getSheetAt(0);

      Iterator<Row> rowIterator = sheet.iterator();
      rowIterator.next(); // 첫 번째 행(헤더) 건너뛰기

      while (rowIterator.hasNext()) {
        Row row = rowIterator.next();

        Long productId = (long) row.getCell(0).getNumericCellValue();
        int quantity = (int) row.getCell(1).getNumericCellValue();
        BigDecimal purchasePrice = new BigDecimal(row.getCell(2).getNumericCellValue());
        Long clientId = (long) row.getCell(3).getNumericCellValue();
        String paymentAccountId = getStringCellValue(row.getCell(4)); // 수정된 부분
        Integer employeeId = (int) row.getCell(5).getNumericCellValue();

        purchaseDataList.add(new PurchaseData(productId, quantity, purchasePrice, clientId, paymentAccountId, employeeId));
      }
      workbook.close();
    } catch (Exception e) {
      e.printStackTrace();
    }

    return purchaseDataList;
  }

  @Test
  void testBulkPurchase() {
    List<PurchaseData> purchaseDataList = readExcelData();

    for (PurchaseData data : purchaseDataList) {
      Product product = productRepository.findById(data.getProductId())
          .orElseThrow(() -> new IllegalArgumentException("Product not found"));
      Client client = clientRepository.findById(data.getClientId())
          .orElseThrow(() -> new IllegalArgumentException("Client not found"));
      Employee employee = employeeRepository.findById(data.getEmployeeId())
          .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

      purchaseService.processPurchase(
          data.getProductId(),
          data.getQuantity(),
          data.getPurchasePrice(),
          client.getClientCode(),
          data.getPaymentAccountId(),
          employee,
          RequestStatus.PENDING,
          "엑셀 테스트 구매"
      );
    }
  }

  // 엑셀 데이터 저장용 DTO
  static class PurchaseData {
    private Long productId;
    private int quantity;
    private BigDecimal purchasePrice;
    private Long clientId;
    private String paymentAccountId;
    private Integer employeeId;

    public PurchaseData(Long productId, int quantity, BigDecimal purchasePrice, Long clientId, String paymentAccountId, Integer employeeId) {
      this.productId = productId;
      this.quantity = quantity;
      this.purchasePrice = purchasePrice;
      this.clientId = clientId;
      this.paymentAccountId = paymentAccountId;
      this.employeeId = employeeId;
    }

    public Long getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public Long getClientId() { return clientId; }
    public String getPaymentAccountId() { return paymentAccountId; }
    public Integer getEmployeeId() { return employeeId; }
  }

  private static final Long TRANSACTION_START_ID = 1L;
  private static final Long TRANSACTION_END_ID = 30L;

  @Test
  void testApproveMultiplePurchases() {
    for (long transactionId = TRANSACTION_START_ID; transactionId <= TRANSACTION_END_ID; transactionId++) {
      Long currentTransactionId = transactionId;

      // 1. PENDING 상태의 주문이 존재하는지 확인
      Order order = orderRepository.findById(currentTransactionId)
          .orElseThrow(() -> new IllegalArgumentException("Order not found: " + currentTransactionId));

      assertEquals(RequestStatus.PENDING, order.getRequestStatus(),
          "🚨 주문 상태가 PENDING이어야 합니다. (Transaction ID: " + currentTransactionId + ")");

      // 2. 승인 실행
      purchaseService.approvePurchase(currentTransactionId);

      // 3. 변경된 상태 확인
      Order approvedOrder = orderRepository.findById(currentTransactionId)
          .orElseThrow(() -> new IllegalArgumentException("Order not found after approval: " + currentTransactionId));

      assertEquals(RequestStatus.APPROVED, approvedOrder.getRequestStatus(),
          "🚨 주문 상태가 APPROVED로 변경되어야 합니다. (Transaction ID: " + currentTransactionId + ")");
    }
  }
}