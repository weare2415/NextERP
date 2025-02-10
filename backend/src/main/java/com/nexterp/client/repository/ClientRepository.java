package com.nexterp.client.repository;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.repository
 * FileName       : ClientRepository
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:40  paesir      최초 생성
 */


import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
  List<Client> findByStatus(RequestStatus status);

  boolean existsByClientCode(String clientCode);

  Optional<Client> findByClientCode(String clientCode);

  // ✅ PENDING 상태가 아닌 거래처만 조회
  @Query("SELECT c FROM Client c WHERE c.status IN ('PREPARED', 'APPROVED', 'REJECTED')")
  List<Client> findAllActiveClients();

  // ✅ PENDING 상태의 거래처만 조회
  @Query("SELECT c FROM Client c WHERE c.status = 'PENDING'")
  List<Client> findPendingClients();

  // ✅ 특정 employeeId를 가진 거래처 목록 조회
  @Query("SELECT c FROM Client c WHERE c.employee.id = :employeeId")
  List<Client> findByEmployeeId(@Param("employeeId") Integer employeeId);
}
