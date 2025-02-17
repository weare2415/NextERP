package com.nexterp.payroll.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.controller
 * FileName       : EmployeeSalaryInfoController
 * Author         : paesir
 * Date           : 25. 1. 23.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 23.오후 5:35  paesir      최초 생성
 */


import com.nexterp.payroll.dto.EmployeeSalaryInfoDTO;
import com.nexterp.payroll.service.EmployeeSalaryInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-salaries")
@RequiredArgsConstructor
public class EmployeeSalaryInfoController {

  private final EmployeeSalaryInfoService employeeSalaryInfoService;

  /**
   * 모든 직원 급여 정보 조회
   */
  @GetMapping
  public ResponseEntity<Page<EmployeeSalaryInfoDTO>> getAllEmployeeSalaries(@RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<EmployeeSalaryInfoDTO> salaryInfos = employeeSalaryInfoService.findAllSalaryInfo(pageable);
    return ResponseEntity.ok(salaryInfos);
  }

  /**\
   * 특정 직원 급여 정보 조회
   * @param employeeId 직원 ID
   */
  @GetMapping("/{employeeId}")
  public ResponseEntity<EmployeeSalaryInfoDTO> getEmployeeSalaryById(@PathVariable Integer employeeId) {
    return employeeSalaryInfoService.findByEmployeeId(employeeId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
  }

  /**
   * 새로운 직원 급여 정보 생성
   * @param salaryInfoDTO 직원 급여 정보 데이터
   */
  @PostMapping
  public ResponseEntity<EmployeeSalaryInfoDTO> createEmployeeSalary(@RequestBody EmployeeSalaryInfoDTO salaryInfoDTO) {
    EmployeeSalaryInfoDTO createdSalaryInfo = employeeSalaryInfoService.saveSalaryInfo(salaryInfoDTO);
    return ResponseEntity.ok(createdSalaryInfo);
  }

  // 과거 급여 이력 조회 API
  @GetMapping("/history/{employeeId}")
  public ResponseEntity<Page<EmployeeSalaryInfoDTO>> getSalaryHistoryByEmployeeId(@PathVariable Integer employeeId,
                                                                                  @RequestParam(defaultValue = "0") int page,
                                                                                  @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<EmployeeSalaryInfoDTO> historyRecords = employeeSalaryInfoService.findSalaryInfoHistoryByEmployeeId(employeeId, pageable);
    return ResponseEntity.ok(historyRecords);
  }

  /**
   * 특정 직원 급여 정보 삭제
   * @param id 급여 정보 ID
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteEmployeeSalary(@PathVariable Long id) {
    employeeSalaryInfoService.deleteSalaryInfo(id);
    return ResponseEntity.ok("직원 급여 정보가 삭제되었습니다.");
  }
}
