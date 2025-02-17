package com.nexterp.messenger.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nexterp.messenger.dto.MessageRequestDTO;
import com.nexterp.messenger.dto.MessageResponseDTO;
import com.nexterp.messenger.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping({"/send", ""})  // ✅ "/messages"와 "/messages/send" 둘 다 허용
    public MessageResponseDTO sendMessage(@RequestBody MessageRequestDTO messageRequestDTO) throws JsonProcessingException {
        System.out.println("📩 [Spring Boot] 받은 메시지 요청: " + messageRequestDTO);

        return messageService.saveMessage(messageRequestDTO);
    }

    // ✅ 메시지 목록을 JSON 배열로 반환
    @GetMapping("/{chatRoomId}")
    public List<MessageResponseDTO> getMessages(@PathVariable Long chatRoomId) {
        return messageService.getMessages(chatRoomId);
    }

    // ✅ 안 읽은 메시지 조회 API
    // ✅ 수정 후: 채팅방별 안 읽은 메시지 개수를 Map 형태로 반환
    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<Long, Integer>> getUnreadMessages(@PathVariable Long userId) {
        Map<Long, Integer> unreadCounts = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(unreadCounts);
    }

    @PostMapping("/read/{userId}/{chatRoomId}")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long userId, @PathVariable Long chatRoomId) {
        messageService.markMessagesAsRead(userId, chatRoomId);
        return ResponseEntity.ok().build();
    }
}