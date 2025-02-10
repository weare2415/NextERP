package com.nexterp.payroll.repository;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.repository
 * FileName       : EmployeeSalaryInfoRepository
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:46  paesir      최초 생성
 */

import com.nexterp.payroll.entity.EmployeeSalaryInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeSalaryInfoRepository extends JpaRepository<EmployeeSalaryInfo, Long> {
//  현재 전체 직원 급여 정보 데이터 조회
@Query("SELECT e FROM EmployeeSalaryInfo e WHERE e.effectiveDate <= CURRENT_DATE " +
    "AND (e.endDate IS NULL OR e.endDate >= CURRENT_DATE)")
List<EmployeeSalaryInfo> findActiveSalaryInfos();

//  현재 직원별 급여 정보 데이터 조회
  @Query("SELECT e FROM EmployeeSalaryInfo e WHERE e.employee.id = :employeeId " +
      "AND e.effectiveDate <= CURRENT_DATE " +
      "AND (e.endDate IS NULL OR e.endDate >= CURRENT_DATE)")
  Optional<EmployeeSalaryInfo> findActiveSalaryInfo(@Param("employeeId") Integer employeeId);

  @Query("SELECT e FROM EmployeeSalaryInfo e WHERE e.employee.id = :employeeId " +
      "AND e.effectiveDate <= CURRENT_DATE " +
      "AND (e.endDate IS NULL OR e.endDate >= CURRENT_DATE)")
  EmployeeSalaryInfo findActiveSalaryInfo_(Integer employeeId);

  // 과거 기록 조회
  List<EmployeeSalaryInfo> findByEmployee_IdAndEndDateIsNotNull(Integer employeeId);
}
