package com.nexterp.payroll.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.controller
 * FileName       : SalaryController
 * Author         : paesir
 * Date           : 25. 1. 23.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 23.오후 5:08  paesir      최초 생성
 */

import com.nexterp.payroll.dto.SalaryDTO;
import com.nexterp.payroll.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalaryController {
  private final SalaryService salaryService;

  // 급여 지급 컨트롤러
  @PostMapping
  public ResponseEntity<SalaryDTO> createSalary(@RequestBody SalaryDTO salaryDTO) {
    SalaryDTO createdSalary = salaryService.createSalary(salaryDTO);
    return ResponseEntity.ok(createdSalary);
  }

  /*
   * 특정 직원의 지급된 급여 내역 조회
   * @param employeeId 직원 ID
   * @return 직원의 급여 내역 리스트
   */
  @GetMapping("/employee/{employeeId}")
  public ResponseEntity<List<SalaryDTO>> getSalariesByEmployeeId(@PathVariable Integer employeeId) {
    List<SalaryDTO> salaries = salaryService.getSalariesByEmployeeId(employeeId);
    return ResponseEntity.ok(salaries);
  }

  /*
   * 모든 지급된 급여 데이터 조회
   * @return 모든 급여 데이터 리스트
   */
  @GetMapping
  public ResponseEntity<List<SalaryDTO>> getAllSalaries() {
    List<SalaryDTO> salaries = salaryService.getAllSalaries();
    return ResponseEntity.ok(salaries);
  }

  /*
   * 특정 지급된 급여 데이터 삭제
   * @param salaryId 삭제할 급여 ID
   * @return 성공 메시지
   */
  @DeleteMapping("/{salaryId}")
  public ResponseEntity<String> deleteSalaryById(@PathVariable Long salaryId) {
    salaryService.deleteSalaryById(salaryId);
    return ResponseEntity.ok("급여 데이터가 성공적으로 삭제되었습니다.");
  }
}
