package com.nexterp.employee.controller;

import com.nexterp.employee.dto.AttendanceDTO;
import com.nexterp.employee.entity.Attendance;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // 모든 근태 기록 조회
    @GetMapping
    public List<AttendanceDTO> getAllAttendances() {
        return attendanceService.getAllAttendances();
    }

    // 특정 직원의 근태 기록 조회
    @GetMapping("/employee/{employeeId}")
    public List<AttendanceDTO> getAttendanceByEmployee(@PathVariable Integer employeeId) {
        Employee employee = new Employee();
        employee.setId(employeeId);
        return attendanceService.getAttendanceByEmployee(employee);
    }

    // 특정 날짜의 근태 기록 조회
    @GetMapping("/date/{date}")
    public List<AttendanceDTO> getAttendanceByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return attendanceService.getAttendanceByDate(localDate);
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
    public ResponseEntity<List<AttendanceDTO>> getAttendancesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(attendanceService.getAttendancesByStatus(status));
    }

    //상태
    // ✅ 승인 대기 중인 근태 기록 조회 (PENDING 상태)
    @GetMapping("/pending")
    public ResponseEntity<List<AttendanceDTO>> getPendingAttendances() {
        return ResponseEntity.ok(attendanceService.getPendingAttendances());
    }

    // ✅ 승인된 근태 기록 조회 (PREPARED, APPROVED, REJECTED)
    @GetMapping("/approved")
    public ResponseEntity<List<AttendanceDTO>> getAllApprovedAttendances() {
        return ResponseEntity.ok(attendanceService.getAllActiveAttendances());
    }

    // 승인 요청
    @PutMapping("/{id}/request-approval")
    public ResponseEntity<AttendanceDTO> requestApproval(
            @PathVariable Integer id,
            @RequestParam String status,  // ✅ 프론트에서 넘겨주는 상태값
            @RequestParam String date,    // ✅ 프론트에서 넘겨주는 날짜값
            @RequestParam String reason   // ✅ 프론트에서 넘겨주는 사유값
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