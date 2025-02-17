package com.nexterp.payroll.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.dto
 * FileName       : BonusLogDTO
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:53  paesir      최초 생성
 */

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BonusLogDTO {
    private Long id; // Primary Key
    private Integer employeeId; // 직원 ID
    private BigDecimal bonusAmount; // 지급된 보너스 금액
    private LocalDateTime grantedAt; // 지급 시간
    private String description; // 지급 사유 (Optional)
}
