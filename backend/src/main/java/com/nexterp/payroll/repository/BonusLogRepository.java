package com.nexterp.payroll.repository;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.repository
 * FileName       : BonusLogRepository
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:48  paesir      최초 생성
 */


import com.nexterp.payroll.entity.BonusLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BonusLogRepository extends JpaRepository<BonusLog, Long> {
    List<BonusLog> findByEmployeeId(Integer employeeId);
}
