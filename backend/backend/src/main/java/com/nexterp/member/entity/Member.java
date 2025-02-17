package com.nexterp.member.entity;

/*
 * Description    :
 * ProjectName    : login
 * PackageName    : com.login.member.entity
 * FileName       : Member
 * Author         : paesir
 * Date           : 25. 1. 26.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 26.오전 3:14  paesir      최초 생성
 */


import com.nexterp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "member")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
  @Id
  @Column(name = "member_id", nullable = false, unique = true, length = 8)
  private String id; // 로그인 아이디 (Employee의 id)

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "name", nullable = false, length = 100)
  private String name; // 사용자 이름 (Employee의 name 사용)

  @Column(name = "role", nullable = false, length = 20)
  private String role; // 사용자 권한 (Position의 Role 사용)

  @OneToOne
  @JoinColumn(name = "employee_id", referencedColumnName = "employee_id")
  private Employee employee; // Employee에 reference

  @Column(nullable = false)  // 데이터베이스에 반드시 값이 들어가도록 설정
  private boolean isInitialPassword; // ✅ 추가
}
