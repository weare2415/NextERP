import React, { useState } from "react";
import { useSelector } from "react-redux"; // Redux 사용
import "../scss/SearchAttendance.scss";

const MySearchAttendance = ({
  filteredAttendances,
  setFilteredAttendances,
}) => {
  const employeeId = useSelector((state) => state.loginSlice.id) || ""; // 로그인한 사용자 ID 가져오기
  const [searchType, setSearchType] = useState("employee");
  const [searchValue, setSearchValue] = useState("");

  const statusMap = {
    출근: "PRESENT",
    퇴근: "OFF_WORK",
    지각: "LATE",
    휴가: "LEAVE",
    병가: "SICK_LEAVE",
    재택근무: "REMOTE_WORK",
  };

  const handleSearch = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    if (!searchValue.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    try {
      let data = [...filteredAttendances]; // 부모 컴포넌트에서 전달된 데이터 복사

      if (searchType === "employee") {
        // 사원 ID를 기준으로 필터링
        data = data.filter(
          (attendance) => attendance.employeeId === employeeId
        );
      } else if (searchType === "date") {
        // 날짜 기준으로 필터링
        data = data.filter(
          (attendance) => attendance.date.includes(searchValue) // 날짜 포맷에 맞춰 부분 일치 검색
        );
      } else if (searchType === "status") {
        // 상태 값 기준으로 필터링
        const statusKey = statusMap[searchValue.trim()];
        if (!statusKey) {
          alert("잘못된 상태값입니다.");
          return;
        }
        data = data.filter((attendance) => attendance.status === statusKey);
      }

      setFilteredAttendances(data); // 필터링된 데이터를 부모 컴포넌트에 전달
    } catch (error) {
      console.error("검색 실패:", error);
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div className="search-attendance-container">
      <form className="search-attendance-form" onSubmit={handleSearch}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="employee">사원 ID</option>
          <option value="date">날짜</option>
          <option value="status">상태</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>
    </div>
  );
};

export default MySearchAttendance;
