import React, { useEffect, useState } from "react";
import {
  getPendingAttendances,
  approveAttendance,
  rejectAttendance,
} from "../api/attendanceApi";
import Pagination from "../../../common/component/Pagination";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/ApprovalPage.scss";
import ApprovalList from "../components/ApprovalList";

const ApprovalPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const pageSize = 10; // 한 페이지당 10개

  const statusMap = {
    LEAVE: "휴가",
    SICK_LEAVE: "병가",
    REMOTE_WORK: "재택",
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [currentPage]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const data = await getPendingAttendances(currentPage, pageSize); // ✅ page, size 추가
      console.log("📌 가져온 승인 대기 데이터:", data);
      setPendingRequests(data.content); // ✅ 페이징된 데이터만 저장
      setTotalPages(data.totalPages); // ✅ 전체 페이지 수 업데이트
    } catch (error) {
      console.error("❌ 승인 대기 목록 조회 실패:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await approveAttendance(id);
      alert("승인 완료되었습니다.");
      fetchPendingRequests(); // ✅ 목록 갱신
    } catch (error) {
      alert("승인 실패: " + error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAttendance(id);
      alert("거부 완료되었습니다.");
      fetchPendingRequests(); // ✅ 목록 갱신
    } catch (error) {
      alert("거부 실패: " + error.message);
    }
  };

  return (
    <BasicLayout>
      <div className="approval-page-wrapper">
        <div className="page-header">
          <h1>근태 승인 관리</h1>
        </div>
        {loading ? (
          <p className="approval-page-loading">⏳ 로딩 중...</p>
        ) : (
          <>
            <ApprovalList
              requests={pendingRequests}
              statusMap={statusMap}
              onApprove={handleApprove}
              onReject={handleReject}
            />
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

export default ApprovalPage;
