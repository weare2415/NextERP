package com.nexterp.common.security;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.common.security
 * FileName       : CustomUserDetailsService
 * Author         : paesir
 * Date           : 25. 1. 17.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 17.오후 4:36  paesir      최초 생성
 */


import com.nexterp.employee.entity.Position;
import com.nexterp.member.dto.MemberDTO;
import com.nexterp.member.entity.Member;
import com.nexterp.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String employeeId) throws UsernameNotFoundException {
    log.info("Authenticating employeeId: {}", employeeId);

    Member member = memberRepository.findById(employeeId)
            .orElseThrow(() -> new UsernameNotFoundException("Member not found with employeeId: " + employeeId));

    log.info("Found member: {}", member);

    return new MemberDTO(
            member.getId(),
            member.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority(member.getRole())),
            member.getName(),
            member.getRole(),
            member.isInitialPassword()


    );
  }
}