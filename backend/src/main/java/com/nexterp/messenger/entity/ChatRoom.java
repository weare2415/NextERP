package com.nexterp.messenger.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 채팅방 ID

    @Column(nullable = false)
    private Integer senderId;  // ✅ 보내는 사람 (사원 ID)

    @Column(nullable = false)
    private Integer receiverId;  // ✅ 받는 사람 (사원 ID)

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  // 채팅방 생성 시간

    @Column(nullable = false)
    private Boolean isActive = true;  // ✅ 채팅방 활성화 여부 (true: 사용 중, false: 나간 상태)
}