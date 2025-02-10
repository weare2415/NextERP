package com.nexterp.payroll.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.service
 * FileName       : SalaryService
 * Author         : paesir
 * Date           : 25. 1. 19.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 19.오후 11:08  paesir      최초 생성
 */


import com.nexterp.payroll.dto.SalaryDTO;

import java.util.List;

public interface SalaryService {
    // 급여 지급
    SalaryDTO createSalary(SalaryDTO salaryDTO);

    // 특정 직원의 지급 급여 내역 조회
    List<SalaryDTO> getSalariesByEmployeeId(Integer employeeId);

    // 모든 지급 급여 내역 조회
    List<SalaryDTO> getAllSalaries();

    // 특정 지급 급여 삭제
    void deleteSalaryById(Long salaryId);
}
