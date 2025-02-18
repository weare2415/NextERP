import React, { useEffect, useState } from "react";
import {
  getPendingAttendances,
  getApprovedAttendances,
  requestApproval,
} from "../api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import Pagination from "../../../common/component/Pagination"; // ✅ 페이징 컴포넌트 추가
import "../scss/AttendanceHistoryPage.scss";
import RequestHistory from "../components/RequestHistory";

const AttendanceHistoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  // ✅ 페이징 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const pageSize = 10; // 한 페이지당 10개

  useEffect(() => {
    fetchRequests();
  }, [currentPage]); // ✅ currentPage 변경될 때마다 새 데이터 요청

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // ✅ 승인 대기 중인 데이터 & 승인된 데이터 병렬 요청
      const [pendingData, approvedData] = await Promise.all([
        getPendingAttendances(currentPage, pageSize),
        getApprovedAttendances(currentPage, pageSize),
      ]);

      console.log("📌 승인 대기 데이터:", pendingData);
      console.log("📌 승인된 데이터:", approvedData);

      // ✅ 서버에서 받은 데이터를 그대로 사용
      setRequests([...pendingData.content, ...approvedData.content]); // 데이터 합치기
      setTotalPages(Math.max(pendingData.totalPages, approvedData.totalPages)); // 가장 큰 totalPages 사용
    } catch (error) {
      console.error("❌ 신청 내역 조회 실패:", error);
      alert("신청 내역을 불러오지 못했습니다.");
    }
    setLoading(false);
  };

  const handleApprovalRequest = async (id) => {
    try {
      await requestApproval(id);
      alert("승인 요청이 완료되었습니다.");
      fetchRequests(); // ✅ 데이터 다시 불러오기
    } catch (error) {
      console.error("❌ 승인 요청 실패:", error);
      alert("승인 요청 실패");
    }
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
            <RequestHistory
              requests={requests}
              onApprovalRequest={handleApprovalRequest}
            />

            {/* ✅ 페이징 UI 추가 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </BasicLayout>
  );
};

export default AttendanceHistoryPage;
