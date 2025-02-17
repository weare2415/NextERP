import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages, getChatRoomById, sendMessage } from "../api/chatApi";
import {
  getAllEmployees,
  getDepartments,
} from "../../HR/employee/api/employeeApi";
import "../scss/ChatRoom.scss";

// WebSocket 서버와 연결
const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const myUserId = useSelector((state) => state.loginSlice.id);
  const jwtToken = useSelector((state) => state.loginSlice.accessToken);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [employees, setEmployees] = useState({});
  const [departments, setDepartments] = useState({});

  // ✅ 스크롤을 위한 ref 생성
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatRoomId && myUserId) {
      fetchChatRoomInfo();
      fetchMessages();
      fetchEmployeesAndDepartments();

      socket.emit("register", { user_id: myUserId });
      console.log(`📡 WebSocket 등록 요청: ${myUserId}`);

      socket.on("connect", () => {
        console.log("✅ WebSocket 연결됨!");
      });

      socket.off("message");
      socket.on("message", (newMessage) => {
        console.log("📩 실시간 메시지 수신:", newMessage);

        setMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              ...newMessage,
              content: newMessage.messageText || newMessage.content,
              timestamp: formatTime(newMessage.timestamp),
              isMyMessage: newMessage.senderId === myUserId,
              showName:
                newMessage.senderId !== myUserId &&
                (prevMessages.length === 0 ||
                  prevMessages[prevMessages.length - 1].senderId !==
                    newMessage.senderId),
            },
          ];

          return updatedMessages;
        });

        scrollToBottom(); // ✅ 새 메시지 수신 시 자동 스크롤
      });

      return () => {
        socket.off("message");
      };
    }
  }, [chatRoomId, myUserId]);

  // ✅ 팝업 창 닫기 버튼 추가
  const handleClose = () => {
    window.close();
  };

  const fetchChatRoomInfo = async () => {
    try {
      const chatRoom = await getChatRoomById(chatRoomId);
      if (chatRoom) {
        let extractedReceiverId =
          chatRoom.senderId === Number(myUserId)
            ? chatRoom.receiverId
            : chatRoom.senderId;

        setReceiverId(extractedReceiverId);
      }
    } catch (error) {
      console.error("❌ 채팅방 정보 가져오기 오류:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const chatMessages = await getMessages(chatRoomId);

      // ✅ 내가 나간 채팅방인지 확인
      const leftChatRooms =
        JSON.parse(localStorage.getItem(`leftChatRooms_${myUserId}`)) || [];

      const updatedMessages = chatMessages.map((msg, index) => {
        const isMyMessage = Number(msg.senderId) === Number(myUserId);

        return {
          ...msg,
          content: msg.messageText || msg.content,
          timestamp: formatTime(msg.timestamp),
          isMyMessage,
          showName:
            !isMyMessage &&
            (index === 0 || chatMessages[index - 1].senderId !== msg.senderId),
        };
      });

      // ✅ 내가 나간 채팅방이라면 기존 메시지 제거
      if (leftChatRooms.includes(chatRoomId)) {
        updatedMessages = []; // 기존 메시지 초기화
      }

      console.log("📩 가져온 메시지:", updatedMessages);
      setMessages(updatedMessages);

      setTimeout(() => {
        scrollToBottom(); // ✅ 기존 메시지 불러올 때도 스크롤
      }, 100);
    } catch (error) {
      console.error("❌ 메시지 불러오기 오류:", error);
    }
  };

  const fetchEmployeesAndDepartments = async () => {
    try {
      const allEmployees = await getAllEmployees();
      const departmentData = await getDepartments();

      const employeeMap = {};
      allEmployees.forEach((emp) => {
        employeeMap[emp.id] = {
          name: emp.name,
          departmentId: emp.departmentId,
        };
      });

      const departmentMap = {};
      departmentData.forEach((dept) => {
        departmentMap[dept.id] = dept.name;
      });

      setEmployees(employeeMap);
      setDepartments(departmentMap);
    } catch (error) {
      console.error("❌ 직원 정보 불러오기 오류:", error);
    }
  };

  // ✅ 메시지 전송 함수
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const currentTimestamp = new Date().toISOString();
    const formattedTimestamp = formatTime(currentTimestamp);

    const messageData = {
      chatRoomId,
      senderId: myUserId,
      receiverId,
      messageText: message.trim(),
      content: message.trim(),
      timestamp: currentTimestamp,
      jwtToken,
    };

    console.log("📤 메시지 전송:", messageData);

    socket.emit("message", messageData);

    const savedMessage = await sendMessage(
      chatRoomId,
      myUserId,
      receiverId,
      message.trim()
    );

    if (savedMessage) {
      console.log("✅ 메시지 저장 완료:", savedMessage);
    } else {
      console.error("❌ 메시지 저장 실패");
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `temp-${Date.now()}`,
        senderId: myUserId,
        receiverId,
        content: message.trim(),
        timestamp: formattedTimestamp,
        isMyMessage: true,
        showName: false,
      },
    ]);

    setMessage("");
    setTimeout(() => {
      scrollToBottom(); // ✅ 메시지 전송 후 자동 스크롤
    }, 100);
  };

  // ✅ 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <h2>채팅방 {chatRoomId}</h2>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => {
          const isMyMessage = msg.isMyMessage;

          return (
            <div
              key={index}
              className={`message-group ${isMyMessage ? "sent" : "received"}`}
            >
              {!isMyMessage && msg.showName && employees[msg.senderId] && (
                <div className="sender-info">
                  {employees[msg.senderId]?.name}
                  <span>
                    {departments[employees[msg.senderId]?.departmentId] ||
                      "부서 없음"}
                  </span>
                </div>
              )}

              <div className="message-bubble">
                {msg.content}
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {/* ✅ 이 부분이 마지막 메시지 아래로 자동 스크롤하는 역할 */}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
