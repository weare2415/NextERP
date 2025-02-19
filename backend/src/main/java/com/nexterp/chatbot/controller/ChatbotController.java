package com.nexterp.chatbot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("❌ 메시지를 입력하세요.");
        }

        // Flask 챗봇으로 요청 전송 (상품 조회 포함)
        String chatbotResponse = restTemplate.postForObject(
                "http://localhost:6000/chat",  // Flask API 엔드포인트
                Map.of("message", userMessage),
                String.class
        );

        return ResponseEntity.ok(chatbotResponse);
    }
}
