import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createChatRoom } from "../api/chatApi";
import {
  getMessengerEmployees, // 메신저용
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

  //  선택한 상대방 정보 저장 (확인 버튼을 누른 후 생성되도록 함)
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(""); // 모달 열릴 때 검색어 초기화
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        //  PENDING 제외된 직원 목록 가져오기
        let allEmployees = await getMessengerEmployees();

        console.log("📌 메신저용 직원 목록 (PENDING 제외됨):", allEmployees);

        const myUserIdNumber = Number(myUserId);

        const departmentData = await getDepartments();
        const positionData = await getPositions();

        //  부서 ID -> 부서 이름 매핑
        const departmentMap = {};
        departmentData.forEach((dept) => {
          departmentMap[dept.id] = dept.name;
        });

        //  직급 ID -> 직급 이름 매핑
        const positionMap = {};
        positionData.forEach((pos) => {
          positionMap[pos.id] = pos.name;
        });

        //  필터링 및 부서/직급 정보 추가
        const filteredList = allEmployees
          .filter((emp) => Number(emp.id) !== myUserIdNumber)
          .map((emp) => ({
            ...emp,
            departmentName: emp.departmentName || "부서 없음", //  departmentName 직접 사용
          }));

        console.log("📌 최종 변환된 직원 목록:", filteredList);

        console.log("📌 최종 변환된 직원 목록:", filteredList);

        setEmployees(filteredList);
        setFilteredEmployees(filteredList);
        setDepartments(departmentMap);
        setPositions(positionMap);
      } catch (error) {
        console.error("❌ 메신저 직원 목록 불러오기 오류:", error);
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

  //  사용자가 상대방을 선택하면 알림을 띄우고 확인 버튼을 기다림
  const handleSelectReceiver = (receiver) => {
    setSelectedReceiver(receiver);
    setShowAlert(true);
  };

  // 확인 버튼을 누르면 채팅방 생성
  const handleConfirmCreateChatRoom = async () => {
    setShowAlert(false);

    if (!selectedReceiver) return;

    try {
      const newRoom = await createChatRoom(myUserId, selectedReceiver.id);
      if (newRoom && newRoom.id) {
        if (onChatRoomCreated) {
          onChatRoomCreated(newRoom);
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
                  onClick={() => handleSelectReceiver(emp)}
                  className="employee-item"
                >
                  <strong>{emp.name}</strong> ({emp.departmentName} /{" "}
                  {emp.positionName})
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

      {/*  커스텀 알림 모달 */}
      {showAlert && selectedReceiver && (
        <div className="custom-alert">
          <div className="alert-content">
            <p>{selectedReceiver.name}님과의 채팅방을 생성하시겠습니까?</p>
            <button onClick={handleConfirmCreateChatRoom}>확인</button>
            <button onClick={() => setShowAlert(false)}>취소</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatCreate;
