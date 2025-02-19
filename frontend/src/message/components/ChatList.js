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
    setUnreadMessages((prev) => ({
      ...prev,
      [chatRoomId]: 0, // 클릭 시 즉시 읽음 처리
    }));

    try {
      await markMessagesAsRead(myUserId, chatRoomId);
      console.log(`✅ 채팅방 ${chatRoomId} 읽음 처리 완료`);

      // ✅ 채팅방 클릭 시 최신 메시지를 불러와서 업데이트
      const messages = await getMessages(chatRoomId);
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        setLastMessages((prev) => ({
          ...prev,
          [chatRoomId]: {
            content: lastMessage.content,
            timestamp: lastMessage.timestamp,
          },
        }));
      }
    } catch (error) {
      console.error("❌ 메시지 읽음 처리 오류:", error);
    }

    //  새 창에서 채팅방 열기
    window.open(
      `/message/chat/${chatRoomId}`,
      `ChatRoom_${chatRoomId}`,
      "width=380,height=600,resizable=no,scrollbars=no"
    );
  };

  //나기기 함수 추가
  const handleLeaveChatRoom = async (chatRoomId) => {
    try {
      await leaveChatRoom(chatRoomId);
      console.log(`✅ 채팅방 ${chatRoomId} 나가기 완료`);

      //  서버에서 isActive=false 처리되었으므로 목록을 새로 불러옴
      const updatedRooms = await getActiveChatRooms(myUserId);
      setRoomList(updatedRooms);
      setFilteredRooms(updatedRooms);

      //  채팅방 목록에서 제거 (함수 내부로 이동)
      setRoomList((prevRooms) =>
        prevRooms.filter((room) => room.id !== chatRoomId)
      );
      setFilteredRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== chatRoomId)
      );
    } catch (error) {
      console.error(`❌ 채팅방 나가기 실패 (chatRoomId: ${chatRoomId})`, error);
    }
  };

  const handleContextMenu = (event, chatRoomId) => {
    event.preventDefault();

    // 클릭한 위치 기준으로 메뉴 위치 계산
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      chatRoomId,
      xPos: rect.left + rect.width / 2, // 채팅방 아이템의 중앙에 위치
      yPos: rect.top + rect.height / 2,
    });
  };

  //  우클릭 메뉴 닫기
  const closeContextMenu = () => {
    setContextMenu(null);
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

    socket.off("message");

    socket.on("message", (newMessage) => {
      console.log("📩 [실시간 메시지 수신]:", newMessage);

      const rawTimestamp = newMessage.timestamp || new Date().toISOString();
      console.log("🕒 [변환된 timestamp]:", rawTimestamp);

      console.log(
        `📥 [메시지 수신] chatRoomId: ${newMessage.chatRoomId}, senderId: ${newMessage.senderId}, receiverId: ${newMessage.receiverId}`
      );

      //  마지막 메시지 업데이트 (본인 포함)
      setLastMessages((prev) => ({
        ...prev,
        [newMessage.chatRoomId]: {
          content: newMessage.messageText || newMessage.content,
          timestamp: rawTimestamp,
        },
      }));

      // 안 읽은 메시지 업데이트 (본인이 보낸 메시지는 카운트 증가 안 함)
      setUnreadMessages((prev) => ({
        ...prev,
        [newMessage.chatRoomId]:
          newMessage.senderId === myUserId
            ? 0
            : (prev[newMessage.chatRoomId] || 0) + 1,
      }));

      //  채팅방 목록 업데이트 (본인 메시지도 즉시 반영)
      setRoomList((prevRooms) => {
        console.log("📌 [이전 roomList]:", prevRooms);

        let updatedRooms = [...prevRooms];
        const targetRoomIndex = updatedRooms.findIndex(
          (room) => room.id === newMessage.chatRoomId
        );

        if (targetRoomIndex !== -1) {
          //  기존 채팅방을 맨 앞으로 이동하고 lastMessage 업데이트
          const targetRoom = updatedRooms.splice(targetRoomIndex, 1)[0];

          targetRoom.lastMessage = {
            content: newMessage.messageText || newMessage.content,
            timestamp: rawTimestamp,
          };

          updatedRooms.unshift(targetRoom);
        } else {
          // 새로운 채팅방이면 리스트에 추가
          if (
            newMessage.senderId === myUserId ||
            newMessage.receiverId === myUserId
          ) {
            updatedRooms.unshift({
              id: newMessage.chatRoomId,
              senderId: newMessage.senderId,
              receiverId: newMessage.receiverId,
              lastMessage: {
                content: newMessage.messageText || newMessage.content,
                timestamp: rawTimestamp,
              },
            });
          }
        }

        console.log("🔄 [내 채팅방 목록 업데이트 완료]:", updatedRooms);
        return updatedRooms;
      });

      // 본인의 메시지도 filteredRooms에 즉시 반영
      setFilteredRooms((prevRooms) => {
        console.log("📌 [이전 filteredRooms]:", prevRooms);

        let updatedRooms = [...prevRooms];
        const targetRoomIndex = updatedRooms.findIndex(
          (room) => room.id === newMessage.chatRoomId
        );

        if (targetRoomIndex !== -1) {
          const targetRoom = updatedRooms.splice(targetRoomIndex, 1)[0];

          targetRoom.lastMessage = {
            content: newMessage.messageText || newMessage.content,
            timestamp: rawTimestamp,
          };

          updatedRooms.unshift(targetRoom);
        } else {
          updatedRooms.unshift({
            id: newMessage.chatRoomId,
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            lastMessage: {
              content: newMessage.messageText || newMessage.content,
              timestamp: rawTimestamp,
            },
          });
        }

        console.log("📝 [filteredRooms에 내 메시지 즉시 반영]:", updatedRooms);
        return updatedRooms;
      });
    });

    return () => {
      console.log("❌ [WebSocket] 메시지 리스너 정리");
      socket.off("message");
    };
  }, [myUserId]);

  //  roomList도 의존성 배열에 추가하여 업데이트 유지

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
              onContextMenu={(e) => handleContextMenu(e, chat.id)} // ✅ 우클릭 추가
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
      {contextMenu && (
        <>
          <div className="context-menu-overlay" onClick={closeContextMenu} />
          <div className="context-menu-modal">
            <div className="modal-content">
              <ul>
                <li
                  className="leave-chat"
                  onClick={() => {
                    handleLeaveChatRoom(contextMenu.chatRoomId);
                    closeContextMenu();
                  }}
                >
                  채팅방 나가기
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

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
