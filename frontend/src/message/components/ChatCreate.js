import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createChatRoom } from "../api/chatApi";
import {
  getAllEmployees,
  getDepartments,
  getPositions,
} from "../../HR/employee/api/employeeApi";
import "../scss/ChatCreate.scss";

const ChatCreate = () => {
  const myUserId = useSelector((state) => state.loginSlice.id); // 👤 로그인한 사용자 ID (숫자)
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState({});
  const [positions, setPositions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let allEmployees = await getAllEmployees();

        console.log("🔍 전체 직원 목록:", allEmployees);
        console.log("👤 로그인한 사용자 ID (원본):", myUserId, typeof myUserId);

        // 🔥 ID 비교를 위해 모든 ID를 숫자로 변환
        const myUserIdNumber = Number(myUserId);
        const filteredList = allEmployees.filter(
          (emp) => Number(emp.id) !== myUserIdNumber
        );

        console.log("✅ 로그인한 사용자 제외된 직원 목록:", filteredList);

        const departmentData = await getDepartments();
        const positionData = await getPositions();

        // 부서 및 직급을 객체 형태로 변환 (id → 이름 매핑)
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

    fetchEmployees();
  }, [myUserId]);

  // 🔍 검색어 입력 시 필터링 기능
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
        navigate(`/message/chat/${newRoom.id}`);
      } else {
        alert("❌ 채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 오류:", error);
      alert("❌ 채팅방을 생성할 수 없습니다.");
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>새 채팅방 만들기</h2>
      <button onClick={() => setIsModalOpen(true)} className="create-chat-btn">
        채팅 상대 선택
      </button>
  
      {/* 모달 창 */}
      {isModalOpen && (
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="close-button"
            >
              닫기
            </button>
          </div>
        </div>
      )}
  
      {/* 모달 배경 (클릭하면 닫힘) */}
      {isModalOpen && <div className="modal-overlay" onClick={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ChatCreate;
