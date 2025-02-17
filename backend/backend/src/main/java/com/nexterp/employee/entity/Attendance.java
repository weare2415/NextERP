package com.nexterp.employee.entity;

import com.nexterp.client.entity.RequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "attendance")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; // 근태 기록 ID (Primary Key)

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id")
    private Employee employee; // 사원 ID (Foreign Key, Employee 참조)

    @Column(name = "date", nullable = false)
    private LocalDate date; // 근무 날짜

    @Column(name = "check_in_time")
    private LocalTime checkInTime; // 출근 시간

    @Column(name = "check_out_time")
    private LocalTime checkOutTime; // 퇴근 시간

    @Column(name = "overtime_hours", precision = 5, scale = 2)
    private BigDecimal overtimeHours; // 초과 근무 시간 (소수점 2자리)

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AttendanceStatus status; // 근무 상태 (ENUM)

    // ✅ 새로운 필드 추가 (DB 컬럼으로 저장하지 않고 DTO로만 사용 가능)
    @Transient // DB에 저장하지 않고 DTO 변환용으로만 사용
    private String overtimeFormatted;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_status", nullable = false, length = 20)
    private RequestStatus requestStatus = RequestStatus.PREPARED; // 기본값: PREPARED

    // ✅ 승인 요청 사유 (승인 요청 시 입력)
    @Column(name = "approval_reason", length = 255)
    private String approvalReason;

    // ✅ 승인 요청 날짜
    @Column(name = "request_date")
    private LocalDate requestDate;

    // ✅ 승인 처리한 관리자 ID (승인 시 저장됨)
    @Column
    private Integer approvedByEmployeeId; // 승인한 관리자 ID

}
