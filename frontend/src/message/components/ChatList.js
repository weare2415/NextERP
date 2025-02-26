import React, { useEffect, useState } from "react";
import "../scss/ChatList.scss";
import { useSelector } from "react-redux";
import {
  getActiveChatRooms,
  getUnreadMessages,
  markMessagesAsRead,
  getMessages,
  leaveChatRoom,
} from "../api/chatApi";
import {
  getMessengerEmployees,
  getDepartments,
} from "../../HR/employee/api/employeeApi";
import ChatSearch from "./ChatSearch";
import { useNavigate } from "react-router-dom";
import ChatCreate from "./ChatCreate"; // ✅ ChatCreate 컴포넌트 import

import io from "socket.io-client";

//  WebSocket 서버 연결
const socket = io("http://localhost:5000");

const ChatList = () => {
  const myUserId = useSelector((state) => state.loginSlice.id);
  const [roomList, setRoomList] = useState([]);
  const [employees, setEmployees] = useState({});
  const [departments, setDepartments] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [leftRooms, setLeftRooms] = useState([]);
  
  //  검색어 변경 시 필터링
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRooms(roomList);
    } else {
      const filtered = roomList.filter(
        (chat) =>
          Number(chat.senderId) === Number(searchTerm) ||
          Number(chat.receiverId) === Number(searchTerm)
      );
      setFilteredRooms(filtered);
    }
  }, [searchTerm, roomList]);

   // 채팅방 클릭 시 메시지 읽음 처리 및 이동
   const handleChatRoomClick = async (chatRoomId) => {
    console.log("📩 채팅방 클릭 시 읽음 처리 준비:", chatRoomId);
    
    const currentUnreadCount = unreadMessages[chatRoomId] || 0;
    console.log("현재 읽지 않은 메시지 수:", currentUnreadCount);

    try {
        console.log("📩 메시지 읽음 처리 준비:", {
            userId: myUserId,
            chatRoomId: chatRoomId,
            count: currentUnreadCount
        });

        // ✅ WebSocket을 통해 읽음 처리 이벤트 전송
        console.log("📡 WebSocket으로 messagesRead 이벤트 전송...");
        socket.emit("messagesRead", {
            userId: myUserId,
            chatRoomId: chatRoomId,
            count: currentUnreadCount
        });
        console.log("✅ WebSocket messagesRead 이벤트 전송 완료!");

        // ✅ API 호출하여 메시지 읽음 처리
        await markMessagesAsRead(myUserId, chatRoomId);
        console.log(`✅ 채팅방 ${chatRoomId} 읽음 처리 완료`);

        setUnreadMessages((prev) => {
            const updated = { ...prev };
            updated[chatRoomId] = 0;
            console.log("📩 채팅방 읽음 처리 후 updatedUnreadMessages:", updated);
            return updated;
        });

        // ✅ `updateUnreadMessages` 이벤트를 즉시 실행하여 BasicLayout.js에서 반영되도록 함
        console.log("📡 WebSocket으로 updateUnreadMessages 이벤트 전송...");
        socket.emit("updateUnreadMessages");
        console.log("✅ WebSocket updateUnreadMessages 이벤트 전송 완료!");

        // 채팅방 열기
        window.open(
            `/message/chat/${chatRoomId}`,
            `ChatRoom_${chatRoomId}`,
            "width=380,height=600,resizable=no,scrollbars=no"
        );

    } catch (error) {
        console.error("❌ 메시지 읽음 처리 오류:", error);
    }
};

   // 채팅방 목록, 직원, 부서 정보 불러오기
   useEffect(() => {
    const fetchData = async () => {
      if (!myUserId) return;

      try {
        const [rooms, unreadCounts, allEmployees, departmentData] =
          await Promise.all([
            getActiveChatRooms(myUserId),
            getUnreadMessages(myUserId),
            getMessengerEmployees(),
            getDepartments(),
          ]);

        console.log("📌 채팅방 목록:", rooms);
        console.log("📩 안 읽은 메시지 개수:", unreadCounts);

        const activeRooms = rooms.filter(room => room.isActive === true);

        setRoomList(activeRooms);
        setFilteredRooms(activeRooms);

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
        setUnreadMessages(unreadCounts);

        const filteredRooms = rooms.filter(
          (room) =>
            Number(room.senderId) === Number(myUserId) ||
            Number(room.receiverId) === Number(myUserId)
        );

        setRoomList(filteredRooms);
        setFilteredRooms(filteredRooms);

        const lastMessageMap = {};
        for (const room of filteredRooms) {
          const messages = await getMessages(room.id);
          lastMessageMap[room.id] =
            messages.length > 0
              ? {
                  content: messages[messages.length - 1].content,
                  timestamp: messages[messages.length - 1].timestamp,
                }
              : { content: "대화 없음", timestamp: "" };
        }
        setLastMessages(lastMessageMap);
      } catch (error) {
        console.error("❌ 데이터 불러오기 오류:", error);
      }
    };

    fetchData();
  }, [myUserId]);

  const handleChatRoomCreated = (newChatRoom) => {
    setRoomList((prevRooms) => {
      //  이미 존재하는 채팅방인지 확인 후 추가
      if (!prevRooms.some((room) => room.id === newChatRoom.id)) {
        return [newChatRoom, ...prevRooms];
      }
      return prevRooms;
    });

    setFilteredRooms((prevRooms) => {
      if (!prevRooms.some((room) => room.id === newChatRoom.id)) {
        return [newChatRoom, ...prevRooms];
      }
      return prevRooms;
    });
  };

  useEffect(() => {
    if (!myUserId) return;

    socket.emit("register", { user_id: myUserId });

    // 메시지 읽음 처리 이벤트 리스너 등록
    const handleMessagesRead = (data) => {
      console.log("👀 [메시지 읽음 처리]:", data);
      // 데이터 확인 및 상태 업데이트
      if (data && data.userId && data.chatRoomId) {
          setUnreadMessages((prev) => {
              const newUnreadMessages = { ...prev };
              newUnreadMessages[data.chatRoomId] = 0;  // 읽음 처리된 메시지 수 0으로 업데이트
              return newUnreadMessages;
          });
      }
    };

    // 실시간 메시지 이벤트 리스너 등록
    const handleNewMessage = (newMessage) => {
      console.log("📩 [실시간 메시지 수신]:", newMessage);
      // 새 메시지 상태 업데이트
      setLastMessages(prev => ({
          ...prev,
          [newMessage.chatRoomId]: {
              content: newMessage.messageText || newMessage.content,
              timestamp: newMessage.timestamp,
          }
      }));

      // 안 읽은 메시지 수 업데이트
      setUnreadMessages(prev => ({
          ...prev,
          [newMessage.chatRoomId]: newMessage.senderId === myUserId ? 0 : (prev[newMessage.chatRoomId] || 0) + 1
      }));
  };

    // 채팅방 나가기 이벤트 리스너 추가
  const handleChatLeft = (data) => {
    console.log("👋 [채팅방 나가기 감지]:", data);
    if (!data || !data.chatRoomId) {
      console.error("❌ 유효하지 않은 채팅방 나가기 데이터:", data);
      return;
    }
    
    setRoomList(prevRooms => {
      console.log("현재 채팅방 목록:", prevRooms);
      const filteredRooms = prevRooms.filter(room => String(room.id) !== String(data.chatRoomId));
      console.log("필터링 후 채팅방 목록:", filteredRooms);
      return filteredRooms;
    });

    setFilteredRooms(prevRooms => {
      const filteredRooms = prevRooms.filter(room => String(room.id) !== String(data.chatRoomId));
      return filteredRooms;
    });
    
    setLastMessages(prev => {
      const updated = { ...prev };
      delete updated[data.chatRoomId];
      return updated;
    });
    
    setUnreadMessages(prev => {
      const updated = { ...prev };
      delete updated[data.chatRoomId];
      return updated;
    });
  };

  // 소켓 이벤트 리스너 등록
  socket.on("messagesRead", handleMessagesRead);
  socket.on("message", handleNewMessage);
  socket.on("chat_left", handleChatLeft);

  // 클린업 함수
  return () => {
      socket.off("messagesRead", handleMessagesRead);
      socket.off("message", handleNewMessage);
      socket.off("chat_left", handleChatLeft);
  };
}, [myUserId]);


  //  UI에서 timestamp 변환 함수
  const formatDate = (timestamp) => {
    if (!timestamp) return "시간 없음";

    console.log("🔍 [formatDate 호출]:", timestamp);

    const parsedDate = new Date(Date.parse(timestamp));

    if (isNaN(parsedDate.getTime())) {
      console.log("❌ [formatDate 변환 실패]:", timestamp);
      return "시간 없음";
    }

    console.log("✅ [formatDate 변환 완료]:", parsedDate.toISOString());

    const period = parsedDate.getHours() < 12 ? "오전" : "오후";
    return `${
      parsedDate.getMonth() + 1
    }월 ${parsedDate.getDate()}일 ${period} ${
      parsedDate.getHours() % 12 || 12
    }:${String(parsedDate.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="chat-messenger-container">
      <h2>내 채팅방 목록</h2>
      <div className="chat-search">
        <ChatSearch onSearch={setSearchTerm} />
      </div>

      <ul id="chat-list-container">
        {filteredRooms.map((chat) => {
          const uniqueKey = `chat-room-${chat.id}`; 
          const otherUserId =
            Number(chat.senderId) === Number(myUserId)
              ? Number(chat.receiverId)
              : Number(chat.senderId);
          const user = employees[otherUserId];
          const lastMessage = lastMessages[chat.id] || {
            content: "대화 없음",
            timestamp: "",
          };

          return (
            <li
              key={chat.id}
              onDoubleClick={() => handleChatRoomClick(chat.id)}
            >
              <div className="chat-item">
                <div className="chat-content">
                  <div className="chat-name">
                    {user
                      ? `${user.name} (${user.departmentName})`
                      : "불러오는 중..."}
                  </div>

                  <div className="chat-preview">
                    <span className="message">{lastMessage.content}</span>
                    <span className="timestamp">
                      {formatDate(lastMessage.timestamp)}
                    </span>
                    {unreadMessages[chat.id] > 0 && (
                      <span className="unread-badge">
                        {unreadMessages[chat.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {/* 컨텍스트 메뉴를 모달 스타일로 변경 */}
      <button
        className="new-chat-button"
        onClick={() => setIsCreateModalOpen(true)}
      >
        +
      </button>

      <ChatCreate
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)} //  여기서 onClose가 함수인지 확인!
        onChatRoomCreated={handleChatRoomCreated}
      />
    </div>
  );
};

export default ChatList;
