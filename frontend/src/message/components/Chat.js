import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5000"); // Flask WebSocket 서버

const Chat = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  // Redux에서 로그인한 사용자 ID 가져오기
  const myUserId = useSelector((state) => state.loginSlice.id);

  useEffect(() => {
    if (myUserId) {
      socket.emit("register", { user_id: myUserId });
    }

    socket.on("chatroom_created", (data) => {
      console.log("✅ 채팅방 생성됨:", data);
      setChatRoomId(data.chatRoomId);
    });

    socket.on("message", (data) => {
      console.log("📩 수신한 메시지:", data);
      setMessages((prev) => [...prev, data]); // ✅ 여기에서만 메시지 추가
    });

    return () => {
      socket.disconnect();
    };
  }, [myUserId]);

  const createChatRoom = () => {
    if (!myUserId || !receiverId) {
      alert("상대방 사원 ID를 입력하세요.");
      return;
    }

    socket.emit("create_chatroom", {
      user1_id: myUserId,
      user2_id: parseInt(receiverId),
    });
  };

  const sendMessage = () => {
    if (!chatRoomId || !message.trim() || !myUserId) {
      alert("채팅방 ID, 사용자 ID 또는 메시지가 비어 있습니다.");
      return;
    }

    const messageData = {
      chatRoomId: chatRoomId,
      senderId: myUserId,
      messageText: message, // ✅ 서버가 기대하는 필드명 확인!
    };

    console.log("📤 전송되는 메시지 데이터:", messageData);

    socket.emit("message", messageData);
    setMessage(""); // ✅ 메시지 입력 필드 초기화 (메시지 추가 X)
  };

  return (
    <div>
      <h2>1:1 채팅</h2>
      <input
        type="text"
        placeholder="받는 사람 사원 ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <button onClick={createChatRoom}>채팅방 생성</button>

      {chatRoomId && <p>채팅방 ID: {chatRoomId}</p>}

      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId}: </strong>
            {msg.messageText}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지 입력"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default Chat;
