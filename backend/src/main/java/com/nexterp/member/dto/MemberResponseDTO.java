package com.nexterp.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class MemberResponseDTO {
    private String id; // 로그인 ID
    private String name; // 사용자 이름
    private String email; // 사용자 이메일
    private boolean isInitialPassword; // 최초 비밀번호 여부
}