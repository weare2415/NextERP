package com.nexterp.member.repository;

/*
 * Description    :
 * ProjectName    : login
 * PackageName    : com.login.member.repository
 * FileName       : MemberRepository
 * Author         : paesir
 * Date           : 25. 1. 26.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 26.오전 3:57  paesir      최초 생성
 */


import com.nexterp.member.entity.Member;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String > {

    @Query("SELECT m FROM Member m WHERE m.employee.id = :employeeId")
    Optional<Member> findByEmployeeId(@Param("employeeId") String employeeId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Member m WHERE m.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") Integer employeeId);



}
