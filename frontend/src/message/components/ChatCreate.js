import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createChatRoom } from "../api/chatApi";
import {
  getAllEmployees,
  getDepartments,
  getPositions,
} from "../../HR/employee/api/employeeApi";
import "../scss/ChatCreate.scss";

const ChatCreate = ({ isOpen, onClose, onChatRoomCreated }) => {
  const myUserId = useSelector((state) => state.loginSlice.id);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState({});
  const [positions, setPositions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let allEmployees = await getAllEmployees();
        const myUserIdNumber = Number(myUserId);
        const filteredList = allEmployees.filter(
          (emp) => Number(emp.id) !== myUserIdNumber
        );

        const departmentData = await getDepartments();
        const positionData = await getPositions();

        const departmentMap = {};
        departmentData.forEach((dept) => {
          departmentMap[dept.id] = dept.name;
        });

        const positionMap = {};
        positionData.forEach((pos) => {
          positionMap[pos.id] = pos.name;
        });

        setEmployees(filteredList);
        setFilteredEmployees(filteredList);
        setDepartments(departmentMap);
        setPositions(positionMap);
      } catch (error) {
        console.error("❌ 직원 목록 불러오기 오류:", error);
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [myUserId, isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const filteredList = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredEmployees(filteredList);
  }, [searchQuery, employees]);

  const handleCreateChatRoom = async (receiverId) => {
    try {
      const newRoom = await createChatRoom(myUserId, receiverId);
      if (newRoom && newRoom.id) {
        alert("✅ 채팅방이 생성되었습니다.");

        // ✅ 채팅방 생성 후 `ChatList`에 반영
        if (onChatRoomCreated) {
          onChatRoomCreated(newRoom); // ✅ 새 채팅방을 `ChatList`에 전달
        }

        window.open(
          `/message/chat/${newRoom.id}`,
          `ChatRoom_${newRoom.id}`,
          "width=380,height=600,resizable=no,scrollbars=no"
        );
      } else {
        alert("❌ 채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 오류:", error);
      alert("❌ 채팅방을 생성할 수 없습니다.");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="chat-create-modal">
        <div className="modal-content">
          <h3>채팅 상대 검색</h3>
          <input
            type="text"
            placeholder="직원 이름 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <ul className="employee-list">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <li
                  key={emp.id}
                  onClick={() => handleCreateChatRoom(emp.id)}
                  className="employee-item"
                >
                  <strong>{emp.name}</strong> ({departments[emp.departmentId]} /{" "}
                  {positions[emp.positionId]})
                </li>
              ))
            ) : (
              <li className="no-results">검색 결과 없음</li>
            )}
          </ul>
          <button onClick={onClose} className="close-button">
            닫기
          </button>
        </div>
      </div>
      <div className="modal-overlay" onClick={onClose} />
    </>
  );
};

export default ChatCreate;
