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

const PAGE_SIZE = 5;
const SEARCH_PAGE_SIZE = 1000; // 검색 시 전체 결과를 받아오기 위한 크기

const AttendanceHistoryPage = () => {
  const [loading, setLoading] = useState(false);

  // 일반 모드 데이터
  const [pendingRequests, setPendingRequests] = useState([]);
  const [originalPendingRequests, setOriginalPendingRequests] = useState([]);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(0);

  const [approvedRequests, setApprovedRequests] = useState([]);
  const [originalApprovedRequests, setOriginalApprovedRequests] = useState([]);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [approvedPage, setApprovedPage] = useState(0);

  // 검색 모드 데이터
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPending, setFilteredPending] = useState([]);
  const [filteredApproved, setFilteredApproved] = useState([]);

  // 검색 term 및 카테고리
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("employeeId");

  const approvalStatusMapping = {
    "승인 대기": "PENDING",
    승인됨: "APPROVED",
    승인: "APPROVED",
    거부됨: "REJECTED",
  };

  // 일반 모드 데이터 요청 (검색 모드가 아닐 때)
  useEffect(() => {
    if (!isSearching) {
      fetchPendingRequests();
    }
  }, [pendingPage, isSearching]);

  useEffect(() => {
    if (!isSearching) {
      fetchApprovedRequests();
    }
  }, [approvedPage, isSearching]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      console.log(
        `📢 승인 대기 근태 기록 요청: page=${pendingPage}, size=${PAGE_SIZE}`
      );
      const data = await getPendingAttendances(pendingPage, PAGE_SIZE);
      // 날짜 오름차순 정렬 (오래된 날짜부터)
      const sortedPending = data.content.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setPendingRequests(sortedPending);
      setOriginalPendingRequests(sortedPending);
      setPendingTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 승인 대기 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  const fetchApprovedRequests = async () => {
    setLoading(true);
    try {
      console.log(
        `📢 승인된 근태 기록 요청: page=${approvedPage}, size=${PAGE_SIZE}`
      );
      const data = await getApprovedAttendances(approvedPage, PAGE_SIZE);
      // 날짜 오름차순 정렬
      const sortedApproved = data.content.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setApprovedRequests(sortedApproved);
      setOriginalApprovedRequests(sortedApproved);
      setApprovedTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 승인된 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // 검색어가 없으면 일반 모드로 복귀
      if (!searchTerm.trim()) {
        console.log("🔍 검색어 없음 - 일반 데이터 조회");
        setIsSearching(false);
        setPendingPage(0);
        setApprovedPage(0);
        await fetchPendingRequests();
        await fetchApprovedRequests();
        setLoading(false);
        return;
      }

      setIsSearching(true);
      let employeeData, dateData, mappedStatus;
      console.log("📢 검색 시작", searchCategory, searchTerm);

      if (searchCategory === "employeeId") {
        console.log("🔍 사원 ID 검색 요청", searchTerm);
        employeeData = await getAttendanceByEmployee(
          searchTerm,
          0,
          SEARCH_PAGE_SIZE
        );
        if (employeeData && employeeData.content) {
          const pendingFiltered = employeeData.content.filter(
            (request) =>
              request.requestStatus === "PENDING" &&
              request.employeeId.toString().includes(searchTerm.trim())
          );
          const approvedFiltered = employeeData.content.filter(
            (request) =>
              request.requestStatus === "APPROVED" &&
              request.employeeId.toString().includes(searchTerm.trim())
          );
          setFilteredPending(pendingFiltered);
          setFilteredApproved(approvedFiltered);
          setPendingTotalPages(Math.ceil(pendingFiltered.length / PAGE_SIZE));
          setApprovedTotalPages(Math.ceil(approvedFiltered.length / PAGE_SIZE));
          setPendingPage(0);
          setApprovedPage(0);
        }
      } else if (searchCategory === "date") {
        console.log("🔍 날짜 검색 요청", searchTerm);
        dateData = await getAttendanceByDate(searchTerm, 0, SEARCH_PAGE_SIZE);
        if (dateData && dateData.content) {
          const pendingFiltered = dateData.content.filter(
            (request) =>
              request.requestStatus === "PENDING" &&
              request.date.includes(searchTerm)
          );
          const approvedFiltered = dateData.content.filter(
            (request) =>
              request.requestStatus === "APPROVED" &&
              request.date.includes(searchTerm)
          );
          setFilteredPending(pendingFiltered);
          setFilteredApproved(approvedFiltered);
          setPendingTotalPages(Math.ceil(pendingFiltered.length / PAGE_SIZE));
          setApprovedTotalPages(Math.ceil(approvedFiltered.length / PAGE_SIZE));
          setPendingPage(0);
          setApprovedPage(0);
        }
      } else if (searchCategory === "approvalStatus") {
        console.log("🔍 승인 상태 검색 요청", searchTerm);
        mappedStatus = approvalStatusMapping[searchTerm] || null;
        if (mappedStatus) {
          // 승인 상태 검색은 현재 페이지의 원본 데이터를 대상으로 함
          const pendingFiltered = originalPendingRequests.filter(
            (request) => request.requestStatus === mappedStatus
          );
          const approvedFiltered = originalApprovedRequests.filter(
            (request) => request.requestStatus === mappedStatus
          );
          setFilteredPending(pendingFiltered);
          setFilteredApproved(approvedFiltered);
          setPendingTotalPages(Math.ceil(pendingFiltered.length / PAGE_SIZE));
          setApprovedTotalPages(Math.ceil(approvedFiltered.length / PAGE_SIZE));
          setPendingPage(0);
          setApprovedPage(0);
        }
      }
    } catch (error) {
      console.error("❌ 검색 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  // 화면에 보여줄 데이터 (검색 모드이면 검색 결과의 현재 페이지 슬라이스, 아니면 일반 데이터)
  const displayedPending = isSearching
    ? filteredPending.slice(
        pendingPage * PAGE_SIZE,
        (pendingPage + 1) * PAGE_SIZE
      )
    : pendingRequests;
  const displayedApproved = isSearching
    ? filteredApproved.slice(
        approvedPage * PAGE_SIZE,
        (approvedPage + 1) * PAGE_SIZE
      )
    : approvedRequests;

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
            <RequestHistory
              requests={displayedPending}
              title="승인 대기 내역"
            />
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
            />
            <RequestHistory
              requests={displayedApproved}
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
