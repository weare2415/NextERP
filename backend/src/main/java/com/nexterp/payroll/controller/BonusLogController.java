package com.nexterp.payroll.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.controller
 * FileName       : BonusLogController
 * Author         : paesir
 * Date           : 25. 1. 23.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 23.오후 5:38  paesir      최초 생성
 */


import com.nexterp.payroll.dto.BonusLogDTO;
import com.nexterp.payroll.service.BonusLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bonus-logs")
@RequiredArgsConstructor
public class BonusLogController {

  private final BonusLogService bonusLogService;

  /**
   * 새로운 보너스 로그 생성
   * @param bonusLogDTO 보너스 로그 데이터
   * @return 생성된 보너스 로그 데이터
   */
  @PostMapping
  public ResponseEntity<BonusLogDTO> createBonusLog(@RequestBody BonusLogDTO bonusLogDTO) {
    BonusLogDTO createdBonusLog = bonusLogService.save(bonusLogDTO);
    return ResponseEntity.ok(createdBonusLog);
  }

  /**
   * 특정 직원의 보너스 로그 조회
   * @param employeeId 직원 ID
   * @return 특정 직원의 보너스 로그 리스트
   */
  @GetMapping("/employee/{employeeId}")
  public ResponseEntity<List<BonusLogDTO>> getBonusLogsByEmployeeId(@PathVariable Integer employeeId) {
    List<BonusLogDTO> bonusLogs = bonusLogService.findByEmployeeId(employeeId);
    return ResponseEntity.ok(bonusLogs);
  }

  /**
   * 모든 보너스 로그 조회
   * @return 모든 보너스 로그 리스트
   */
  @GetMapping
  public ResponseEntity<List<BonusLogDTO>> getAllBonusLogs() {
    List<BonusLogDTO> bonusLogs = bonusLogService.findAll();
    return ResponseEntity.ok(bonusLogs);
  }

  /**
   * 특정 보너스 로그 삭제
   * @param id 보너스 로그 ID
   * @return 삭제 성공 메시지
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteBonusLogById(@PathVariable Long id) {
    bonusLogService.deleteById(id);
    return ResponseEntity.ok("보너스 로그가 성공적으로 삭제되었습니다.");
  }
}