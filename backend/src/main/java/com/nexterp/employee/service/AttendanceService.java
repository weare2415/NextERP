package com.nexterp.employee.service;

import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.dto.AttendanceDTO;
import com.nexterp.employee.entity.Attendance;
import com.nexterp.employee.entity.AttendanceStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.AttendanceRepository;
import com.nexterp.employee.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    // ✅ DTO 변환 메서드
    private AttendanceDTO convertToDTO(Attendance attendance) {
        return new AttendanceDTO(
                attendance.getId(),
                attendance.getEmployee().getId(),
                attendance.getEmployee().getName(),
                attendance.getDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getOvertimeHours(),
                attendance.getStatus().toString(),
                attendance.getOvertimeFormatted(),
                attendance.getRequestStatus().toString(), // ✅ Enum → String 변환
                attendance.getApprovalReason(), // ✅ 승인 요청 사유 추가
                attendance.getRequestDate(), // ✅ 승인 요청 날짜 추가
                attendance.getApprovedByEmployeeId() // ✅ 승인 처리한 관리자 ID 추가
        );
    }

    // 전체 근태 기록 조회 (DTO 변환)
    public List<AttendanceDTO> getAllAttendances() {
        return attendanceRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 특정 직원의 근태 기록 조회 (DTO 변환)
    public List<AttendanceDTO> getAttendanceByEmployee(Employee employee) {
        return attendanceRepository.findByEmployee(employee)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 특정 날짜의 근태 기록 조회 (DTO 변환)
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // ✅ 승인 대기 중인 근태 기록 조회 (PENDING 상태)
    public List<AttendanceDTO> getPendingAttendances() {
        return attendanceRepository.findPendingAttendances() // ✅ 변경: JPQL 메서드 사용
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ 승인 완료된 근태 기록 조회 (PREPARED, APPROVED, REJECTED)
    public List<AttendanceDTO> getAllActiveAttendances() {
        return attendanceRepository.findAllActiveAttendances()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }




    public AttendanceDTO saveAttendance(AttendanceDTO dto) {
        // 1. Employee 조회
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + dto.getEmployeeId()));

        LocalDate today = dto.getDate();
        Optional<Attendance> existingAttendance = attendanceRepository.findByEmployeeAndDate(employee, today);

        if (existingAttendance.isPresent()) {
            // ✅ 퇴근 기록 업데이트 (퇴근 버튼 클릭)
            Attendance attendance = existingAttendance.get();

            if (dto.getCheckOutTime() != null) {
                attendance.setCheckOutTime(dto.getCheckOutTime());

                // ✅ 출근 시간과 퇴근 시간이 모두 존재해야 초과 근무 계산 가능
                if (attendance.getCheckInTime() != null) {
                    Duration totalWorkDuration = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
                    long totalWorkSeconds = totalWorkDuration.getSeconds(); // 총 근무 시간(초 단위)
                    long totalWorkHours = totalWorkSeconds / 3600; // 총 근무 시간(시간 단위)

                    if (totalWorkHours > 10) { // ✅ 10시간 초과 근무일 경우만 계산
                        long overtimeSeconds = totalWorkSeconds - (10 * 3600); // ✅ 초과 근무 시간 (10시간을 뺀 나머지)
                        long overtimeHours = overtimeSeconds / 3600;
                        long overtimeMinutes = (overtimeSeconds % 3600) / 60;
                        long overtimeSecs = overtimeSeconds % 60;

                        // ✅ "X시간 Y분 Z초" 형식의 문자열로 변환
                        String overtimeFormatted = String.format("%d시간 %d분 %d초", overtimeHours, overtimeMinutes, overtimeSecs);

                        // ✅ BigDecimal로 변환하여 DB 저장 (정확한 시간 값 저장)
                        BigDecimal overtimeDecimal = BigDecimal.valueOf((double) overtimeSeconds / 3600)
                                .setScale(2, RoundingMode.HALF_UP);

                        attendance.setOvertimeHours(overtimeDecimal);
                        attendance.setOvertimeFormatted(overtimeFormatted);
                    } else {
                        attendance.setOvertimeHours(BigDecimal.ZERO);
                        attendance.setOvertimeFormatted("0시간 0분 0초");
                    }
                }

                // ✅ 퇴근 시 상태를 "OFF_WORK"로 변경 (기존 상태 유지)
                attendance.setStatus(AttendanceStatus.OFF_WORK);
            }

            return convertToDTO(attendanceRepository.save(attendance));
        }

        // ✅ 출근 기록이 없는 경우 새로 생성
        LocalTime checkInTime = dto.getCheckInTime() != null ? dto.getCheckInTime() : LocalTime.now();
        AttendanceStatus status = checkInTime.isBefore(LocalTime.of(9, 0)) ? AttendanceStatus.PRESENT : AttendanceStatus.LATE;

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(dto.getDate())
                .checkInTime(checkInTime) // ✅ 현재 시간 설정
                .checkOutTime(null) // ✅ 출근 시점이므로 퇴근 시간 없음
                .status(status) // ✅ 상태 값 저장 (출근 상태 유지)
                .requestStatus(RequestStatus.APPROVED) // ✅ 기본값 적용
                .overtimeHours(BigDecimal.ZERO) // ✅ 기본값
                .overtimeFormatted("0시간 0분 0초") // ✅ 초 단위 추가
                .build();

        return convertToDTO(attendanceRepository.save(attendance));
    }



    @Transactional
    public AttendanceDTO requestApproval(Integer employeeId, String status, LocalDate date, String reason) {
        AttendanceStatus newStatus = AttendanceStatus.valueOf(status.toUpperCase());
        LocalDate today = LocalDate.now();

        // ✅ 병가는 다음날부터 가능
        if (newStatus == AttendanceStatus.SICK_LEAVE && date.isBefore(today.plusDays(1))) {
            throw new IllegalArgumentException("병가는 다음날부터 신청 가능합니다.");
        }

        // ✅ 휴가 & 재택근무는 일주일 뒤부터 가능
        if ((newStatus == AttendanceStatus.LEAVE || newStatus == AttendanceStatus.REMOTE_WORK)
                && date.isBefore(today.plusDays(7))) {
            throw new IllegalArgumentException("휴가 및 재택근무는 일주일 뒤부터 신청 가능합니다.");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + employeeId));

        Attendance newAttendance = new Attendance();
        newAttendance.setEmployee(employee);
        newAttendance.setRequestStatus(RequestStatus.PENDING);
        newAttendance.setStatus(newStatus);
        newAttendance.setDate(date);
        newAttendance.setApprovalReason(reason);
        newAttendance.setRequestDate(today);

        return convertToDTO(attendanceRepository.save(newAttendance));
    }





    // ✅ 승인 거부 처리
    @Transactional
    public AttendanceDTO rejectAttendance(Integer id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("근태 기록을 찾을 수 없습니다: " + id));

        attendance.setRequestStatus(RequestStatus.REJECTED);
        return convertToDTO(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceDTO approveAttendance(Integer id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("근태 기록을 찾을 수 없습니다: " + id));

        attendance.setRequestStatus(RequestStatus.APPROVED); // ✅ 승인 상태로 변경

        return convertToDTO(attendanceRepository.save(attendance));
    }


    public AttendanceDTO updateAttendanceStatus(Integer id, String newStatus) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("근태 기록을 찾을 수 없습니다: " + id));

        // ✅ 새로운 상태로 업데이트
        attendance.setStatus(AttendanceStatus.valueOf(newStatus.toUpperCase()));

        return convertToDTO(attendanceRepository.save(attendance));
    }

    // 특정 상태의 근태 기록 조회 (DTO 변환)
    public List<AttendanceDTO> getAttendancesByStatus(String status) {
        AttendanceStatus attendanceStatus = AttendanceStatus.valueOf(status.toUpperCase());
        return attendanceRepository.findByStatus(attendanceStatus)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }



    // 근태 기록 삭제
    public void deleteAttendance(Integer id) {
        attendanceRepository.deleteById(id);
    }
}
