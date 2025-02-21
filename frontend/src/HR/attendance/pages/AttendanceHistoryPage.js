import React, { useEffect, useState } from "react";
import {
  getPendingAttendances,
  getApprovedAttendances,
  getAttendanceByEmployee,
  getAttendanceByDate,
} from "../api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import Pagination from "../../../common/component/Pagination";
import "../scss/AttendanceHistoryPage.scss";
import RequestHistory from "../components/RequestHistory";

const AttendanceHistoryPage = () => {
  const [loading, setLoading] = useState(false);

  // 승인 대기 데이터
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(0);

  // 승인 완료 데이터
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [approvedPage, setApprovedPage] = useState(0);

  // 검색 term
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("employeeId");

  const approvalStatusMapping = {
    "승인 대기": "PENDING",
    승인됨: "APPROVED",
    승인: "APPROVED",
    거부됨: "REJECTED",
  };

  // 기본 데이터 요청은 검색어가 없을 때만 실행
  useEffect(() => {
    fetchPendingRequests();
  }, [pendingPage]);

  useEffect(() => {
    fetchApprovedRequests();
  }, [approvedPage]);

  // 승인 대기 데이터 가져오기
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      console.log(`📢 승인 대기 근태 기록 요청: page=${pendingPage}, size=5`);
      const data = await getPendingAttendances(pendingPage, 5);
      setPendingRequests(data.content);
      setPendingTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 승인 대기 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  // 승인된 데이터 가져오기
  const fetchApprovedRequests = async () => {
    setLoading(true);
    try {
      console.log(`📢 승인된 근태 기록 요청: page=${approvedPage}`);
      const data = await getApprovedAttendances(approvedPage, 5);
      setApprovedRequests(data.content);
      setApprovedTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 승인된 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  // 검색 처리 함수 (검색 버튼 클릭 시 실행)
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchTerm.trim()) {
        console.log("🔍 검색어 없음 - 전체 데이터 조회");
        await fetchPendingRequests();
        await fetchApprovedRequests();
        setLoading(false);
        return;
      }

      let employeeData;
      let dateData;
      let mappedStatus;

      console.log("📢 검색 시작", searchCategory, searchTerm);

      if (searchCategory === "employeeId") {
        console.log("🔍 사원 ID 검색 요청", searchTerm);
        employeeData = await getAttendanceByEmployee(searchTerm, 0, 5);
        if (employeeData && employeeData.content) {
          setPendingRequests(
            employeeData.content.filter(
              (request) =>
                request.requestStatus === "PENDING" &&
                request.employeeId.toString().includes(searchTerm.trim())
            )
          );
          setApprovedRequests(
            employeeData.content.filter(
              (request) =>
                request.requestStatus === "APPROVED" &&
                request.employeeId.toString().includes(searchTerm.trim())
            )
          );
          setPendingTotalPages(employeeData.totalPages);
          setApprovedTotalPages(employeeData.totalPages);
        } else {
          setPendingRequests([]);
          setApprovedRequests([]);
          setPendingTotalPages(0);
          setApprovedTotalPages(0);
        }
      } else if (searchCategory === "employeeName") {
        console.log("🔍 사원명 검색 요청", searchTerm);
        employeeData = await getAttendanceByEmployee(searchTerm, 0, 5);
        if (employeeData && employeeData.content) {
          setPendingRequests(
            employeeData.content.filter(
              (request) =>
                request.requestStatus === "PENDING" &&
                request.employeeName.includes(searchTerm)
            )
          );
          setApprovedRequests(
            employeeData.content.filter(
              (request) =>
                request.requestStatus === "APPROVED" &&
                request.employeeName.includes(searchTerm)
            )
          );
          setPendingTotalPages(employeeData.totalPages);
          setApprovedTotalPages(employeeData.totalPages);
        } else {
          setPendingRequests([]);
          setApprovedRequests([]);
          setPendingTotalPages(0);
          setApprovedTotalPages(0);
        }
      } else if (searchCategory === "date") {
        console.log("🔍 날짜 검색 요청", searchTerm);
        dateData = await getAttendanceByDate(searchTerm, 0, 5);
        setPendingRequests(
          dateData.content.filter(
            (request) =>
              request.requestStatus === "PENDING" && request.date === searchTerm
          )
        );
        setApprovedRequests(
          dateData.content.filter(
            (request) =>
              request.requestStatus === "APPROVED" &&
              request.date === searchTerm
          )
        );
        setPendingTotalPages(dateData.totalPages);
        setApprovedTotalPages(dateData.totalPages);
      } else if (searchCategory === "approvalStatus") {
        console.log("🔍 승인 상태 검색 요청", searchTerm);
        mappedStatus = approvalStatusMapping[searchTerm] || null;
        if (mappedStatus) {
          setPendingRequests(
            pendingRequests.filter(
              (request) => request.requestStatus === mappedStatus
            )
          );
          setApprovedRequests(
            approvedRequests.filter(
              (request) => request.requestStatus === mappedStatus
            )
          );
        }
      }
    } catch (error) {
      console.error("❌ 검색 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  return (
    <BasicLayout>
      <div className="attendance-history-page-container">
        <div className="page-header">
          <h1>근태 신청 내역</h1>
          <div className="search-container">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-category-select"
            >
              <option value="employeeId">사원 ID</option>
              <option value="date">신청 날짜</option>
              <option value="approvalStatus">승인 상태</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button className="search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>

        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : (
          <>
            {/* 승인 대기 내역 */}
            <RequestHistory requests={pendingRequests} title="승인 대기 내역" />
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
            />

            {/* 승인 완료 내역 */}
            <RequestHistory
              requests={approvedRequests}
              title="승인 완료 내역"
            />
            <Pagination
              currentPage={approvedPage}
              totalPages={approvedTotalPages}
              onPageChange={setApprovedPage}
            />
          </>
        )}
      </div>
    </BasicLayout>
  );
};

export default AttendanceHistoryPage;
