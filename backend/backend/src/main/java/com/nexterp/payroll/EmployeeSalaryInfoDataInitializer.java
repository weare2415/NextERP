package com.nexterp.payroll;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.employee
 * FileName       : EmployeeDataInitializer
 * Author         : paesir
 * Date           : 25. 1. 17.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 17.오후 4:20  paesir      최초 생성
 */


import com.nexterp.employee.dto.EmployeeDTO;
import com.nexterp.employee.entity.Department;
import com.nexterp.employee.entity.Position;
import com.nexterp.employee.repository.DepartmentRepository;
import com.nexterp.employee.repository.PositionRepository;
import com.nexterp.employee.service.EmployeeService;
import com.nexterp.payroll.dto.EmployeeSalaryInfoDTO;
import com.nexterp.payroll.service.EmployeeSalaryInfoService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Configuration
public class EmployeeSalaryInfoDataInitializer {
 /* @Bean
  public ApplicationRunner initializeEmployeeSalaryInfo(EmployeeService employeeService,
                                                        EmployeeSalaryInfoService salaryInfoService) {
    return args -> {
      // ✅ 1. 직원 ID 및 초기 급여 데이터 설정
      List<EmployeeSalaryInfoDTO> salaryInfoList = Arrays.asList(
          new EmployeeSalaryInfoDTO(1L, 80001234, BigDecimal.valueOf(50000000), BigDecimal.valueOf(5000000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(2L, 10000001, BigDecimal.valueOf(32000000), BigDecimal.valueOf(3000000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(3L, 10000002, BigDecimal.valueOf(35000000), BigDecimal.valueOf(3500000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(4L, 10000003, BigDecimal.valueOf(42000000), BigDecimal.valueOf(4000000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(5L, 20000001, BigDecimal.valueOf(28000000), BigDecimal.valueOf(2500000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(6L, 20000002, BigDecimal.valueOf(39000000), BigDecimal.valueOf(3800000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(7L, 20000003, BigDecimal.valueOf(45000000), BigDecimal.valueOf(4500000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(8L, 30000001, BigDecimal.valueOf(31000000), BigDecimal.valueOf(2900000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(9L, 30000002, BigDecimal.valueOf(36000000), BigDecimal.valueOf(3500000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(10L, 30000003, BigDecimal.valueOf(43000000), BigDecimal.valueOf(4200000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(11L, 10001234, BigDecimal.valueOf(55000000), BigDecimal.valueOf(5000000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(12L, 10007777, BigDecimal.valueOf(60000000), BigDecimal.valueOf(5500000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(13L, 20001234, BigDecimal.valueOf(48000000), BigDecimal.valueOf(4500000), LocalDate.now(), null),
          new EmployeeSalaryInfoDTO(14L, 30001234, BigDecimal.valueOf(50000000), BigDecimal.valueOf(4800000), LocalDate.now(), null)
      );

      // ✅ 2. 급여 정보 저장
      salaryInfoList.forEach(salaryInfoDTO -> {
        try {
          salaryInfoService.saveSalaryInfo(salaryInfoDTO);
          System.out.println("💰 급여 정보 저장 완료: 직원 ID " + salaryInfoDTO.getEmployeeId());
        } catch (Exception e) {
          System.err.println("⚠️ 급여 정보 저장 실패 (직원 없음): 직원 ID " + salaryInfoDTO.getEmployeeId());
        }
      });
    };
  }*/
}
