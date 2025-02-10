package com.nexterp;

import com.nexterp.accounting.dto.JournalEntryDTO;
import com.nexterp.accounting.entity.Invoice;
import com.nexterp.accounting.entity.JournalEntry;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.entity.TransactionType;
import com.nexterp.accounting.repository.InvoiceItemRepository;
import com.nexterp.accounting.repository.InvoiceRepository;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import com.nexterp.client.dto.ClientDTO;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.client.service.ClientServiceImpl;
import com.nexterp.employee.dto.EmployeeDTO;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.employee.service.EmployeeService;
import com.nexterp.payroll.dto.BonusLogDTO;
import com.nexterp.payroll.dto.EmployeeSalaryInfoDTO;
import com.nexterp.payroll.dto.SalaryDTO;
import com.nexterp.payroll.entity.PaymentStatus;
import com.nexterp.payroll.entity.Salary;
import com.nexterp.payroll.repository.SalaryRepository;
import com.nexterp.payroll.service.BonusLogService;
import com.nexterp.payroll.service.EmployeeSalaryInfoService;
import com.nexterp.payroll.service.SalaryService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@Log4j2
@SpringBootTest
class NextErpApplicationTests {

/*  @Autowired
  private AccountRepository accountRepository;

  @Test
  public void initializeAccounts() {
    // 부모 계정 생성
    Account assetAccount = new Account("100", "자산", AccountType.ASSET, null, "자산 계정");
    accountRepository.save(assetAccount);

    // 자식 계정 생성
    accountRepository.saveAll(List.of(
        new Account("101", "현금", AccountType.ASSET, assetAccount, "현금 계정"),
        new Account("102", "보통예금", AccountType.ASSET, assetAccount, "보통예금 계정"),
        new Account("103", "당좌예금", AccountType.ASSET, assetAccount, "당좌예금 계정")
    ));

    // 데이터 검증
    List<Account> accounts = accountRepository.findAll();
    assertThat(accounts).isNotEmpty();
    assertThat(accounts.size()).isEqualTo(4); // 총 4개 계정 (부모 + 자식)
  }*/

  /*@Autowired
  private ReportFileGenerator reportFileGenerator;

  @Test
  public void createReport() {
    ReportType reportType = ReportType.BALANCE_SHEET; // 예제 ReportType
    List<String[]> content = List.of(
        new String[]{"Account", "Debit", "Credit"},
        new String[]{"Cash", "1000", "0"},
        new String[]{"Revenue", "0", "1000"}
    );

    try {
      String filePath = reportFileGenerator.generateReportFile(reportType, content);
      System.out.println("리포트 생성 완료: " + filePath);
    } catch (IOException e) {
      System.err.println("리포트 생성 중 오류 발생: " + e.getMessage());
    }
  }

  @Autowired
  private AccountRepository accountRepository;
  @Autowired
  private ReportRepository reportRepository;
  @Autowired
  private JournalEntryRepository journalEntryRepository;
  @Autowired
  private JournalEntryService journalEntryService;
  @Test
  public void testCreateJournalEntry() {
    JournalEntryDTO dto = new JournalEntryDTO();
    dto.setDate(LocalDate.now());
    dto.setAccountCode("101");
    dto.setDebit(BigDecimal.valueOf(100));
    dto.setCredit(BigDecimal.ZERO);
    dto.setDescription("Test Entry");

    JournalEntryDTO result = journalEntryService.createJournalEntry(dto);

    assertNotNull(result.getId());
    assertEquals(BigDecimal.valueOf(100), result.getDebit());
    assertEquals(BigDecimal.ZERO, result.getCredit());
    assertEquals(BigDecimal.valueOf(100), result.getAmount()); // amount 검증
  }*/

  /*@Autowired
  private EmployeeRepository employeeRepository;

  @Autowired
  private MemberRepository memberRepository;

  @Autowired
  private MemberService memberService;

  @Autowired
  private AttendanceService attendanceService;

  @Test
  @Transactional
  @Rollback(false) // 롤백 방지
  void createMemberWithEmployee() {
    // 1. 기존 부서와 직위 객체 지정 (ID 값만 지정)
    Department department = new Department(1, "영업팀", "sales@company.com");
    Position position = new Position(1, "사원", "User");

    // 2. 직원 데이터 생성
    Employee employee = new Employee(
        1003, "김철수", LocalDate.of(1990, 1, 15), false,
        "010-1234-5678", "useongj490@gmail.com", "서울특별시 강남구",
        department, position, LocalDate.of(2020, 3, 1), null
    );

    // 3. 직원 객체를 데이터베이스에 저장
    employeeRepository.save(employee);
    employeeRepository.flush(); // 강제 플러시

    // 4. 저장된 Employee 조회
    Employee savedEmployee = employeeRepository.findById(1003)
        .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

    // 5. Member 생성
    memberService.createMember(savedEmployee);

    // 6. 저장된 Member 조회
    Member savedMember = memberRepository.findById(savedEmployee.getId())
        .orElseThrow(() -> new IllegalArgumentException("Member not found"));

    // 7. DB 확인
    assertThat(savedMember).isNotNull();
    assertThat(savedMember.getId()).isEqualTo(savedEmployee.getId());
    assertThat(savedMember.getPassword()).isEqualTo("00000000"); // 기본 비밀번호 확인
    assertThat(savedMember.getEmployee().getName()).isEqualTo("김철수");
    assertThat(savedMember.getEmployee().getDepartment().getName()).isEqualTo("영업팀");
    assertThat(savedMember.getEmployee().getPosition().getTitle()).isEqualTo("사원");
  }*/

  /*@Test
  @Transactional
  @Rollback(false)
  void testSaveAttendance() {
    // Arrange
    Department department = new Department(1, "영업팀", "sales@company.com");
    Position position = new Position(1, "사원", "User");

    Employee employee = new Employee(
        1, "John Doe", LocalDate.of(1985, 5, 20), true,
        "010-1111-2222", "johndoe@example.com", "서울특별시 강남구",
        department, position, LocalDate.of(2010, 1, 1), null
    );
    employeeRepository.save(employee);
    employeeRepository.flush(); // 강제 플러시

    AttendanceDTO dto = new AttendanceDTO();
    dto.setEmployeeId(1);
    dto.setDate(LocalDate.now());
    dto.setCheckInTime(LocalTime.of(9, 0));
    dto.setCheckOutTime(LocalTime.of(19, 0));
    dto.setStatus("ON_TIME");

    // Act
    AttendanceDTO savedAttendance = attendanceService.saveAttendance(dto);

    // Assert
    assertNotNull(savedAttendance);
    assertEquals(dto.getEmployeeId(), savedAttendance.getEmployeeId());
    assertEquals(BigDecimal.valueOf(1.0), savedAttendance.getOvertimeHours());
  }*/

  /*@Autowired
  private JWTUtil jwtUtil;

  @BeforeEach
  void setup() {
    log.info("테스트 초기화 완료.");
  }

  @Test
  void testGenerateAndValidateToken() {
    log.info("테스트 시작: testGenerateAndValidateToken");

    // Given: 테스트용 클레임 데이터
    Map<String, Object> claims = new HashMap<>();
    claims.put("memberId", 12345);
    claims.put("role", "USER");
    log.info("클레임 데이터 준비 완료: {}", claims);

    // When: 토큰 생성
    String token = jwtUtil.generateToken(claims, 10); // 10분 유효 기간
    log.info("JWT 토큰 생성 완료: {}", token);

    // Then: 토큰이 null 또는 비어 있지 않아야 함
    assertNotNull(token);
    assertFalse(token.isEmpty());

    // When: 토큰 검증 및 클레임 추출
    Map<String, Object> extractedClaims = jwtUtil.validateToken(token);
    log.info("JWT 토큰 검증 완료, 추출된 클레임: {}", extractedClaims);

    // Then: 생성한 클레임과 검증된 클레임이 동일해야 함
    assertEquals(12345, extractedClaims.get("memberId"));
    assertEquals("USER", extractedClaims.get("role"));

    log.info("테스트 종료: testGenerateAndValidateToken");
  }

  @Test
  void testTokenExpiration() throws InterruptedException {
    log.info("테스트 시작: testTokenExpiration");

    // Given: 1초 유효 기간의 토큰
    Map<String, Object> claims = new HashMap<>();
    claims.put("memberId", 12345);
    String token = jwtUtil.generateToken(claims, 1 / 60); // 1초
    log.info("1초 유효 기간의 JWT 토큰 생성: {}", token);

    // Wait for the token to expire
    Thread.sleep(1100); // 1.1초 대기
    log.info("1.1초 대기 완료. 토큰 만료 예상.");

    // Then: 만료된 토큰 검증 시 CustomJWTException 발생
    Exception exception = assertThrows(CustomJWTException.class, () -> jwtUtil.validateToken(token));
    log.info("만료된 토큰 검증 결과: {}", exception.getMessage());
    assertEquals("Expired", exception.getMessage());

    log.info("테스트 종료: testTokenExpiration");
  }

  @Test
  void testInvalidToken() {
    log.info("테스트 시작: testInvalidToken");

    // Given: 잘못된 토큰
    String invalidToken = "invalid.jwt.token";
    log.info("잘못된 토큰 준비 완료: {}", invalidToken);

    // Then: 잘못된 토큰 검증 시 CustomJWTException 발생
    Exception exception = assertThrows(CustomJWTException.class, () -> jwtUtil.validateToken(invalidToken));
    log.info("잘못된 토큰 검증 결과: {}", exception.getMessage());
    assertEquals("MalFormed", exception.getMessage());

    log.info("테스트 종료: testInvalidToken");
  }

  @Test
  void testExtractMemberId() {
    log.info("테스트 시작: testExtractMemberId");

    // Given: 테스트용 클레임 데이터
    Map<String, Object> claims = new HashMap<>();
    claims.put("memberId", 12345);
    log.info("클레임 데이터 준비 완료: {}", claims);

    // When: 토큰 생성
    String token = jwtUtil.generateToken(claims, 10);
    log.info("JWT 토큰 생성 완료: {}", token);

    // Then: memberId를 추출할 수 있어야 함
    Integer memberId = jwtUtil.extractMemberId(token);
    log.info("토큰에서 추출된 memberId: {}", memberId);
    assertEquals(12345, memberId);

    log.info("테스트 종료: testExtractMemberId");
  }*/

  @Autowired
  private EmployeeService employeeService;
  @Autowired
  private SalaryService salaryService;
  @Autowired
  private EmployeeSalaryInfoService employeeSalaryInfoService;
  @Autowired
  private TransactionRepository transactionRepository;
  @Autowired
  private InvoiceRepository invoiceRepository;
  @Autowired
  private InvoiceItemRepository invoiceItemRepository;
  @Autowired
  private JournalEntryRepository journalEntryRepository;
  @Autowired
  private BonusLogService bonusLogService;
  @Test
  public void testEmployeeSalaryFlow() {
    System.out.println("========== 직원 급여 정보 저장 및 급여 지급 테스트 시작 ==========");

    // [1] 직원 생성
    System.out.println("[1] 직원 생성 시작");
    EmployeeDTO employeeDTO = new EmployeeDTO();
    employeeDTO.setId(99999999);
    employeeDTO.setName("John Doe");
    employeeDTO.setBirthDate(LocalDate.of(1990, 1, 1));
    employeeDTO.setGender(true);
    employeeDTO.setPhone("010-1234-5678");
    employeeDTO.setEmail("johndoe@example.com");
    employeeDTO.setAddress("Seoul, Korea");
    employeeDTO.setHireDate(LocalDate.of(2023, 1, 1));
    employeeDTO.setDepartmentId(1); // 유효한 부서 ID
    employeeDTO.setPositionId(1); // 유효한 직위 ID

    Employee savedEmployee = employeeService.saveEmployee(employeeDTO);

    // [2] 급여 정보 저장
    System.out.println("[2] 직원 급여 정보 저장 시작");
    EmployeeSalaryInfoDTO salaryInfoDTO = new EmployeeSalaryInfoDTO();
    salaryInfoDTO.setEmployeeId(savedEmployee.getId());
    salaryInfoDTO.setBaseSalary(new BigDecimal("5000000"));
    salaryInfoDTO.setDeductions(new BigDecimal("200000"));
    salaryInfoDTO.setEffectiveDate(LocalDate.now());

    EmployeeSalaryInfoDTO savedSalaryInfo = employeeSalaryInfoService.saveSalaryInfo(salaryInfoDTO);
    assertNotNull(savedSalaryInfo, "직원 급여 정보가 저장되지 않았습니다.");
    assertEquals(new BigDecimal("5000000"), savedSalaryInfo.getBaseSalary());
    assertEquals(new BigDecimal("200000"), savedSalaryInfo.getDeductions());
    System.out.println("-> 직원 급여 정보 저장 성공: " + savedSalaryInfo);

    // [3] 급여 지급 호출
    System.out.println("[3] 급여 지급 호출 시작");
    SalaryDTO salaryDTO = new SalaryDTO();
    salaryDTO.setEmployeeId(savedEmployee.getId());
    salaryDTO.setBonus(new BigDecimal("500000")); // 보너스 동적 설정
    SalaryDTO resultSalaryDTO = salaryService.createSalary(salaryDTO);

    // [4] Salary 검증
    System.out.println("[4] Salary 저장 검증");
    assertNotNull(resultSalaryDTO, "생성된 SalaryDTO가 null이면 안 됩니다.");
    assertEquals(PaymentStatus.PAID.name(), resultSalaryDTO.getStatus());
    assertEquals(1, new BigDecimal("5300000").compareTo(resultSalaryDTO.getTotalSalary()));
    System.out.println("-> Salary 저장 성공: " + resultSalaryDTO);

    // [5] 보너스 로그 검증
    System.out.println("[5] BonusLog 저장 검증");
    List<BonusLogDTO> bonusLogs = bonusLogService.findByEmployeeId(savedEmployee.getId());
    assertEquals(1, bonusLogs.size(), "보너스 로그 개수가 잘못되었습니다.");
    BonusLogDTO bonusLog = bonusLogs.get(0);
    assertEquals(new BigDecimal("500000.00"), bonusLog.getBonusAmount());
    assertEquals("급여 지급과 함께 지급된 보너스", bonusLog.getDescription());
    System.out.println("-> BonusLog 저장 성공: " + bonusLog);

    // [6] Transaction, Invoice, JournalEntry 등 기존 검증 유지
    validateTransactionAndInvoiceFlow(resultSalaryDTO);

    System.out.println("========== 직원 급여 정보 저장 및 급여 지급 테스트 종료 ==========");
  }

  private void validateTransactionAndInvoiceFlow(SalaryDTO resultSalaryDTO) {
    System.out.println("[6] Transaction 저장 검증");
    List<Transaction> transactions = transactionRepository.findByType(TransactionType.SALARY);
    assertFalse(transactions.isEmpty(), "SALARY 타입의 Transaction이 저장되지 않았습니다.");
    Transaction transaction = transactions.get(0);
    assertEquals(1, new BigDecimal("5300000.00").compareTo(transaction.getAmount()));
    System.out.println("-> Transaction 저장 성공: " + transaction);

    System.out.println("[7] Invoice 저장 검증");
    Optional<Invoice> optionalInvoice = invoiceRepository.findByTransactionId(transaction.getId());
    assertTrue(optionalInvoice.isPresent(), "Invoice가 저장되지 않았습니다.");
    Invoice invoice = optionalInvoice.get();
    System.out.println("-> Invoice 저장 성공: " + invoice);

    System.out.println("[8] JournalEntry 저장 검증");
    List<JournalEntry> journalEntries = journalEntryRepository.findByTransactionId(transaction.getId());
    assertEquals(2, journalEntries.size(), "JournalEntry 개수가 잘못되었습니다.");
    System.out.println("-> JournalEntry 저장 성공: " + journalEntries);
  }

  /*@Autowired
  private SalaryService salaryService;
  @Autowired
  private EmployeeRepository employeeRepository;
  @Autowired
  private SalaryRepository salaryRepository;

  @Test
  public void testGetAllSalaries() {
    System.out.println("========== 모든 급여 데이터 확인 테스트 시작 ==========");

    // 1. 모든 급여 데이터 조회
    List<SalaryDTO> salaries = salaryService.getAllSalaries();

    // 2. 검증
    assertNotNull(salaries, "급여 데이터 리스트가 null이면 안 됩니다.");
    assertFalse(salaries.isEmpty(), "급여 데이터 리스트가 비어 있습니다.");
    System.out.println("조회된 급여 데이터 개수: " + salaries.size());

    for (SalaryDTO salary : salaries) {
      System.out.println("-> 급여 데이터: " + salary);
    }

    System.out.println("========== 모든 급여 데이터 확인 테스트 종료 ==========");
  }

  @Test
  public void testGetSalariesByEmployeeId() {
    System.out.println("========== 특정 직원 급여 내역 조회 테스트 시작 ==========");

    // 1. DB에서 임의의 직원 가져오기
    Employee employee = employeeRepository.findAll().stream()
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("직원이 없습니다."));

    System.out.println("-> 조회된 직원 ID: " + employee.getId() + ", 이름: " + employee.getName());

    // 2. 해당 직원의 급여 내역 조회
    List<SalaryDTO> salaries = salaryService.getSalariesByEmployeeId(employee.getId());

    // 3. 검증
    assertNotNull(salaries, "급여 데이터 리스트가 null이면 안 됩니다.");
    assertFalse(salaries.isEmpty(), "해당 직원의 급여 데이터가 비어 있습니다.");
    System.out.println("직원 ID: " + employee.getId() + "의 급여 데이터 개수: " + salaries.size());

    for (SalaryDTO salary : salaries) {
      System.out.println("-> 급여 데이터: " + salary);
    }

    System.out.println("========== 특정 직원 급여 내역 조회 테스트 종료 ==========");
  }

  @Test
  public void testDeleteSalaryById() {
    System.out.println("========== 특정 급여 데이터 삭제 테스트 시작 ==========");

    // 1. DB에서 임의의 급여 데이터 가져오기
    Salary salary = salaryRepository.findAll().stream()
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("삭제할 급여 데이터가 없습니다."));

    System.out.println("-> 삭제 대상 급여 ID: " + salary.getId());

    // 2. 급여 삭제
    salaryService.deleteSalaryById(salary.getId());
    System.out.println("-> 급여 ID " + salary.getId() + " 삭제 완료");

    // 3. 삭제 확인
    boolean exists = salaryRepository.existsById(salary.getId());
    assertFalse(exists, "급여 데이터가 삭제되지 않았습니다.");

    System.out.println("========== 특정 급여 데이터 삭제 테스트 종료 ==========");
  }*/

  /*@Autowired
  private ClientServiceImpl clientService;

  @Autowired
  private ClientRepository clientRepository;

  @Autowired
  private EmployeeRepository employeeRepository;

  private Employee existingEmployee;

  @BeforeEach
  void setUp() {
    log.info("테스트 초기화 중: Employee 조회");
    existingEmployee = employeeRepository.findById(12341234)
        .orElseThrow(() -> new IllegalStateException("테스트용 Employee 데이터를 찾을 수 없습니다. ID: 12341234"));
    log.info("테스트용 Employee 조회 완료: {}", existingEmployee);
  }

  @Test
  void createClient_Success() {
    log.info("=== 거래처 생성 테스트 시작 ===");
    // Given
    String uniqueClientCode = "TEST" + System.currentTimeMillis();
    log.info("생성할 클라이언트 코드: {}", uniqueClientCode);

    ClientDTO clientDTO = ClientDTO.builder()
        .clientName("Test Company")
        .clientCode(uniqueClientCode)
        .clientPhone("010-1234-5678")
        .zipCode("12345")
        .clientAddress("서울시 강남구")
        .clientDetailedAddress("테헤란로 123")
        .clientEmail("test@example.com")
        .registrationNumber("123-45-67890")
        .clientBank("국민은행")
        .clientAccountNumber("110-1234-5678")
        .clientAccountOwner("홍길동")
        .memo("테스트 메모")
        .employeeId(existingEmployee.getId())
        .build();

    // When
    ClientDTO createdClient = clientService.createClient(clientDTO);

    // Then
    log.info("생성된 클라이언트: {}", createdClient);
    assertNotNull(createdClient);
    assertEquals("Test Company", createdClient.getClientName());
    assertEquals(uniqueClientCode, createdClient.getClientCode());
    log.info("=== 거래처 생성 테스트 종료 ===");
  }

  @Test
  void getClientById_Success() {
    log.info("=== ID로 거래처 조회 테스트 시작 ===");
    // Given
    String uniqueClientCode = "TEST" + System.currentTimeMillis();
    log.info("저장할 클라이언트 코드: {}", uniqueClientCode);

    Client client = Client.builder()
        .clientName("Test Company")
        .clientCode(uniqueClientCode)
        .clientPhone("010-1234-5678")
        .zipCode("12345")
        .clientAddress("서울시 강남구")
        .clientDetailedAddress("테헤란로 123")
        .clientEmail("test@example.com")
        .registrationNumber("123-45-67890")
        .clientBank("국민은행")
        .clientAccountNumber("110-1234-5678")
        .clientAccountOwner("홍길동")
        .memo("테스트 메모")
        .employee(existingEmployee)
        .createdDate(LocalDate.now())
        .status(RequestStatus.PREPARED)
        .build();
    clientRepository.save(client);

    log.info("저장된 거래처 ID: {}", client.getId());

    // When
    ClientDTO retrievedClient = clientService.getClientById(client.getId());

    // Then
    log.info("조회된 거래처: {}", retrievedClient);
    assertNotNull(retrievedClient);
    assertEquals("Test Company", retrievedClient.getClientName());
    assertEquals(uniqueClientCode, retrievedClient.getClientCode());
    log.info("=== ID로 거래처 조회 테스트 종료 ===");
  }

  @Test
  void getAllClients_Success() {
    log.info("=== 전체 거래처 조회 테스트 시작 ===");
    // Given
    Client client1 = Client.builder()
        .clientName("Company A")
        .clientCode("CODE001" + System.currentTimeMillis())
        .employee(existingEmployee)
        .createdDate(LocalDate.now())
        .status(RequestStatus.PREPARED)
        .build();

    Client client2 = Client.builder()
        .clientName("Company B")
        .clientCode("CODE002" + System.currentTimeMillis())
        .employee(existingEmployee)
        .createdDate(LocalDate.now())
        .status(RequestStatus.PREPARED)
        .build();

    clientRepository.save(client1);
    clientRepository.save(client2);

    log.info("저장된 거래처 1: {}, 거래처 2: {}", client1, client2);

    // When
    List<ClientDTO> clients = clientService.getAllClients();

    // Then
    log.info("조회된 전체 거래처 수: {}", clients.size());
    assertNotNull(clients);
    assertTrue(clients.size() >= 2);
    log.info("=== 전체 거래처 조회 테스트 종료 ===");
  }

  @Test
  void approveClient_Success() {
    log.info("=== 거래처 승인 테스트 시작 ===");
    // Given
    String parentClientCode = "ORIG" + System.currentTimeMillis();
    String tempClientCode = "TEMP" + System.currentTimeMillis();

    Client parentClient = Client.builder()
        .clientName("Original Company")
        .clientCode(parentClientCode)
        .employee(existingEmployee)
        .createdDate(LocalDate.now())
        .status(RequestStatus.PREPARED)
        .build();
    clientRepository.save(parentClient);

    Client tempClient = Client.builder()
        .clientName("Updated Company")
        .clientCode(tempClientCode)
        .parent(parentClient)
        .employee(existingEmployee)
        .status(RequestStatus.PENDING)
        .createdDate(LocalDate.now())
        .build();
    clientRepository.save(tempClient);

    log.info("저장된 부모 거래처: {}, 임시 거래처: {}", parentClient, tempClient);

    // When
    ClientDTO approvedClient = clientService.approveClient(tempClient.getId(), existingEmployee.getId());

    // Then
    log.info("승인된 거래처: {}", approvedClient);
    assertNotNull(approvedClient);
    assertEquals("Updated Company", approvedClient.getClientName());
    assertEquals(RequestStatus.APPROVED, clientRepository.findById(parentClient.getId()).get().getStatus());
    log.info("=== 거래처 승인 테스트 종료 ===");
  }*/
}

