package com.nexterp.sampleData;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : SaleTest
 * Author         : paesir
 * Date           : 25. 2. 10.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 10.오후 6:53  paesir      최초 생성
 */

import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.entity.Order;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import com.nexterp.product.service.SaleService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class SaleServiceTest {
  @Autowired
  private SaleService saleService;

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

  private List<SaleData> readExcelData() {
    List<SaleData> saleDataList = new ArrayList<>();

    try {
      ClassPathResource resource = new ClassPathResource("sample_sale.xlsx");
      InputStream inputStream = resource.getInputStream();
      Workbook workbook = new XSSFWorkbook(inputStream);
      Sheet sheet = workbook.getSheetAt(0);

      Iterator<Row> rowIterator = sheet.iterator();
      rowIterator.next(); // 첫 번째 행(헤더) 건너뛰기

      while (rowIterator.hasNext()) {
        Row row = rowIterator.next();

        Long productId = (long) row.getCell(0).getNumericCellValue(); // PRODUCT_ID
        int quantity = (int) row.getCell(1).getNumericCellValue(); // QUANTITY
        BigDecimal salePrice = new BigDecimal(row.getCell(2).getNumericCellValue()); // SALE_PRICE
        Long clientId = (long) row.getCell(3).getNumericCellValue(); // CLIENT_ID
        String paymentAccountId = getStringCellValue(row.getCell(4)); // PAYMENT_ACCOUNT_ID
        Integer employeeId = (int) row.getCell(5).getNumericCellValue(); // EMPLOYEE_ID
        String memo = getStringCellValue(row.getCell(6)); // MEMO

        saleDataList.add(new SaleData(productId, quantity, salePrice, clientId, paymentAccountId, employeeId, memo));
      }
      workbook.close();
    } catch (Exception e) {
      e.printStackTrace();
    }

    return saleDataList;
  }

  @Test
  @DisplayName("✅ 대량 판매 프로세스 실행")
  void testBulkSaleProcess() {
    List<SaleData> saleDataList = readExcelData();

    for (SaleData data : saleDataList) {
      Product product = productRepository.findById(data.getProductId())
          .orElseThrow(() -> new IllegalArgumentException("Product not found"));
      Client client = clientRepository.findById(data.getClientId())
          .orElseThrow(() -> new IllegalArgumentException("Client not found"));
      Employee employee = employeeRepository.findById(data.getEmployeeId())
          .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

      saleService.processSale(
          data.getProductId(),
          data.getQuantity(),
          data.getSalePrice(),
          client.getClientCode(),
          data.getPaymentAccountId(),
          employee,
          RequestStatus.PENDING,
          data.getMemo()
      );
    }
  }

  // 엑셀 데이터 저장용 DTO
  static class SaleData {
    private Long productId;
    private int quantity;
    private BigDecimal salePrice;
    private Long clientId;
    private String paymentAccountId;
    private Integer employeeId;
    private String memo;

    public SaleData(Long productId, int quantity, BigDecimal salePrice, Long clientId, String paymentAccountId, Integer employeeId, String memo) {
      this.productId = productId;
      this.quantity = quantity;
      this.salePrice = salePrice;
      this.clientId = clientId;
      this.paymentAccountId = paymentAccountId;
      this.employeeId = employeeId;
      this.memo = memo;
    }

    public Long getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public BigDecimal getSalePrice() { return salePrice; }
    public Long getClientId() { return clientId; }
    public String getPaymentAccountId() { return paymentAccountId; }
    public Integer getEmployeeId() { return employeeId; }
    public String getMemo() { return memo; }
  }

  private static final Long TRANSACTION_START_ID = 31L;
  private static final Long TRANSACTION_END_ID = 60L;

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
      saleService.approveSale(currentTransactionId);

      // 3. 변경된 상태 확인
      Order approvedOrder = orderRepository.findById(currentTransactionId)
          .orElseThrow(() -> new IllegalArgumentException("Order not found after approval: " + currentTransactionId));

      assertEquals(RequestStatus.APPROVED, approvedOrder.getRequestStatus(),
          "🚨 주문 상태가 APPROVED로 변경되어야 합니다. (Transaction ID: " + currentTransactionId + ")");
    }
  }
}
