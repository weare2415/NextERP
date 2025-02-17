package com.nexterp.messenger.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexterp.messenger.dto.MessageRequestDTO;
import com.nexterp.messenger.dto.MessageResponseDTO;
import com.nexterp.messenger.entity.ChatRoom;
import com.nexterp.messenger.entity.Message;
import com.nexterp.messenger.repository.ChatRoomRepository;
import com.nexterp.messenger.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    private static final int MESSAGE_LIMIT = 600;  // ✅ 메시지 개수 제한

    @Autowired
    private ObjectMapper objectMapper;  // ✅ JSON 변환을 위한 ObjectMapper

    @Override
    public MessageResponseDTO saveMessage(MessageRequestDTO messageRequestDTO) {
        System.out.println("📩 [Spring Boot] 메시지 저장 요청: " + messageRequestDTO.toString());

        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(messageRequestDTO.getChatRoomId());
        if (chatRoomOpt.isEmpty()) {
            throw new IllegalArgumentException("채팅방이 존재하지 않습니다.");
        }

        ChatRoom chatRoom = chatRoomOpt.get();
        List<Message> existingMessages = messageRepository.findMessagesByChatRoom(chatRoom);
        List<MessageResponseDTO> messageList = new ArrayList<>();

        if (!existingMessages.isEmpty()) {
            try {
                String existingContent = existingMessages.get(0).getContent();
                messageList = objectMapper.readValue(existingContent, new TypeReference<List<MessageResponseDTO>>() {
                });
            } catch (Exception e) {
                System.out.println("❌ [Spring Boot] 기존 메시지 파싱 실패: " + e.getMessage());
            }
        }

        // ✅ 새 메시지를 기존 메시지 리스트에 추가하되, 기존 메시지의 isRead 상태를 유지
        MessageResponseDTO newMessage = new MessageResponseDTO();
        newMessage.setChatRoomId(messageRequestDTO.getChatRoomId());
        newMessage.setSenderId(messageRequestDTO.getSenderId());
        newMessage.setReceiverId(messageRequestDTO.getReceiverId());
        newMessage.setContent(messageRequestDTO.getMessageText());
        newMessage.setRead(false);  // ✅ content 내부에 저장되는 read 값
        newMessage.setTimestamp(LocalDateTime.now());

        messageList.add(newMessage);

        // ✅ 새로운 메시지가 저장될 때 `is_read=false` 설정
        Message messageData = existingMessages.isEmpty() ? new Message() : existingMessages.get(0);
        messageData.setChatRoom(chatRoom);
        messageData.setSenderId(newMessage.getSenderId());
        messageData.setReceiverId(newMessage.getReceiverId());
        messageData.setRead(false);  // ✅ DB 컬럼에 is_read=false 설정

        try {
            messageData.setContent(objectMapper.writeValueAsString(messageList));
        } catch (Exception e) {
            System.out.println("❌ [Spring Boot] 메시지 변환 실패: " + e.getMessage());
        }

        messageData.setTimestamp(LocalDateTime.now());
        messageRepository.save(messageData);

        System.out.println("✅ [Spring Boot] 메시지 저장 완료 (is_read=false)");
        return newMessage;
    }

    @Override
    public List<MessageResponseDTO> getMessages(Long chatRoomId) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(chatRoomId);
        if (chatRoomOpt.isEmpty()) {
            throw new IllegalArgumentException("채팅방이 존재하지 않습니다.");
        }

        ChatRoom chatRoom = chatRoomOpt.get();
        List<Message> messages = messageRepository.findMessagesByChatRoom(chatRoom);

        if (messages.isEmpty()) return new ArrayList<>();

        // ✅ JSON 배열 파싱하여 반환
        try {
            return objectMapper.readValue(messages.get(0).getContent(), new TypeReference<List<MessageResponseDTO>>() {
            });
        } catch (Exception e) {
            System.out.println("❌ [Spring Boot] 메시지 변환 실패: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // ✅ 안 읽은 메시지 조회 (isRead=false)
    @Override
    public Map<Long, Integer> getUnreadMessages(Long userId) {
        System.out.println("📩 [Spring Boot] 안 읽은 메시지 개수 조회: userId=" + userId);

        List<Message> allMessages = messageRepository.findUnreadMessagesByReceiver(userId);
        Map<Long, Integer> unreadCounts = new HashMap<>();

        for (Message message : allMessages) {
            try {
                System.out.println("📌 [DEBUG] 원본 메시지 JSON: " + message.getContent());

                List<MessageResponseDTO> messageList = objectMapper.readValue(
                        message.getContent(), new TypeReference<List<MessageResponseDTO>>() {
                        }
                );

                // ✅ receiverId를 `userId`와 정확히 비교하도록 `intValue()` 변환 적용
                long unreadCount = messageList.stream()
                        .filter(msg -> Objects.equals(msg.getReceiverId(), userId.intValue()) && !msg.isRead())  // ✅ 타입 변환 적용
                        .count();

                Long chatRoomId = (message.getChatRoom() != null) ? message.getChatRoom().getId() : null;
                System.out.println("📌 [DEBUG] 채팅방 ID: " + chatRoomId + ", 안 읽은 메시지 개수: " + unreadCount);

                if (unreadCount > 0 && chatRoomId != null) {
                    unreadCounts.merge(chatRoomId, (int) unreadCount, Integer::sum);
                }

            } catch (Exception e) {
                System.out.println("❌ [Spring Boot] 메시지 JSON 파싱 실패: " + e.getMessage());
            }
        }

        System.out.println("📩 [Spring Boot] 안 읽은 메시지 개수 (채팅방별): " + unreadCounts);
        return unreadCounts;
    }

    @Transactional
    @Override
    public void markMessagesAsRead(Long userId, Long chatRoomId) {
        System.out.println("✅ [Spring Boot] 메시지 읽음 처리 요청: userId=" + userId + ", chatRoomId=" + chatRoomId);

        // ✅ Step 1: DB의 `is_read=false` 값을 `true`로 변경
        int updatedRows = messageRepository.markMessagesAsReadForReceiver(userId, chatRoomId);
        System.out.println("✅ 업데이트된 메시지 개수: " + updatedRows);

        if (updatedRows == 0) {
            System.out.println("⚠️ [Spring Boot] 업데이트된 메시지가 없습니다. (이미 읽었거나 메시지 없음)");
            return;
        }

        // ✅ Step 2: 채팅방의 모든 메시지 가져오기
        List<Message> messages = messageRepository.findMessagesByChatRoomId(chatRoomId);
        boolean isUpdated = false;

        for (Message message : messages) {
            try {
                List<MessageResponseDTO> messageList = objectMapper.readValue(
                        message.getContent(), new TypeReference<List<MessageResponseDTO>>() {
                        }
                );

                // ✅ JSON 내부의 `read=false` 메시지를 `read=true`로 변경
                for (MessageResponseDTO msg : messageList) {
                    if (Objects.equals(msg.getReceiverId(), userId.intValue()) && !msg.isRead()) {
                        msg.setRead(true);
                        isUpdated = true;
                    }
                }

                if (isUpdated) {
                    // ✅ 업데이트된 JSON을 다시 저장
                    String updatedJson = objectMapper.writeValueAsString(messageList);
                    message.setContent(updatedJson);
                    message.setRead(true);  // ✅ DB 컬럼도 `is_read=true`로 변경
                    System.out.println("📌 [DEBUG] 업데이트된 메시지 JSON: " + updatedJson);
                }

            } catch (Exception e) {
                System.out.println("❌ [Spring Boot] 메시지 JSON 변환 실패: " + e.getMessage());
            }
        }

        // ✅ 변경된 JSON을 DB에 저장
        if (isUpdated) {
            messageRepository.saveAll(messages);
            System.out.println("✅ [Spring Boot] JSON 내부 메시지 읽음 처리 완료");
        }
    }
}