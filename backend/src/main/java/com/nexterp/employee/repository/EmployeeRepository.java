package com.nexterp.employee.repository;

import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.dto.EmployeeDTO;
import com.nexterp.employee.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

        // 부서별 조회
        @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId")
        Page<Employee> findByDepartmentId(@Param("departmentId") Integer departmentId, Pageable pageable);


        // 직급별 조회
        @Query("SELECT e FROM Employee e WHERE e.position.id = :positionId")
        Page<Employee> findByPositionId(@Param("positionId") Integer positionId, Pageable pageable);

        // 부서와 직급별 조회
        @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId AND e.position.id = :positionId")
        Page<Employee> findByDepartmentAndPosition(@Param("departmentId") Integer departmentId,
                                                   @Param("positionId") Integer positionId,
                                                   Pageable pageable);

        Page<Employee> findByName(String name, Pageable pageable);

        Optional<Employee> findByNameAndEmail(@Param("name") String name, @Param("email") String email);

        List<Employee> findByTerminationDateBeforeOrTerminationDateEqualsAndIsTerminatedFalse(LocalDate todayBefore, LocalDate todayEqual);

        Page<Employee> findByIsTerminatedFalse(Pageable pageable);

        //승인요청에 관련된 쿼리문
        // PENDING 상태가 아닌 직원 조회 (PREPARED, APPROVED, REJECTED)
        @Query("SELECT e FROM Employee e WHERE e.status IN ('PREPARED', 'APPROVED', 'REJECTED')")
        Page<Employee> findAllActiveEmployees(Pageable pageable);


        //  PENDING 상태 직원 조회 (페이징 추가)
        @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.parent WHERE e.status = 'PENDING'")
        Page<Employee> findPendingEmployees(Pageable pageable);


        //  특정 employeeId를 가진 직원 목록 조회 (페이징 추가)
        @Query("SELECT e FROM Employee e WHERE e.parent.id = :employeeId")
        Page<Employee> findByEmployeeId(@Param("employeeId") Integer employeeId, Pageable pageable);

        //  특정 승인 상태(RequestStatus)에 해당하는 직원 목록 조회 (페이징 추가)
        @Query("SELECT e FROM Employee e WHERE e.status = :status")
        Page<Employee> findByStatus(@Param("status") RequestStatus status, Pageable pageable);

        //새로 생기는 id 값
        @Query("SELECT MAX(e.id) FROM Employee e")
        Optional<Integer> findMaxId();



        //메신저용
        @Query("SELECT e FROM Employee e WHERE e.status IN ('PREPARED', 'APPROVED', 'REJECTED')")
        List<Employee> findEmployeesExcludingPending();


}

