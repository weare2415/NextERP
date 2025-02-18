package com.nexterp.messenger.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class MessageRequestDTO {
    private Long chatRoomId;  // 채팅방 ID
    private Integer senderId;  // 보내는 사람 ID
    private Integer receiverId;  // 받는 사람 ID
    private String messageText;  // 메시지 내용
}