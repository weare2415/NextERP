package com.nexterp.member.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@ToString
@NoArgsConstructor // 기본 생성자 추가 (Spring이 JSON을 객체로 변환할 때 필요)
@AllArgsConstructor // 모든 필드를 포함하는 생성자 추가
public class ForgotPasswordRequestDTO {

    private String name;
    private String email;
}
