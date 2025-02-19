import React, { useEffect, useState } from "react";
import {
  getPendingAttendances,
  getApprovedAttendances,
  requestApproval,
} from "../api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import Pagination from "../../../common/component/Pagination"; // 페이징 컴포넌트 추가
import "../scss/AttendanceHistoryPage.scss";
import RequestHistory from "../components/RequestHistory";

const AttendanceHistoryPage = () => {
  const [loading, setLoading] = useState(false);

  //  승인 대기 데이터
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(0);

  // 승인 완료 데이터
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [approvedPage, setApprovedPage] = useState(0);

  useEffect(() => {
    fetchPendingRequests();
  }, [pendingPage]); //  승인 대기 페이징 변경 시

  useEffect(() => {
    fetchApprovedRequests();
  }, [approvedPage]); //  승인 완료 페이징 변경 시

  //  승인 대기 데이터 가져오기
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      console.log(`📢 승인 대기 근태 기록 요청: page=${pendingPage}, size=5`);
      const data = await getPendingAttendances(pendingPage, 5);
  
      console.log("📌 받은 승인 대기 데이터 (전체):", data.content);
      console.log("📌 현재 페이지에서 표시할 데이터 개수:", data.content.length);
      console.log("📌 totalPages 확인:", data.totalPages);
  
      // ✅ 특정 사원 데이터가 포함되는지 확인
      const employeeCheck = data.content.map(d => `${d.employeeId}: ${d.employeeName}`);
      console.log("📌 현재 페이지에 포함된 직원 목록:", employeeCheck);
  
      setPendingRequests(data.content); 
      setPendingTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 승인 대기 데이터 조회 실패:", error);
    }
    setLoading(false);
  };
  
  
  //  승인된 데이터 가져오기
  const fetchApprovedRequests = async () => {
    setLoading(true);
    try {
      console.log(`📢 승인된 근태 기록 요청: page=${approvedPage}`);
      const data = await getApprovedAttendances(approvedPage, 5);
      console.log("📌 승인된 데이터:", data);

      setApprovedRequests(data.content); //  백엔드 페이징 데이터 적용
      setApprovedTotalPages(data.totalPages); //  totalPages 그대로 사용
    } catch (error) {
      console.error("❌ 승인된 데이터 조회 실패:", error);
    }
    setLoading(false);
  };

  return (
    <BasicLayout>
      <div className="attendance-history-page-container">
        <div className="page-header">
          <h1>근태 신청 내역</h1>
        </div>

        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : (
          <>
            {/* 승인 대기 내역 */}
            <h2>승인 대기 내역</h2>
            <RequestHistory requests={pendingRequests} />
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
            />

            {/*  승인 완료 내역 */}
            <h2>승인 완료 내역</h2>
            <RequestHistory requests={approvedRequests} />
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
