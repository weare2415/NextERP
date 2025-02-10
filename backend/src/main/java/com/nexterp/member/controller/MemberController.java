package com.nexterp.member.controller;


import com.nexterp.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nexterp.member.dto.ForgotPasswordRequestDTO;

import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // **비밀번호 변경 API**
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String name = request.get("id");
        String newPassword = request.get("newPassword");

        try {
            memberService.changePassword(name, newPassword);
            return ResponseEntity.ok().body(Map.of("message", "비밀번호가 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {
        try {
            System.out.println("요청 데이터: " + request);

            String name = request.getName();
            String email = request.getEmail();

            if (name == null || email == null || name.isEmpty() || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "이름과 이메일을 입력하세요."));
            }

            memberService.resetPassword(name, email);
            return ResponseEntity.ok().body(Map.of("message", "임시 비밀번호가 이메일로 전송되었습니다."));
        } catch (IllegalArgumentException e) {
            System.out.println("예외 발생: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.out.println("서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "서버에서 오류가 발생했습니다."));
        }
    }
}