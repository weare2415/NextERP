package com.nexterp.messenger.repository;

import com.nexterp.messenger.entity.ChatRoom;
import com.nexterp.messenger.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // ✅ 특정 채팅방의 메시지 가져오기 (최신순 정렬)
    @Query("SELECT m FROM Message m WHERE m.chatRoom = :chatRoom ORDER BY m.timestamp ASC")
    List<Message> findMessagesByChatRoom(@Param("chatRoom") ChatRoom chatRoom);

    @Query("SELECT m.chatRoom.id, COUNT(m) FROM Message m " +
            "WHERE m.receiverId = :userId AND m.isRead = false " +
            "GROUP BY m.chatRoom.id")
    List<Object[]> countUnreadMessagesByUser(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE m.receiverId = :userId AND m.isRead = false")
    List<Message> findUnreadMessagesByReceiver(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.timestamp ASC")
    List<Message> findMessagesByChatRoomId(@Param("chatRoomId") Long chatRoomId);


    // ✅ 특정 채팅방 메시지 읽음 처리 (isRead=false → true 업데이트)
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiverId = :userId AND m.chatRoom.id = :chatRoomId AND m.isRead = false")
    int markMessagesAsReadForReceiver(@Param("userId") Long userId, @Param("chatRoomId") Long chatRoomId);

}