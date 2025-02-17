package com.nexterp.messenger.service;

import com.nexterp.messenger.dto.ChatRoomRequestDTO;
import com.nexterp.messenger.dto.ChatRoomResponseDTO;
import com.nexterp.messenger.entity.ChatRoom;
import com.nexterp.messenger.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Override
    @Transactional
    public ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO chatRoomRequestDTO) {
        Integer senderId = chatRoomRequestDTO.getSenderId();
        Integer receiverId = chatRoomRequestDTO.getReceiverId();

        // 🚨 senderId와 receiverId가 동일한 경우 방지
        if (senderId.equals(receiverId)) {
            System.out.println("❌ senderId와 receiverId가 동일하여 채팅방 생성 불가");
            return null;
        }

        // ✅ 기존 채팅방을 `isActive=false`도 포함해서 검색
        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findAnyChatRoom(senderId, receiverId);

        if (existingChatRoom.isPresent()) {
            ChatRoom chatRoom = existingChatRoom.get();

            // ✅ 기존 채팅방이 비활성화 상태라면 다시 활성화
            if (!chatRoom.getIsActive()) {
                chatRoom.setIsActive(true);
                chatRoomRepository.save(chatRoom);
                System.out.println("🔄 기존 채팅방 재활성화됨: ID = " + chatRoom.getId());
            } else {
                System.out.println("✔ 기존 활성 채팅방 존재: ID = " + chatRoom.getId());
            }

            return convertToDTO(chatRoom);
        }

        // ✅ 기존 채팅방이 없으면 새로 생성
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setSenderId(senderId);
        chatRoom.setReceiverId(receiverId);
        chatRoom.setIsActive(true);

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        System.out.println("✅ 새로운 채팅방 생성됨: ID = " + savedChatRoom.getId());

        return convertToDTO(savedChatRoom);
    }

    @Override
    public ChatRoomResponseDTO getChatRoom(Integer senderId, Integer receiverId) {
        Optional<ChatRoom> chatRoom = chatRoomRepository.findChatRoom(senderId, receiverId);

        if (chatRoom.isPresent()) {
            ChatRoom foundChatRoom = chatRoom.get();
            return convertToDTO(foundChatRoom);
        }
        return null;
    }

    @Override
    public ChatRoomResponseDTO getChatRoomById(Long chatRoomId) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(chatRoomId);
        return chatRoomOpt.map(this::convertToDTO).orElse(null);
    }

    @Override
    public List<ChatRoomResponseDTO> getAllChatRooms() {
        return chatRoomRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void leaveChatRoom(Long chatRoomId) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(chatRoomId);

        if (chatRoomOpt.isPresent()) {
            ChatRoom chatRoom = chatRoomOpt.get();

            // ✅ 개별 사용자 나가기 처리 (채팅방 자체를 비활성화하지 않음)
            chatRoom.setIsActive(false);
            chatRoomRepository.save(chatRoom);
            System.out.println("🚪 사용자가 채팅방에서 나감: ID = " + chatRoomId);
        }
    }

    @Override
    public List<ChatRoomResponseDTO> getActiveChatRooms(Integer userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findActiveChatRoomsByUser(userId);

        // ✅ 로그로 확인 (디버깅)
        System.out.println("🔥 [DEBUG] 필터 적용 후 가져온 활성 채팅방 목록:");
        for (ChatRoom chatRoom : chatRooms) {
            System.out.println("📌 ID: " + chatRoom.getId() + ", isActive: " + chatRoom.getIsActive());
        }

        return chatRooms.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ChatRoomResponseDTO convertToDTO(ChatRoom chatRoom) {
        return new ChatRoomResponseDTO(
                chatRoom.getId(),
                chatRoom.getSenderId(),
                chatRoom.getReceiverId(),
                chatRoom.getCreatedAt(),
                chatRoom.getIsActive()
        );
    }
}