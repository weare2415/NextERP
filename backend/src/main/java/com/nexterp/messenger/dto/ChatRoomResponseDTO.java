package com.nexterp.messenger.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponseDTO {
    private Long id;
    private Integer senderId;
    private Integer receiverId;
    private LocalDateTime createdAt;
    private Boolean isActive;
}