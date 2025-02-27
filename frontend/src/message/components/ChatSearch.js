import React, { useState } from "react";
import { getEmployeesByName } from "../../HR/employee/api/employeeApi";
import "../scss/ChatSearch.scss";

const ChatSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔍 검색어 입력 시 자동완성 목록 업데이트
  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  
    if (term.trim().length > 0) {
      try {
        const response = await getEmployeesByName(term); // ✅ 직원 검색 API 호출
        const employees = response.content || [];  // content가 없으면 빈 배열로 설정
        if (Array.isArray(employees)) {
          setSuggestions(employees);
        } else {
          console.error("❌ 직원 검색 결과가 배열이 아닙니다.", employees);
        }
      } catch (error) {
        console.error("❌ 직원 검색 오류:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // ✅ 검색 실행
  const handleSearchSubmit = () => {
    if (searchTerm.trim().length > 0) {
      if (Array.isArray(suggestions)) {
        const selectedEmployee = suggestions.find(
          (emp) => emp.name === searchTerm
        );
        if (selectedEmployee) {
          onSearch(selectedEmployee.id); // ✅ 검색된 직원 ID로 채팅방 필터링
          setSuggestions([]); // 검색 후에는 제안 목록 초기화
        } else {
          console.log("❌ 해당 이름의 직원이 없습니다.");
        }
      } else {
        console.error("❌ suggestions가 배열이 아닙니다.");
      }
    }
  };

  // ✅ Enter 키 입력 시 검색 실행
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // ✅ 직원 선택 시 검색창에 값 입력
  const handleSelectEmployee = (employee) => {
    setSearchTerm(employee.name);
    setSuggestions([]);
    onSearch(employee.id);
  };

  // ❌ 검색어 초기화 (전체 목록 표시)
  const handleClearSearch = () => {
    setSearchTerm(""); // 검색어 초기화
    setSuggestions([]);
    onSearch(""); // 전체 목록 표시
  };

  return (
    <div className="chat-search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="채팅방, 참여자 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        {searchTerm && (
          <>
            <button className="search-button" onClick={handleSearchSubmit}>
              🔍
            </button>
            <button className="clear-button" onClick={handleClearSearch}>
              X
            </button>
          </>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-list">
          <ul>
            {suggestions.map((emp) => (
              <li key={emp.id} onClick={() => handleSelectEmployee(emp)}>
                {emp.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
