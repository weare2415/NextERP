package com.nexterp.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    private Integer id;
    private Integer employeeId;
    private String employeeName;
    private LocalDate date;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private BigDecimal overtimeHours;
    private String status;
    private String overtimeFormatted;  // ✅ "2시간 30분" 형식의 문자열 필드 추가
    private String requestStatus;
    private String approvalReason; // ✅ 승인 요청 사유
    private LocalDate requestDate; // ✅ 승인 요청 날짜
    private Integer approvedByEmployeeId; // ✅ 승인 처리한 관리자 ID
}
