package com.nexterp.employee.controller;

import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.dto.EmployeeDTO;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.entity.Position;
import com.nexterp.employee.repository.PositionRepository;
import com.nexterp.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
        Employee savedEmployee = employeeService.saveEmployee(employeeDTO);
        return ResponseEntity.ok(savedEmployee);
    }
    /**
     * ✅ 1. 직원 정보 수정 요청 (PENDING 상태로 신규 데이터 생성)
     */
    @PostMapping("/{id}/request-update")
    public ResponseEntity<EmployeeDTO> requestUpdateEmployee(
            @PathVariable Integer id,
            @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO pendingEmployee = employeeService.updateEmployee(id, employeeDTO);
        return ResponseEntity.ok(pendingEmployee);
    }

    /**
     * ✅ 2. 직원 정보 승인 (APPROVED 상태로 변경)
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<EmployeeDTO> approveEmployee(
            @PathVariable Integer id,
            @RequestParam Integer approvedByEmployeeId) {
        EmployeeDTO approvedEmployee = employeeService.approveEmployee(id, approvedByEmployeeId);
        return ResponseEntity.ok(approvedEmployee);
    }

    /**
     * ✅ 3. 직원 정보 반려 (REJECTED 상태로 변경)
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectEmployee(
            @PathVariable Integer id,
            @RequestParam Integer approvedByEmployeeId) {
        employeeService.rejectEmployee(id, approvedByEmployeeId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Integer id) {
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }


    @GetMapping("/name/{name}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByName(@PathVariable String  name) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByName(name);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartment(@PathVariable Integer departmentId) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByDepartment(departmentId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/position/{positionId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByPosition(@PathVariable Integer positionId) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByPosition(positionId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{departmentId}/position/{positionId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartmentAndPosition(
            @PathVariable Integer departmentId,
            @PathVariable Integer positionId) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByDepartmentAndPosition(departmentId, positionId);
        return ResponseEntity.ok(employees);
    }

    /**
     * ✅ 1. PENDING 상태의 직원 목록 조회
     */
    @GetMapping("/pending")
    public ResponseEntity<List<EmployeeDTO>> getPendingEmployees() {
        return ResponseEntity.ok(employeeService.getPendingEmployees());
    }

    /**
     * ✅ 2. 특정 직원이 요청한 승인 목록 조회
     */
    @GetMapping("/{employeeId}/requests")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByEmployeeId(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeesByEmployeeId(employeeId));
    }

    /**
     * ✅ 3. 특정 승인 상태(RequestStatus)의 직원 목록 조회
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByStatus(@PathVariable RequestStatus status) {
        return ResponseEntity.ok(employeeService.getEmployeesByStatus(status));
    }

    /**
     * ✅ 4. PENDING 상태가 아닌 직원 목록 조회 (PREPARED, APPROVED, REJECTED)
     */
    @GetMapping("/active")
    public ResponseEntity<List<EmployeeDTO>> getAllActiveEmployees() {
        return ResponseEntity.ok(employeeService.getAllActiveEmployees());
    }

    // ✅ 사원 ID 중복 체크 API 추가
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> checkEmployeeIdExists(@PathVariable Integer id) {
        boolean exists = employeeService.existById(id);
        return ResponseEntity.ok(exists);
    }

    // ✅ 자동 퇴사 처리 강제 실행 API (테스트용)
    @PostMapping("/terminate-now")
    public ResponseEntity<String> triggerTerminationNow() {
        employeeService.processEmployeeTerminations(); // ✅ 강제 퇴사 실행
        return ResponseEntity.ok("✅ 즉시 퇴사 처리가 실행되었습니다.");
    }
}




