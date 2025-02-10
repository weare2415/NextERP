package com.nexterp.payroll.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.service
 * FileName       : EmployeeSalaryInfoService
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:53  paesir      최초 생성
 */


import com.nexterp.payroll.dto.EmployeeSalaryInfoDTO;

import java.util.List;
import java.util.Optional;

public interface EmployeeSalaryInfoService {
  EmployeeSalaryInfoDTO saveSalaryInfo(EmployeeSalaryInfoDTO employeeSalaryInfoDTO);
  Optional<EmployeeSalaryInfoDTO> findByEmployeeId(Integer employeeId);
  List<EmployeeSalaryInfoDTO> findAllSalaryInfo();
  List<EmployeeSalaryInfoDTO> findSalaryInfoHistoryByEmployeeId(Integer employeeId);
  void deleteSalaryInfo(Long id);
}
