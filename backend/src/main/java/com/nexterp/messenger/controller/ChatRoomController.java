package com.nexterp.messenger.controller;

import com.nexterp.messenger.dto.ChatRoomRequestDTO;
import com.nexterp.messenger.dto.ChatRoomResponseDTO;
import com.nexterp.messenger.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatrooms")
@CrossOrigin(origins = "*")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping("/create")
    public ResponseEntity<ChatRoomResponseDTO> createChatRoom(@RequestBody ChatRoomRequestDTO chatRoomRequestDTO) {
        ChatRoomResponseDTO chatRoom = chatRoomService.createChatRoom(chatRoomRequestDTO);
        return ResponseEntity.ok(chatRoom);
    }

    // ✅ chatRoomId로 조회 (기본)
    @GetMapping("/{chatRoomId}")
    public ResponseEntity<ChatRoomResponseDTO> getChatRoomById(@PathVariable Long chatRoomId) {
        ChatRoomResponseDTO chatRoom = chatRoomService.getChatRoomById(chatRoomId);
        if (chatRoom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(chatRoom);
    }

    // ✅ senderId와 receiverId로 조회 (추가)
    @GetMapping("/chat/{senderId}/{receiverId}")
    public ResponseEntity<ChatRoomResponseDTO> getChatRoom(@PathVariable Integer senderId, @PathVariable Integer receiverId) {
        ChatRoomResponseDTO chatRoom = chatRoomService.getChatRoom(senderId, receiverId);
        if (chatRoom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping
    public ResponseEntity<List<ChatRoomResponseDTO>> getAllChatRooms() {
        List<ChatRoomResponseDTO> chatRooms = chatRoomService.getAllChatRooms();
        return ResponseEntity.ok(chatRooms);
    }

    @PostMapping("/leave/{chatRoomId}")
    public ResponseEntity<String> leaveChatRoom(@PathVariable Long chatRoomId) {
        chatRoomService.leaveChatRoom(chatRoomId);
        return ResponseEntity.ok("채팅방 나가기 완료");
    }

    // ✅ 🔥 **활성화된 (isActive = true) 채팅방만 가져오기**
    @GetMapping("/active/{userId}")
    public ResponseEntity<List<ChatRoomResponseDTO>> getActiveChatRooms(@PathVariable Integer userId) {
        List<ChatRoomResponseDTO> activeChatRooms = chatRoomService.getActiveChatRooms(userId);
        return ResponseEntity.ok(activeChatRooms);
    }
}