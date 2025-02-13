import React, { useState } from "react";
import {
  getAttendanceByEmployee,
  getAttendanceByDate,
  getAttendancesByStatus,
} from "../api/attendanceApi";
import "../scss/SearchAttendance.scss"; // ✅ SCSS 파일 추가

const SearchAttendance = ({ setFilteredAttendances }) => {
  const [searchType, setSearchType] = useState("employee");
  const [searchValue, setSearchValue] = useState("");

  // ✅ 한글 -> 영어 상태 변환 맵 추가
  const statusMap = {
    출근: "PRESENT",
    퇴근: "OFF_WORK",
    지각: "LATE",
    휴가: "LEAVE",
    병가: "SICK_LEAVE",
    재택근무: "REMOTE_WORK",
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    try {
      let data;
      if (searchType === "employee") {
        data = await getAttendanceByEmployee(searchValue);
      } else if (searchType === "date") {
        data = await getAttendanceByDate(searchValue);
      } else if (searchType === "status") {
        const statusKey = statusMap[searchValue.trim()]; // 한글을 영어 상태로 변환
        if (!statusKey) {
          alert(
            "잘못된 상태값입니다. (출근, 퇴근, 지각, 휴가, 병가, 재택근무 중 선택)"
          );
          return;
        }
        data = await getAttendancesByStatus(statusKey);
      }

      setFilteredAttendances(data);
    } catch (error) {
      console.error("❌ 검색 실패:", error);
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div className="search-container">
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
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchAttendance;
