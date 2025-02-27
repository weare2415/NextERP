import React, { useEffect, useState } from "react";
import {
  getAttendancesPresentLateOffWork,
  requestApproval,
} from "../api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import AttendanceList from "../components/AttendanceList";
import "../scss/AttendancePage.scss";

const statusMap = {
  출근: "PRESENT",
  지각: "LATE",
  퇴근: "OFF_WORK",
};

const AttendancePage = () => {
  // 전체 데이터를 저장 (검색 전 전체 데이터)
  const [allAttendances, setAllAttendances] = useState([]);
  // 검색 후 필터링된 데이터를 저장; null이면 검색하지 않은 상태
  const [filteredAttendances, setFilteredAttendances] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("Id");

  useEffect(() => {
    fetchAttendances();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAttendances(null);
      const pages = Math.ceil(allAttendances.length / 10);
      setTotalPages(pages > 0 ? pages : 1);
      setPage(0);
    }
  }, [allAttendances]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      console.log("📢 전체 근태 기록 요청...");
      // 모든 데이터를 가져오기 위해 페이지=0, size=1000 (데이터가 12개라면 충분)
      const data = await getAttendancesPresentLateOffWork(0, 1000);
      console.log("📢 API 응답 데이터:", data);

      setAllAttendances(data.content);
      const pages = Math.ceil(data.content.length / 10);
      setTotalPages(pages > 0 ? pages : 1);
      setPage(0);
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  // 검색 버튼 클릭 시, 전체 데이터에서 필터링 처리
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredAttendances(null);
      const pages = Math.ceil(allAttendances.length / 10);
      setTotalPages(pages > 0 ? pages : 1);
      setPage(0);
      return; // 검색어가 없으면 필터링 해제 후 종료
    }
    const filtered = allAttendances.filter((attendance) => {
      switch (searchCategory) {
        case "name":
          return attendance.employeeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "id":
          return attendance.employeeId
            .toString()
            .includes(searchTerm.toLowerCase());
        case "status":
          const searchStatus = statusMap[searchTerm] || searchTerm;
          return attendance.status
            .toLowerCase()
            .includes(searchStatus.toLowerCase());
        default:
          return true;
      }
    });

    setFilteredAttendances(filtered);
    const pages = Math.ceil(filtered.length / 10);
    setTotalPages(pages > 0 ? pages : 1);
    if (page >= pages) {
      setPage(pages - 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleApprovalRequest = async (id) => {
    try {
      await requestApproval(id);
      alert("승인 요청이 완료되었습니다.");
      fetchAttendances();
    } catch (error) {
      console.error("승인 요청 실패:", error);
      alert("승인 요청 실패");
    }
  };

  const dataToDisplay =
    filteredAttendances !== null ? filteredAttendances : allAttendances;

  return (
    <BasicLayout>
      <div className="employee-attendance-page-container">
        <div className="page-header">
          <h1>근태 관리</h1>
          <div className="search-content">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-option-select"
            >
              <option value="id">사원ID</option>
              <option value="name">사원명</option>
              <option value="status">상태</option>
            </select>

            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />

            <button className="search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>

        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : (
          <AttendanceList
            attendances={dataToDisplay.slice(page * 10, (page + 1) * 10)}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            onRequestApproval={handleApprovalRequest}
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default AttendancePage;
