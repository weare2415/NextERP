package com.nexterp.member.service;

/*
 * Description    :
 * ProjectName    : login
 * PackageName    : com.login.member.service
 * FileName       : MemberService
 * Author         : paesir
 * Date           : 25. 1. 26.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 26.오전 3:58  paesir      최초 생성
 */


import com.nexterp.employee.entity.Employee;
import com.nexterp.member.entity.Member;

public interface MemberService {
  Member createMember(Employee employee);
  // ✅ 비밀번호 변경 (이름과 이메일 기반)
  void changePassword(String id, String newPassword);

  // ✅ 이름과 이메일을 사용하여 비밀번호 초기화
  void resetPassword(String name, String email);

  void updateMemberName(Integer id, String name);
}