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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface EmployeeSalaryInfoService {
  EmployeeSalaryInfoDTO saveSalaryInfo(EmployeeSalaryInfoDTO employeeSalaryInfoDTO);
  Optional<EmployeeSalaryInfoDTO> findByEmployeeId(Integer employeeId);
  Page<EmployeeSalaryInfoDTO> findAllSalaryInfo(Pageable pageable);
  Page<EmployeeSalaryInfoDTO> findSalaryInfoHistoryByEmployeeId(Integer employeeId, Pageable pageable);
  void deleteSalaryInfo(Long id);
}
