package com.nexterp.employee.controller;

import com.nexterp.employee.dto.AttendanceDTO;
import com.nexterp.employee.entity.Attendance;
import com.nexterp.employee.entity.AttendanceStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.service.AttendanceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // 모든 근태 기록 조회
    @GetMapping
    public ResponseEntity<Page<AttendanceDTO>> getAllAttendances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(attendanceService.getAllAttendances(page, size));
    }

    // 특정 직원의 근태 기록 조회
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Page<AttendanceDTO>> getAttendanceByEmployee(
            @PathVariable Integer employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Employee employee = new Employee();
        employee.setId(employeeId);
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(employee, page, size));
    }

    // 특정 날짜의 근태 기록 조회
    @GetMapping("/date/{date}")
    public ResponseEntity<Page<AttendanceDTO>> getAttendanceByDate(
            @PathVariable String date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(localDate, page, size));
    }

    // 근태 기록 생성
    @PostMapping
    public ResponseEntity<AttendanceDTO> saveAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        AttendanceDTO savedAttendance = attendanceService.saveAttendance(attendanceDTO);
        return ResponseEntity.ok(savedAttendance);
    }

    //상태 업데이트
    @PutMapping("/{id}/status")
    public ResponseEntity<AttendanceDTO> updateAttendanceStatus(
            @PathVariable Integer id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(attendanceService.updateAttendanceStatus(id, status));
    }

    @GetMapping("/attendance/status/{status}")
    public ResponseEntity<Page<AttendanceDTO>> getAttendancesByStatus(
            @PathVariable String status,
            @PageableDefault(size = 5) Pageable pageable) {
        AttendanceStatus attendanceStatus = convertToEnum(status);
        return ResponseEntity.ok(attendanceService.getAttendancesByStatus(attendanceStatus, pageable));
    }

    // ✅ 한글 → Enum 변환 추가
    private AttendanceStatus convertToEnum(String status) {
        switch (status) {
            case "휴가":
                return AttendanceStatus.LEAVE;
            case "병가":
                return AttendanceStatus.SICK_LEAVE;
            case "재택근무":
                return AttendanceStatus.REMOTE_WORK;
            default:
                throw new IllegalArgumentException("잘못된 상태값: " + status);
        }
    }

    // 휴가 병가 조회
    @GetMapping("/employee/{employeeId}/statuses")
    public ResponseEntity<Page<AttendanceDTO>> getAttendancesByEmployeeAndStatus(
            @PathVariable Integer employeeId,
            @RequestParam List<String> statuses, // ✅ 상태 목록
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        List<AttendanceStatus> statusList = statuses.stream()
                .map(AttendanceStatus::valueOf)
                .collect(Collectors.toList());

        return ResponseEntity.ok(attendanceService.getAttendancesByEmployeeAndStatus(employeeId, statusList, page, size));
    }

    //자택 근무 조회
    @GetMapping("/remote-work")
    public ResponseEntity<Page<Attendance>> getRemoteWorkAttendance(
            @RequestParam Integer employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<Attendance> attendances = attendanceService.getRemoteWorkAttendance(employeeId, page, size);
        return ResponseEntity.ok(attendances);
    }


    // ✅ 출근(PRESENT), 지각(LATE), 퇴근(OFF_WORK) 상태만 가져오기 (페이징 지원)
    @GetMapping("/present-late-offwork")
    public ResponseEntity<Page<AttendanceDTO>> getAttendancesPresentLateOffWork(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(attendanceService.getAttendancesPresentLateOffWork(page, size));
    }


    //  승인 대기 중인 근태 기록 조회 (페이징 처리 추가)
    @GetMapping("/pending")
    public ResponseEntity<Page<AttendanceDTO>> getPendingAttendances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(attendanceService.getPendingAttendances(page, size));
    }


    // 승인된 근태 기록 조회
    @GetMapping("/approved")
    public ResponseEntity<Page<AttendanceDTO>> getAllApprovedAttendances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(attendanceService.getAllActiveAttendances(page, size));
    }

    // 승인 요청
    @PutMapping("/{id}/request-approval")
    public ResponseEntity<AttendanceDTO> requestApproval(
            @PathVariable Integer id,
            @RequestParam String status,  //
            @RequestParam String date,    //
            @RequestParam String reason
    ) {
        return ResponseEntity.ok(attendanceService.requestApproval(id, status, LocalDate.parse(date), reason));
    }

    //근태 승인
    @PutMapping("/{id}/approve")
    public ResponseEntity<AttendanceDTO> approveAttendance(@PathVariable Integer id) {
        return ResponseEntity.ok(attendanceService.approveAttendance(id));
    }



    // ✅ 근태 승인 거부 (승인 요청을 거절)
    @PutMapping("/{id}/reject")
    public ResponseEntity<AttendanceDTO> rejectAttendance(@PathVariable Integer id) {
        return ResponseEntity.ok(attendanceService.rejectAttendance(id));
    }



    // 근태 기록 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Integer id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok("Attendance record deleted successfully.");
    }
}