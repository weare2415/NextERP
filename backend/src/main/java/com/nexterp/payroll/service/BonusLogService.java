package com.nexterp.payroll.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.service
 * FileName       : BonusLogService
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 6:00  paesir      최초 생성
 */


import com.nexterp.payroll.dto.BonusLogDTO;

import java.util.List;

public interface BonusLogService {
    BonusLogDTO save(BonusLogDTO dto);
    List<BonusLogDTO> findByEmployeeId(Integer employeeId);
    List<BonusLogDTO> findAll();
    void deleteById(Long id);
}
