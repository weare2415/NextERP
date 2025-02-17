package com.nexterp.payroll.entity;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.entity
 * FileName       : BonusLog
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:45  paesir      최초 생성
 */

import com.nexterp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "bonus_logs")
public class BonusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee; // 직원 참조

    @Column(nullable = false)
    private BigDecimal bonusAmount; // 지급된 보너스 금액

    @Column(nullable = false)
    private LocalDateTime grantedAt; // 지급 시간

    @Column
    private String description; // 지급 사유 (Optional)
}
