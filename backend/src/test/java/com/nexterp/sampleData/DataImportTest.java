package com.nexterp.sampleData;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sampleData
 * FileName       : DataImportTest
 * Author         : paesir
 * Date           : 25. 2. 9.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 9.오전 5:34  paesir      최초 생성
 */

import com.nexterp.client.dto.ClientDTO;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.client.service.ClientService;
import com.nexterp.product.dto.ProductDTO;
import com.nexterp.product.repository.ProductRepository;
import com.nexterp.product.service.ProductService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class DataImportTest {

  @Autowired
  private ClientService clientService;

  @Autowired
  private ClientRepository clientRepository;

  @Autowired
  private ProductService productService;

  @Autowired
  private ProductRepository productRepository;

  private List<ClientDTO> clientDTOList = new ArrayList<>();
  private List<ProductDTO> productDTOList = new ArrayList<>();

  @BeforeEach
  public void setup() throws Exception {
    loadClientData();
    loadProductData();
  }

  private void loadClientData() throws Exception {
    ClassPathResource resource = new ClassPathResource("Client_Data.xlsx");
    InputStream inputStream = resource.getInputStream();
    Workbook workbook = new XSSFWorkbook(inputStream);
    Sheet sheet = workbook.getSheetAt(0);

    for (int i = 1; i <= sheet.getLastRowNum(); i++) {
      Row row = sheet.getRow(i);
      if (row == null) continue;

      ClientDTO clientDTO = ClientDTO.builder()
          .clientName(getCellStringValue(row.getCell(1)))
          .clientCode(getCellStringValue(row.getCell(2)))
          .clientPhone(getCellStringValue(row.getCell(3)))
          .zipCode(getCellStringValue(row.getCell(4)))
          .clientAddress(getCellStringValue(row.getCell(5)))
          .clientDetailedAddress(getCellStringValue(row.getCell(6)))
          .clientEmail(getCellStringValue(row.getCell(7)))
          .registrationNumber(getCellStringValue(row.getCell(8)))
          .clientBank(getCellStringValue(row.getCell(9)))
          .clientAccountNumber(getCellStringValue(row.getCell(10)))
          .clientAccountOwner(getCellStringValue(row.getCell(11)))
          .memo(getCellStringValue(row.getCell(12)))
          .employeeId((int) row.getCell(13).getNumericCellValue())
          .build();

      clientDTOList.add(clientDTO);
    }
    workbook.close();
  }

  private void loadProductData() throws Exception {
    ClassPathResource resource = new ClassPathResource("sample_product.xlsx");
    InputStream inputStream = resource.getInputStream();
    Workbook workbook = new XSSFWorkbook(inputStream);
    Sheet sheet = workbook.getSheetAt(0);

    for (int i = 1; i <= sheet.getLastRowNum(); i++) {
      Row row = sheet.getRow(i);
      if (row == null) continue;

      ProductDTO productDTO = ProductDTO.builder()
          .productName(row.getCell(0).getStringCellValue().trim())
          .purchasePrice(BigDecimal.valueOf(row.getCell(1).getNumericCellValue()))
          .salePrice(BigDecimal.valueOf(row.getCell(2).getNumericCellValue()))
          .createdDate(convertExcelDateToLocalDate(row.getCell(3)))
          .stock((int) row.getCell(4).getNumericCellValue())
          .specifications(row.getCell(5).getStringCellValue().trim())
          .memo(row.getCell(6).getStringCellValue().trim())
          .isDeleted(row.getCell(7).getBooleanCellValue())
          .employeeId((int) row.getCell(8).getNumericCellValue())
          .build();

      productDTOList.add(productDTO);
    }
    workbook.close();
  }

  @Test
  public void testImportExcelToDatabase() {
    assertFalse(clientDTOList.isEmpty(), "클라이언트 데이터가 없습니다.");
    assertFalse(productDTOList.isEmpty(), "제품 데이터가 없습니다.");

    for (ClientDTO clientDTO : clientDTOList) {
      ClientDTO savedClient = clientService.createClient(clientDTO);
      assertNotNull(savedClient);
      assertEquals(clientDTO.getClientName(), savedClient.getClientName());
    }

    for (ProductDTO productDTO : productDTOList) {
      ProductDTO savedProduct = productService.createProduct(productDTO);
      assertNotNull(savedProduct);
      assertEquals(productDTO.getProductName(), savedProduct.getProductName());
    }

    assertEquals(clientDTOList.size(), clientRepository.count());
    assertEquals(productDTOList.size(), productRepository.count());
  }

  private String getCellStringValue(Cell cell) {
    if (cell == null) return "";
    return switch (cell.getCellType()) {
      case STRING -> cell.getStringCellValue().trim();
      case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
      case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
      default -> "";
    };
  }

  private LocalDate convertExcelDateToLocalDate(Cell cell) {
    if (cell == null || cell.getCellType() != CellType.NUMERIC) return LocalDate.now();
    Date date = cell.getDateCellValue();
    return Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
  }
}