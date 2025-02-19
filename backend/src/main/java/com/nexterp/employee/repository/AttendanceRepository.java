package com.nexterp.employee.repository;

import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Attendance;
import com.nexterp.employee.entity.AttendanceStatus;
import com.nexterp.employee.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    // 특정 직원의 근태 기록 조회
    Page<Attendance> findByEmployee(Employee employee, Pageable pageable);

    // 특정 날짜의 전체 근태 기록 조회
    Page<Attendance> findByDate(LocalDate date, Pageable pageable);

    // 특정 상태를 가진 근태 기록 조회
    Page<Attendance> findByStatus(AttendanceStatus status, Pageable pageable);

    Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date);


    //  PENDING 상태가 아닌 근태 기록 조회 (PREPARED, APPROVED, REJECTED)
//    @Query("SELECT a FROM Attendance a WHERE a.requestStatus IN ('PREPARED', 'APPROVED', 'REJECTED')")
//    List<Attendance> findAllActiveAttendances();
    @Query("SELECT a FROM Attendance a " +
            "WHERE a.requestStatus IN ('PREPARED', 'APPROVED', 'REJECTED') " +
            "AND a.status NOT IN ('PRESENT', 'LATE', 'OFF_WORK') " +
            "ORDER BY a.date DESC")
    Page<Attendance> findAllActiveAttendances(Pageable pageable);



    //  PENDING 상태의 근태 기록 조회 (승인 대기)
    @Query("SELECT a FROM Attendance a " +
            "WHERE a.requestStatus = 'PENDING' " +
            "AND a.status NOT IN ('PRESENT', 'LATE', 'OFF_WORK') " +
            "ORDER BY a.date ASC, a.id ASC")
    Page<Attendance> findPendingAttendances(Pageable pageable);








    //  특정 상태(PRESENT, LATE, OFF_WORK)만 가져오기 (페이징 적용)
    @Query("SELECT a FROM Attendance a WHERE UPPER(a.status) IN ('PRESENT', 'LATE', 'OFF_WORK') ORDER BY a.date DESC")
    Page<Attendance> findByStatusPresentLateOffWork(Pageable pageable);


    // 휴가 병가 가져오는 메서드
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.status IN :statuses")
    Page<Attendance> findByEmployeeAndStatuses(@Param("employeeId") Integer employeeId,
                                               @Param("statuses") List<AttendanceStatus> statuses,
                                               Pageable pageable);

    //재택 근무 조회
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.status = 'REMOTE_WORK' ORDER BY a.requestDate DESC")
    Page<Attendance> findRemoteWorkByEmployee(@Param("employeeId") Integer employeeId, Pageable pageable);







}
