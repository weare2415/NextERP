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
        const employees = await getEmployeesByName(term); // ✅ 직원 검색 API 호출
        setSuggestions(employees);
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
      const selectedEmployee = suggestions.find(
        (emp) => emp.name === searchTerm
      );
      if (selectedEmployee) {
        onSearch(selectedEmployee.id); // ✅ 검색된 직원 ID로 채팅방 필터링
        setSuggestions([]);
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
              ×
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