package com.nexterp.messenger.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomRequestDTO {
    private Integer senderId;  // ✅ 보내는 사람 (사원 ID)
    private Integer receiverId;  // ✅ 받는 사람 (사원 ID)
}