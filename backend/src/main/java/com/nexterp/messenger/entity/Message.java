package com.nexterp.messenger.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 메시지 ID

    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;  // ✅ 채팅방과 연결

    @Column(nullable = false)
    private Integer senderId;  // ✅ 보내는 사람 (사원 ID)

    @Column(nullable = false)
    private Integer receiverId;  // ✅ 받는 사람 (사원 ID)

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;  // ✅ 메시지 내용 (JSON 형식 제거, 단일 텍스트)

    @Column(nullable = false)
    private boolean isRead = false;  // ✅ 읽음 여부 추가

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;  // ✅ 메시지 생성 시간
}