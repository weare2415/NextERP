import React, { useState } from "react";
import { useSelector } from "react-redux"; // 로그인된 ID 가져오기
import {
  getAttendanceByEmployee,
  getAttendanceByDate,
  getAttendancesByStatus,
} from "../api/attendanceApi";
import "../scss/MySearchAttendance.scss";

const MySearchAttendance = ({ setFilteredAttendances }) => {
  const employeeId = useSelector((state) => state.loginSlice.id); // 로그인된 사용자의 ID
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

  const handleSearch = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    if (!searchValue.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }

    try {
      let data;
      // 로그인된 사용자의 ID를 포함하여 API 호출
      if (searchType === "employee") {
        data = await getAttendanceByEmployee(employeeId); // 사원 ID로 필터링
      } else if (searchType === "date") {
        data = await getAttendanceByDate(employeeId, searchValue); // 날짜로 필터링
      } else if (searchType === "status") {
        const statusKey = statusMap[searchValue.trim()];
        if (!statusKey) {
          alert(
            "잘못된 상태값입니다. (출근, 퇴근, 지각, 휴가, 병가, 재택근무 중 선택)"
          );
          return;
        }
        data = await getAttendancesByStatus(employeeId, statusKey); // 상태와 사원 ID로 필터링
      }

      // 데이터를 가져온 후, employeeId에 맞게 필터링
      const filteredData = data.filter(
        (attendance) => attendance.employeeId === employeeId
      );

      setFilteredAttendances(filteredData); // 부모 컴포넌트에 필터링된 데이터를 전달
    } catch (error) {
      console.error("검색 실패:", error);
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div className="search-my-attendance-container">
      <form className="search-my-attendance-form" onSubmit={handleSearch}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="employee">사원 ID</option>
          <option value="date">날짜</option>
          <option value="status">상태</option>
        </select>
        <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        </div>
        <button type="submit">검색</button>
      </form>
    </div>
  );
};

export default MySearchAttendance;