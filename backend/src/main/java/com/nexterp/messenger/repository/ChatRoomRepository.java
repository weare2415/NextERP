package com.nexterp.messenger.repository;

import com.nexterp.messenger.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // ✅ 두 사람의 채팅방 찾기
    @Query("SELECT c FROM ChatRoom c WHERE (c.senderId = :user1 AND c.receiverId = :user2) AND isActive = true OR (c.senderId = :user2 AND c.receiverId = :user1) AND isActive = true ")
    Optional<ChatRoom> findChatRoom(@Param("user1") Integer user1, @Param("user2") Integer user2);

    @Query("SELECT c FROM ChatRoom c WHERE c.isActive = true AND (c.senderId = :userId OR c.receiverId = :userId)")
    List<ChatRoom> findActiveChatRooms(@Param("userId") Integer userId);

    // ✅ 현재 활성화된(isActive = true) 채팅방만 가져오기
    List<ChatRoom> findByIsActiveTrue();

    // ✅ JPQL을 이용하여 isActive=true 필터 강제 적용
    @Query("SELECT c FROM ChatRoom c WHERE (c.senderId = :userId OR c.receiverId = :userId) AND c.isActive = true")
    List<ChatRoom> findActiveChatRoomsByUser(@Param("userId") Integer userId);

    // ✅ 기존 채팅방을 `isActive=false` 상태도 포함하여 검색 (JPQL 사용)
    @Query("SELECT c FROM ChatRoom c WHERE " +
            "(c.senderId = :senderId AND c.receiverId = :receiverId) " +
            "OR (c.senderId = :receiverId AND c.receiverId = :senderId)")
    Optional<ChatRoom> findAnyChatRoom(@Param("senderId") Integer senderId,
                                       @Param("receiverId") Integer receiverId);
}