import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRoomList } from "../api/chatApi";
import {
  getAllEmployees,
  getDepartments,
} from "../../employee/api/employeeApi";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const myUserId = useSelector((state) => state.loginSlice.id); // 로그인된 사용자 ID
  const [roomList, setRoomList] = useState([]); // 채팅방 목록 상태
  const [employees, setEmployees] = useState({}); // 직원 정보
  const [departments, setDepartments] = useState({}); // 부서 정보
  const navigate = useNavigate();

  useEffect(() => {
    // 직원 정보 및 부서 정보 가져오기
    const fetchEmployees = async () => {
      try {
        const allEmployees = await getAllEmployees();
        const departmentData = await getDepartments();

        // 직원 정보 맵핑 (ID → 이름 및 부서 매핑)
        const employeeMap = {};
        allEmployees.forEach((emp) => {
          employeeMap[emp.id] = {
            name: emp.name,
            departmentId: emp.departmentId,
          };
        });

        // 부서 정보 맵핑
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

    // 채팅방 목록 가져오기
    const fetchRooms = async () => {
      if (myUserId) {
        try {
          const rooms = await getRoomList(myUserId); // 전체 채팅방 목록을 가져옴
          console.log("📌 가져온 채팅방 목록:", rooms);

          // ✅ 로그인한 사용자가 참여한 채팅방만 필터링
          const filteredRooms = rooms.filter(
            (room) =>
              Number(room.senderId) === Number(myUserId) ||
              Number(room.receiverId) === Number(myUserId)
          );

          setRoomList(filteredRooms); // 채팅방 목록 상태 업데이트
        } catch (error) {
          console.error("❌ 채팅방 목록 불러오기 오류:", error);
        }
      }
    };

    fetchEmployees();
    fetchRooms();
  }, [myUserId]);

  return (
    <div>
      <h2>내 채팅방 목록</h2>
      <button onClick={() => navigate("/message/create")}>
        새 채팅방 만들기
      </button>

      <ul>
        {roomList.map((chat) => {
          // ✅ 로그인한 사용자를 제외한 상대방 ID 찾기
          const otherUserId =
            Number(chat.senderId) === Number(myUserId)
              ? Number(chat.receiverId)
              : Number(chat.senderId);

          // 상대방의 정보 가져오기
          const user = employees[otherUserId];

          return (
            <li
              key={chat.id}
              onDoubleClick={() => navigate(`/message/chat/${chat.id}`)}
            >
              {user ? (
                <div>
                  <span>
                    대화 상대: {user.name} ({departments[user.departmentId]})
                  </span>
                </div>
              ) : (
                <span>불러오는 중...</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
