package com.nexterp.member.dto;

/*
 * Description    :
 * ProjectName    : login
 * PackageName    : com.login.member.dto
 * FileName       : MemberDTO
 * Author         : paesir
 * Date           : 25. 1. 26.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 26.오전 3:46  paesir      최초 생성
 */


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@ToString
public class MemberDTO extends User {

    private final String id;  // 로그인 아이디
    private final String name; // 사용자 이름
    private final String role; // 사용자 권한
    private final boolean isInitialPassword; // ✅ 추가된 필드

    public MemberDTO(String id, String password, Collection<? extends GrantedAuthority> authorities, String name, String role, boolean isInitialPassword) {
        super(id, password, authorities); // Spring Security User 생성자 호출
        this.id = id;
        this.name = name;
        this.role = role;
        this.isInitialPassword = isInitialPassword;
    }

    public Map<String, Object> getClaims() {

        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("id", id);
        dataMap.put("name", name);
        dataMap.put("role", role);
        dataMap.put("isInitialPassword", isInitialPassword); // ✅ 추가된 필드 포함

        return dataMap;
    }
}
