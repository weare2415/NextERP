package com.nexterp.employee.service;

import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.dto.EmployeeDTO;
import com.nexterp.employee.entity.Department;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.entity.Position;
import com.nexterp.employee.repository.DepartmentRepository;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.employee.repository.PositionRepository;
import com.nexterp.member.repository.MemberRepository;
import com.nexterp.member.service.MemberService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final MemberService memberService;
    private final MemberRepository memberRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           PositionRepository positionRepository,
                           MemberService memberService, MemberRepository memberRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.memberService = memberService;
        this.memberRepository=memberRepository;
    }

    @Transactional
    public Employee saveEmployee(EmployeeDTO employeeDTO) {
        // ✅ 1. ID 중복 확인
        if (existById(employeeDTO.getId())) {
            throw new IllegalArgumentException("이미 존재하는 Employee ID입니다: " + employeeDTO.getId());
        }

        // ✅ 2. 부서 조회
        Department department = departmentRepository.findById(employeeDTO.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department ID"));

        // ✅ 3. 직급 조회
        Position position = positionRepository.findById(employeeDTO.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid position ID"));

        // ✅ 4. Employee 객체 생성
        Employee employee = new Employee();
        employee.setId(employeeDTO.getId());
        employee.setName(employeeDTO.getName());
        employee.setBirthDate(employeeDTO.getBirthDate());
        employee.setGender(employeeDTO.getGender());
        employee.setPhone(employeeDTO.getPhone());
        employee.setEmail(employeeDTO.getEmail());
        employee.setAddress(employeeDTO.getAddress());
        employee.setDepartment(department);
        employee.setPosition(position);
        employee.setHireDate(employeeDTO.getHireDate());
        employee.setTerminationDate(employeeDTO.getTerminationDate());
        employee.setStatus(RequestStatus.PREPARED);

        // ✅ 5. Employee 저장
        Employee savedEmployee = employeeRepository.save(employee);

        // ✅ 6. Member 생성 (MemberService 호출)
        memberService.createMember(savedEmployee);

        return savedEmployee;
    }

    /**
     * ✅ 1. PENDING 상태의 직원 목록 조회
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getPendingEmployees() {
        List<Employee> pendingList = employeeRepository.findPendingEmployees();
        System.out.println("📌 PENDING 직원 목록: " + pendingList); // 👉 콘솔에서 확인

        return pendingList.stream()
                .map(this::convertToDTO) // ✅ 변경된 `convertToDTO()` 사용
                .toList();
    }
    /**
     * ✅ 2. 특정 직원 ID의 승인 요청 목록 조회
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByEmployeeId(Integer employeeId) {
        return employeeRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDTO)
                .toList();
    }

    /**
     * ✅ 3. 특정 승인 상태(RequestStatus)에 해당하는 직원 목록 조회
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByStatus(RequestStatus status) {
        return employeeRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .toList();
    }

    /**
     * ✅ 4. PENDING 상태가 아닌 직원 조회 (PREPARED, APPROVED, REJECTED)
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllActiveEmployees() {
        return employeeRepository.findAllActiveEmployees().stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional
    public EmployeeDTO updateEmployee(Integer id, EmployeeDTO employeeDTO) {
        // ✅ 1. 기존 직원 조회 (부모 Employee)
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));

        // ✅ 2. 변경 사항 확인 (부서, 직급이 변경되었는지 확인)
        Department newDepartment = departmentRepository.findById(employeeDTO.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid department ID"));
        Position newPosition = positionRepository.findById(employeeDTO.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid position ID"));

        // ✅ 3. 새로운 직원 ID 생성 (PENDING 상태)
        int newEmployeeId = generateNewEmployeeId();

        Employee pendingEmployee = Employee.builder()
                .id(newEmployeeId) // ✅ 새로운 ID
                .name(employeeDTO.getName())
                .birthDate(employeeDTO.getBirthDate())
                .gender(employeeDTO.getGender())
                .phone(employeeDTO.getPhone())
                .email(employeeDTO.getEmail())
                .address(employeeDTO.getAddress())
                .department(newDepartment) // ✅ 새로운 부서 반영
                .position(newPosition) // ✅ 새로운 직급 반영
                .hireDate(existingEmployee.getHireDate())
                .terminationDate(employeeDTO.getTerminationDate())
                .isTerminated(employeeDTO.getTerminationDate() != null)
                .status(RequestStatus.PENDING) // ✅ 승인 대기 상태
                .approvedByEmployeeId(null)
                .parent(existingEmployee) // ✅ 기존 데이터를 parent로 유지
                .build();

        // ✅ 4. 새로운 직원 정보 저장
        employeeRepository.save(pendingEmployee);

        // ✅ 5. 기존 직원 상태 변경
        existingEmployee.setStatus(RequestStatus.PREPARED);
        employeeRepository.save(existingEmployee);

        return convertToDTO(pendingEmployee);
    }


    /**
     * ✅ 새로운 직원 ID 생성 로직
     */
    private int generateNewEmployeeId() {
        // 1. 현재 존재하는 직원 중 가장 높은 ID 가져오기
        Integer maxId = employeeRepository.findMaxId().orElse(100000);

        // 2. 새로운 ID 할당 (예: 기존 최대 ID + 1)
        return maxId + 1;
    }

    @Transactional
    public EmployeeDTO approveEmployee(Integer employeeId, Integer approvedByEmployeeId) {
        Employee pendingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("승인 요청 데이터를 찾을 수 없습니다."));

        if (!RequestStatus.PENDING.equals(pendingEmployee.getStatus())) {
            throw new IllegalStateException("승인 가능한 상태가 아닙니다.");
        }

        Employee parentEmployee = pendingEmployee.getParent();
        if (parentEmployee == null) {
            throw new IllegalStateException("부모 데이터가 없습니다.");
        }

        // ✅ 변경된 필드 체크
        Map<String, Map<String, String>> changedFieldsMap = compareEmployeeChanges(parentEmployee, pendingEmployee);
        List<String> changedFields = new ArrayList<>(changedFieldsMap.keySet());

        if (changedFields.isEmpty()) {
            throw new IllegalStateException("변경된 사항이 없습니다.");
        }

        // ✅ 4. 기존 Employee 데이터 업데이트 (새로운 데이터 적용)
        parentEmployee.setName(pendingEmployee.getName());
        parentEmployee.setBirthDate(pendingEmployee.getBirthDate());
        parentEmployee.setGender(pendingEmployee.getGender());
        parentEmployee.setPhone(pendingEmployee.getPhone());
        parentEmployee.setEmail(pendingEmployee.getEmail());
        parentEmployee.setAddress(pendingEmployee.getAddress());
        parentEmployee.setDepartment(pendingEmployee.getDepartment());
        parentEmployee.setPosition(pendingEmployee.getPosition());
        parentEmployee.setHireDate(pendingEmployee.getHireDate());
        parentEmployee.setTerminationDate(pendingEmployee.getTerminationDate());
        parentEmployee.setIsTerminated(pendingEmployee.getIsTerminated());
        parentEmployee.setStatus(RequestStatus.APPROVED);
        parentEmployee.setApprovedByEmployeeId(approvedByEmployeeId);

        // ✅ 기존 데이터 저장 후 승인된 변경 사항 삭제
        employeeRepository.save(parentEmployee);
        employeeRepository.delete(pendingEmployee);

        if (changedFields.contains("이름")) {
            System.out.println("🔍 Member 이름 변경 시도: " + parentEmployee.getId() + " → " + parentEmployee.getName());
            memberService.updateMemberName(parentEmployee.getId(), parentEmployee.getName()); // 🔹 `employeeId`는 Integer이므로 자동 변환됨
        }



        // ✅ 승인 후 `changedFields` 초기화
        return new EmployeeDTO(
                parentEmployee.getId(),
                parentEmployee.getName(),
                parentEmployee.getBirthDate(),
                parentEmployee.getGender(),
                parentEmployee.getPhone(),
                parentEmployee.getEmail(),
                parentEmployee.getAddress(),
                parentEmployee.getDepartment().getDepartmentId(),
                parentEmployee.getDepartment().getName(),
                parentEmployee.getPosition().getPositionId(),
                parentEmployee.getPosition().getTitle(),
                parentEmployee.getHireDate(),
                parentEmployee.getTerminationDate(),
                parentEmployee.getIsTerminated(),
                parentEmployee.getApprovedByEmployeeId(),
                parentEmployee.getParent() != null ? parentEmployee.getParent().getId() : null,
                new HashMap<>() // ✅ 변경된 필드 초기화
        );
    }



    @Transactional
    public void rejectEmployee(Integer employeeId, Integer approvedByEmployeeId) {
        // ✅ 1. 승인 요청(PENDING) 상태인 직원 조회
        Employee pendingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("반려 요청 데이터를 찾을 수 없습니다."));

        if (!RequestStatus.PENDING.equals(pendingEmployee.getStatus())) {
            throw new IllegalStateException("반려 가능한 상태가 아닙니다.");
        }

        // ✅ 2. 부모 Employee 조회
        Employee parentEmployee = pendingEmployee.getParent();
        if (parentEmployee == null) {
            throw new IllegalStateException("부모 데이터가 없습니다.");
        }

        // ✅ 3. 기존 데이터 상태 유지 & 승인 요청된 임시 데이터 삭제
        parentEmployee.setStatus(RequestStatus.REJECTED); // 반려 상태로 변경
        parentEmployee.setApprovedByEmployeeId(approvedByEmployeeId); // 반려한 관리자 ID 저장

        employeeRepository.save(parentEmployee); // 부모 데이터 저장
        employeeRepository.delete(pendingEmployee); // 임시 데이터 삭제

        // ✅ 4. 로그 출력 (반려 내역 확인)
        System.out.println("⛔ 반려 완료! 반려된 요청 ID: " + employeeId);
    }



    @Transactional
    public void deleteEmployee(Integer id) {
        // ✅ 직원 존재 여부 먼저 확인
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));

        // ✅ 1. EMPLOYEE 삭제 먼저 수행
        employeeRepository.delete(employee);


        // ✅ 2. MEMBER 삭제
        memberRepository.deleteByEmployeeId(id);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findByIsTerminatedFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));
        return convertToDTO(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByName(String name) {
        return employeeRepository.findByName(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByDepartment(Integer departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByPosition(Integer positionId) {
        return employeeRepository.findByPositionId(positionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByDepartmentAndPosition(Integer departmentId, Integer positionId) {
        return employeeRepository.findByDepartmentAndPosition(departmentId, positionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * ✅ 기존 직원과 새로운 요청된 직원 데이터를 비교하여 변경된 필드를 반환
     */
    private Map<String, Map<String, String>> compareEmployeeChanges(Employee existingEmployee, Employee pendingEmployee) {
        Map<String, Map<String, String>> changedFields = new HashMap<>();

        // 이름 비교
        if (!Objects.equals(existingEmployee.getName(), pendingEmployee.getName())) {
            changedFields.put("이름", Map.of(
                    "oldValue", existingEmployee.getName() != null ? existingEmployee.getName() : "-",
                    "newValue", pendingEmployee.getName() != null ? pendingEmployee.getName() : "-"
            ));
        }

        // 생년월일 비교 (null 방지)
        if (!Objects.equals(existingEmployee.getBirthDate(), pendingEmployee.getBirthDate())) {
            changedFields.put("생년월일", Map.of(
                    "oldValue", existingEmployee.getBirthDate() != null ? existingEmployee.getBirthDate().toString() : "-",
                    "newValue", pendingEmployee.getBirthDate() != null ? pendingEmployee.getBirthDate().toString() : "-"
            ));
        }

        // 성별 비교
        if (!Objects.equals(existingEmployee.getGender(), pendingEmployee.getGender())) {
            changedFields.put("성별", Map.of(
                    "oldValue", existingEmployee.getGender() != null ? (existingEmployee.getGender() ? "여성" : "남성") : "-",
                    "newValue", pendingEmployee.getGender() != null ? (pendingEmployee.getGender() ? "여성" : "남성") : "-"
            ));
        }

        // 전화번호 비교
        if (!Objects.equals(existingEmployee.getPhone(), pendingEmployee.getPhone())) {
            changedFields.put("전화번호", Map.of(
                    "oldValue", existingEmployee.getPhone() != null ? existingEmployee.getPhone() : "-",
                    "newValue", pendingEmployee.getPhone() != null ? pendingEmployee.getPhone() : "-"
            ));
        }

        // 이메일 비교
        if (!Objects.equals(existingEmployee.getEmail(), pendingEmployee.getEmail())) {
            changedFields.put("이메일", Map.of(
                    "oldValue", existingEmployee.getEmail() != null ? existingEmployee.getEmail() : "-",
                    "newValue", pendingEmployee.getEmail() != null ? pendingEmployee.getEmail() : "-"
            ));
        }

        // 주소 비교
        if (!Objects.equals(existingEmployee.getAddress(), pendingEmployee.getAddress())) {
            changedFields.put("주소", Map.of(
                    "oldValue", existingEmployee.getAddress() != null ? existingEmployee.getAddress() : "-",
                    "newValue", pendingEmployee.getAddress() != null ? pendingEmployee.getAddress() : "-"
            ));
        }

        // 부서 비교 (null 체크 추가)
        String oldDeptName = existingEmployee.getDepartment() != null ? existingEmployee.getDepartment().getName() : "-";
        String newDeptName = pendingEmployee.getDepartment() != null ? pendingEmployee.getDepartment().getName() : "-";
        if (!Objects.equals(oldDeptName, newDeptName)) {
            changedFields.put("부서", Map.of(
                    "oldValue", oldDeptName,
                    "newValue", newDeptName
            ));
        }

        // 직급 비교 (null 체크 추가)
        String oldPositionTitle = existingEmployee.getPosition() != null ? existingEmployee.getPosition().getTitle() : "-";
        String newPositionTitle = pendingEmployee.getPosition() != null ? pendingEmployee.getPosition().getTitle() : "-";
        if (!Objects.equals(oldPositionTitle, newPositionTitle)) {
            changedFields.put("직급", Map.of(
                    "oldValue", oldPositionTitle,
                    "newValue", newPositionTitle
            ));
        }

        // 입사일 비교
        if (!Objects.equals(existingEmployee.getHireDate(), pendingEmployee.getHireDate())) {
            changedFields.put("입사일", Map.of(
                    "oldValue", existingEmployee.getHireDate() != null ? existingEmployee.getHireDate().toString() : "-",
                    "newValue", pendingEmployee.getHireDate() != null ? pendingEmployee.getHireDate().toString() : "-"
            ));
        }

        // 퇴사 여부 비교
        if (!Objects.equals(existingEmployee.getIsTerminated(), pendingEmployee.getIsTerminated())) {
            changedFields.put("퇴사 여부", Map.of(
                    "oldValue", existingEmployee.getIsTerminated() ? "✅ 퇴사" : "🔵 재직 중",
                    "newValue", pendingEmployee.getIsTerminated() ? "✅ 퇴사" : "🔵 재직 중"
            ));
        }

        return changedFields;
    }


    /**
     * ✅ `Employee` → `EmployeeDTO` 변환 (변경된 필드 추가)
     */
    private EmployeeDTO convertToDTO(Employee employee) {
        Map<String, Map<String, String>> changedFields = new HashMap<>();
        if (employee.getParent() != null) {
            changedFields = compareEmployeeChanges(employee.getParent(), employee);
        }

        return new EmployeeDTO(
                employee.getId(),
                employee.getName(),
                employee.getBirthDate(),
                employee.getGender(),
                employee.getPhone(),
                employee.getEmail(),
                employee.getAddress(),
                employee.getDepartment().getDepartmentId(),
                employee.getDepartment().getName(),
                employee.getPosition().getPositionId(),
                employee.getPosition().getTitle(),
                employee.getHireDate(),
                employee.getTerminationDate(),
                employee.getIsTerminated(),
                employee.getApprovedByEmployeeId(),
                employee.getParent() != null ? employee.getParent().getId() : null, // ✅ 부모 ID 추가
                changedFields // ✅ 변경된 필드 목록 전달
        );
    }


    public boolean existById(Integer id) {
        return employeeRepository.existsById(id);
    }
    /**
     * ✅ 매일 자정에 실행되어 퇴사일이 지난 직원들을 퇴사 처리
     */
    @Scheduled(cron = "0 50 18 * * ?") // 매일 18:19 실행
    @Transactional
    public void processEmployeeTerminations() {
        LocalDate today = LocalDate.now();
        System.out.println("🔍 [퇴사 스케줄러] 실행됨: " + today);

        // ✅ 퇴사일이 오늘 이전이거나, 오늘 날짜인 직원 찾기
        List<Employee> employeesToTerminate = employeeRepository.findByTerminationDateBeforeOrTerminationDateEqualsAndIsTerminatedFalse(today, today);
        System.out.println("🔍 [퇴사 스케줄러] 퇴사 대상 직원 수: " + employeesToTerminate.size());

        if (employeesToTerminate.isEmpty()) {
            System.out.println("⚠️ [퇴사 스케줄러] 퇴사할 직원이 없습니다.");
            return;
        }

        for (Employee employee : employeesToTerminate) {
            System.out.println("🛠 [퇴사 스케줄러] 처리 중인 직원: " + employee.getId() + " - " + employee.getName());
            employee.setIsTerminated(true); // ✅ 퇴사 처리
            memberRepository.deleteByEmployeeId(employee.getId());
        }


        employeeRepository.saveAll(employeesToTerminate); // ✅ 한 번에 저장
        employeeRepository.flush(); // ✅ 변경 사항 즉시 반영
        System.out.println("✅ [퇴사 스케줄러] 모든 직원 퇴사 처리 완료!");
    }
}
