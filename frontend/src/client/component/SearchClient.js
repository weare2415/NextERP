import React, { useEffect, useState } from "react";
import {
  getClientById,
  getClientsByEmployeeId,
  getClientByName,
} from "../api/clientApi";
import { getEmployeeByName } from "../../member/api/memberApi";
import "../component/scss/SearchClient.scss";

const SearchClient = ({ onSearchResults }) => {
  const [searchParams, setSearchParams] = useState({
    searchType: "clientName", // 기본값: 거래처 명 검색
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  // 자동완성 API 요청
  const fetchSuggestions = async (query, searchType) => {
    try {
      let data = [];

      if (searchType === "clientCode") {
        const response = await getClientById(query);
        data = response.content.map((client) => ({
          clientCode: client.clientCode,
        }));
      } else if (searchType === "clientName") {
        const response = await getClientByName(query);
        data = response.content.map((client) => ({
          clientName: client.clientName,
        }));
      }
      setSuggestions(data);
    } catch (error) {
      console.error("자동완성 검색 오류:", error);
      setSuggestions([]);
    }
  };

  // 검색어 변경 시 자동완성 실행
  useEffect(() => {
    if (searchParams.searchTerm.length > 1 && !isSelecting) {
      fetchSuggestions(searchParams.searchTerm, searchParams.searchType);
    } else {
      setSuggestions([]);
    }
    setIsSelecting(false);
  }, [searchParams.searchTerm, searchParams.searchType]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data = [];

      if (searchParams.searchType === "clientCode") {
        const response = await getClientById(searchParams.searchTerm);
        data = response.content ? response.content : [];
      } else if (searchParams.searchType === "clientName") {
        const response = await getClientByName(searchParams.searchTerm);
        data = response.content ? response.content : [];
      } else if (searchParams.searchType === "employeeName") {
        const employee = await getEmployeeByName(searchParams.searchTerm);
        if (employee.length > 0 && employee[0].id) {
          const response = await getClientsByEmployeeId(employee[0].id);
          data = response.content ? response.content : [];
        } else {
          console.log("유효한 직원 정보가 없습니다.");
          data = [];
        }
      }
      onSearchResults(data);
    } catch (err) {
      console.error("검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex < 0 || selectedIndex >= suggestions.length) return; // 인덱스 범위 체크

      const selectedItem = suggestions[selectedIndex];
      if (!selectedItem) return; // 선택된 항목이 존재하는지 확인

      const selectedValue =
        selectedItem?.clientCode || selectedItem?.clientName; // 안전한 접근
      if (!selectedValue) return; // 값이 없는 경우 리턴

      setIsSelecting(true);
      setSearchParams((prev) => ({ ...prev, searchTerm: selectedValue }));
      setSuggestions([]); // 자동완성 닫기
      e.preventDefault();
    }
  };

  return (
    <div className="search-client-container">
      <form onSubmit={handleSearch} className="client-search-form">
        <select
          name="searchType"
          value={searchParams.searchType}
          onChange={handleInputChange}
        >
          <option value="clientName">기업명</option>
          <option value="clientCode">거래처 코드</option>
          <option value="employeeName">영업 담당자</option>
        </select>
        <div className="search-input-wrapper">
          <input
            type="text"
            name="searchTerm"
            placeholder="검색어를 입력하세요"
            value={searchParams.searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />

          {/*자동완성 목록 */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, index) => (
                <li
                  key={item.clientCode || item.clientName || index}
                  className={selectedIndex === index ? "selected" : ""}
                  onMouseDown={() => {
                    setIsSelecting(true);
                    setSearchParams((prev) => ({
                      ...prev,
                      searchTerm: item.clientCode || item.clientName,
                    }));
                    setSuggestions([]);
                  }}
                >
                  {item.clientCode || item.clientName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">검색</button>
      </form>

      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SearchClient;
