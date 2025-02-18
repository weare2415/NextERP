package com.nexterp.messenger.service;

import com.nexterp.messenger.dto.ChatRoomRequestDTO;
import com.nexterp.messenger.dto.ChatRoomResponseDTO;

import java.util.List;

public interface ChatRoomService {
    ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO chatRoomRequestDTO);
    ChatRoomResponseDTO getChatRoom(Integer senderId, Integer receiverId);
    ChatRoomResponseDTO getChatRoomById(Long chatRoomId); // ✅ chatRoomId로 조회하는 메서드 추가
    List<ChatRoomResponseDTO> getAllChatRooms();
    void leaveChatRoom(Long chatRoomId);  // ✅ 추가: 채팅방 나가기
    List<ChatRoomResponseDTO> getActiveChatRooms(Integer userId);
}