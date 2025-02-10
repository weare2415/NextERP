package com.nexterp.payroll.entity;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.entity
 * FileName       : EmployeeSalaryInfo
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:44  paesir      최초 생성
 */

import com.nexterp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.mapping.ToOne;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name="employee_salaries_info")
public class EmployeeSalaryInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee; // 직원 참조

    @Column(nullable = false)
    private BigDecimal baseSalary; // 기본급

    @Column
    private BigDecimal deductions; // 공제

    @Column(nullable = false, updatable = false)
    private LocalDate effectiveDate; // 적용 시작일

    @Column
    private LocalDate endDate; // 적용 종료일 (Optional)

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    @PreUpdate
    public void setUpdatedAt() {
        this.updatedAt = LocalDateTime.now();
    }
}
