package com.nexterp.payroll.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.dto
 * FileName       : EmployeeSalaryInfoDTO
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:51  paesir      최초 생성
 */

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeSalaryInfoDTO {
  private Long id;
  private Integer employeeId; // 직원 ID
  private BigDecimal baseSalary; // 기본급
  private BigDecimal deductions; // 공제
  private LocalDate effectiveDate; // 적용 시작일
  private LocalDate endDate; // 적용 종료일 (Optional)
}
