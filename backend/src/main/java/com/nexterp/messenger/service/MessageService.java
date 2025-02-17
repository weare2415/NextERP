package com.nexterp.messenger.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nexterp.messenger.dto.MessageRequestDTO;
import com.nexterp.messenger.dto.MessageResponseDTO;

import java.util.List;
import java.util.Map;

public interface MessageService {
    // ✅ 메시지 저장 (보낸 메시지를 반환)
    MessageResponseDTO saveMessage(MessageRequestDTO messageRequestDTO) throws JsonProcessingException;

    // ✅ 특정 채팅방의 모든 메시지 조회 (단일 객체 X, 리스트 반환)
    List<MessageResponseDTO> getMessages(Long chatRoomId);

    Map<Long, Integer> getUnreadMessages(Long userId);// 안 읽은 메시지 조회
    void markMessagesAsRead(Long userId, Long chatRoomId); // 메시지 읽음 처리
}