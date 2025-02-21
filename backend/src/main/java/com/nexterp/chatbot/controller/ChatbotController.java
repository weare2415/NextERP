package com.nexterp.chatbot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.Map;


@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final RestTemplate restTemplate;

    public ChatbotController() {
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/ask")
    public ResponseEntity<String> askChatbot(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String employeeId = request.get("employeeId");
        String department = request.get("department");

        // ✅ 부서 ID 매핑 (부서명 → 부서 ID 변환)
        Map<String, Integer> departmentMapping = Map.of(
                "영업팀", 1,
                "회계팀", 2,
                "인사팀", 3
        );

        Integer departmentId = departmentMapping.get(department);

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("❌ 메시지를 입력하세요.");
        }
        if (employeeId == null || employeeId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("❌ 직원 ID가 필요합니다.");
        }
        if (departmentId == null) { // ✅ 부서 ID를 찾을 수 없는 경우 처리
            return ResponseEntity.badRequest().body("❌ 부서 정보가 올바르지 않습니다.");
        }

        try {
            // Flask 서버로 요청 전송
            String chatbotResponse = restTemplate.postForObject(
                    "http://localhost:6000/chat",
                    Map.of("message", userMessage, "employeeId", employeeId, "department", department, "departmentId", departmentId),
                    String.class
            );
            return ResponseEntity.ok(chatbotResponse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ 서버 오류: " + e.getMessage());
        }
    }
}
