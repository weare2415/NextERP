import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages, getChatRoomById } from "../api/chatApi";
import {
  getAllEmployees,
  getDepartments,
} from "../../employee/api/employeeApi";

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

  useEffect(() => {
    if (chatRoomId && myUserId) {
      fetchChatRoomInfo();
      fetchMessages();
      fetchEmployeesAndDepartments();

      // ✅ WebSocket에 내 ID 등록
      socket.emit("register", { user_id: myUserId });
      console.log(`📡 WebSocket 등록 요청: ${myUserId}`);

      // ✅ 기존 리스너 제거 후 새로 등록 (중복 방지)
      socket.off("message");
      socket.on("message", (newMessage) => {
        console.log("📩 실시간 메시지 수신:", newMessage);

        // ✅ 내가 보낸 메시지는 중복 추가 방지
        if (newMessage.senderId !== myUserId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...newMessage,
              content: newMessage.messageText || newMessage.content, // ✅ undefined 방지
              timestamp: formatTime(newMessage.timestamp), // ✅ 시간 형식 변환
              showName: newMessage.senderId !== myUserId,
            },
          ]);
        }
      });

      return () => {
        socket.off("message"); // ✅ 클린업: 기존 리스너 해제
      };
    }
  }, [chatRoomId, myUserId]);

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

      // ✅ 메시지 통일 (messageText || content 사용)
      const updatedMessages = chatMessages.map((msg) => ({
        ...msg,
        content: msg.messageText || msg.content,
        timestamp: formatTime(msg.timestamp), // ✅ 시간 변환 추가
        showName: msg.senderId !== myUserId,
      }));

      setMessages(updatedMessages);
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

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentTimestamp = new Date().toISOString(); // ✅ 현재 시간을 ISO 포맷으로 저장

    const messageData = {
      chatRoomId,
      senderId: myUserId,
      receiverId,
      messageText: message.trim(),
      content: message.trim(), // ✅ React 내에서 통일된 필드 사용
      timestamp: currentTimestamp, // ✅ 시간 추가
      jwtToken,
    };

    console.log("📤 메시지 전송:", messageData);
    socket.emit("message", messageData);

    // ✅ 여기서만 내 메시지를 추가 (WebSocket 중복 방지)
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `temp-${Date.now()}`, // ✅ 임시 ID 추가하여 중복 방지
        senderId: myUserId,
        receiverId,
        content: message.trim(),
        timestamp: formatTime(currentTimestamp), // ✅ 로컬에서 표시할 시간 변환
        showName: false, // ✅ 내 메시지는 이름 표시 ❌
      },
    ]);

    setMessage("");
  };

  // ✅ ISO 시간을 HH:mm 형식으로 변환하는 함수
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div>
      <h2>채팅방 {chatRoomId}</h2>
      <div>
        {messages.map((msg, index) => {
          const isMyMessage = msg.senderId === myUserId;
          const prevMsg = messages[index - 1];

          // ✅ 상대방 메시지일 때만 이름을 표시 (내 메시지는 절대 이름 ❌)
          const showName =
            !isMyMessage &&
            (!prevMsg || prevMsg.senderId !== msg.senderId) &&
            msg.content; // 내용이 있는 경우에만 표시

          return (
            <div key={index} style={{ marginBottom: "10px" }}>
              {/* 🔹 상대방 메시지일 때만 이름 표시 (내 메시지는 절대 표시 안 됨) */}
              {!isMyMessage && showName && employees[msg.senderId] && (
                <p style={{ fontSize: "12px", color: "#555" }}>
                  {employees[msg.senderId]?.name} (
                  {departments[employees[msg.senderId]?.departmentId] ||
                    "부서 없음"}
                  )
                </p>
              )}

              {/* 🔹 메시지 내용 표시 */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "16px", margin: "0px" }}>
                  {isMyMessage ? `[내 메시지] ${msg.content}` : msg.content}
                </p>
                {/* ✅ 시간 표시 추가 */}
                <span
                  style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div>
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
