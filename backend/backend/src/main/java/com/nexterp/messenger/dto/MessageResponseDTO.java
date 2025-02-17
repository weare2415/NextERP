package com.nexterp.messenger.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long chatRoomId; // ✅ 채팅방 ID 추가
    private Integer senderId; // ✅ 보내는 사람 (사원 ID)
    private Integer receiverId; // ✅ 받는 사람 (사원 ID)
    private String content; // ✅ 메시지 내용 (JSON 대신 일반 텍스트로 수정)
    private boolean read;
    private LocalDateTime timestamp; // ✅ 메시지 보낸 시간
}