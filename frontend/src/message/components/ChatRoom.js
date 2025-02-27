import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMessages, getChatRoomById, sendMessage, leaveChatRoom } from "../api/chatApi";
import {
  getMessengerEmployees,
  getDepartments,
} from "../../HR/employee/api/employeeApi";
import "../scss/ChatRoom.scss";
import { IoLogOutOutline } from "react-icons/io5";

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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leftRooms, setLeftRooms] = useState([]);

  //  스크롤을 위한 ref 생성
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = (e) => {
      // localStorage의 leftChatRooms 값이 변경되었을 때만 반응
      if (e.key === `leftChatRooms_${myUserId}`) {
        const updatedLeftRooms = JSON.parse(e.newValue) || [];
        setLeftRooms(updatedLeftRooms);  // 업데이트된 채팅방 목록 상태 변경
      }
    };
  
    // storage 이벤트 리스너 추가
    window.addEventListener('storage', handleStorageChange);
  
    // cleanup: 컴포넌트가 언마운트 될 때 리스너 제거
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [myUserId]); // myUserId가 변경될 때마다 이벤트 리스너를 새로 등록
  
  // 채팅방 나가기 처리 함수
  const handleLeaveChatRoom = async () => {
    try {
      console.log(`🚀 채팅방 나가기 시작 - chatRoomId: ${chatRoomId}`);
      
      await leaveChatRoom(chatRoomId);
      console.log(`✅ 채팅방 나가기 완료: chatRoomId: ${chatRoomId}`);

      // 채팅방 나가기 이벤트 발생
      socket.emit("chat_left", {
        chatRoomId,
        userId: myUserId
      });

      window.close(); 
    } catch (error) {
      console.error(`❌ 채팅방 나가기 실패 (chatRoomId: ${chatRoomId})`, error);
    }
  };

  // ChatRoom.js에서 이벤트 발생 시 데이터도 로깅
  const eventData = {
    chatRoomId,
    userId: myUserId
  };
  console.log('📤 발신할 데이터:', eventData);
  socket.emit("leave_chat", eventData);

  useEffect(() => {
    console.log('chatroom에서 사용하는 소켓 인스턴스 : ', socket);
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

          console.log("업데이트된 메시지: ", updatedMessages);
          return updatedMessages;
        });

        scrollToBottom(); //  새 메시지 수신 시 자동 스크롤
      });

      return () => {
        socket.off("message");
      };
    }
  }, [chatRoomId, myUserId]);

  //  팝업 창 닫기 버튼 추가
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

      //  내가 나간 채팅방인지 확인
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

      console.log("📩 가져온 메시지:", updatedMessages);
      setMessages(updatedMessages);

      setTimeout(() => {
        scrollToBottom(); //  기존 메시지 불러올 때도 스크롤
      }, 100);
    } catch (error) {
      console.error("❌ 메시지 불러오기 오류:", error);
    }
  };

  const fetchEmployeesAndDepartments = async () => {
    try {
      const allEmployees = await getMessengerEmployees();
      const departmentData = await getDepartments();

      const employeeMap = {};
      allEmployees.forEach((emp) => {
        employeeMap[emp.id] = {
          name: emp.name,
          departmentName: emp.departmentName || "부서 없음", //  부서명 직접 저장
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

  //  메시지 전송 함수
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
      scrollToBottom(); //  메시지 전송 후 자동 스크롤
    }, 100);
  };

  //  스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  };

  //  엔터 키로 메시지 전송 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();  // 엔터로 줄바꿈 방지
      handleSendMessage();
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
        <button className="leave-button" onClick={() => setShowLeaveModal(true)}>
          <IoLogOutOutline size={20} />
        </button>
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
                    {employees[msg.senderId]?.departmentName || "부서 없음"}
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

        {/*  이 부분이 마지막 메시지 아래로 자동 스크롤하는 역할 */}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
      {/* 나가기 모달 */}
      {showLeaveModal && (
        <>
          <div className="context-menu-overlay" onClick={() => setShowLeaveModal(false)} />
          <div className="context-menu-modal">
            <div className="modal-content">
              <ul>
                <li
                  className="leave-chat"
                  onClick={handleLeaveChatRoom}
                >
                  채팅방 나가기
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
