import React, { useEffect, useState } from "react";
import {
  getAttendancesPresentLateOffWork,
  requestApproval,
} from "../api/attendanceApi"; 
import BasicLayout from "../../../common/pages/BasicLayout";
import AttendanceList from "../components/AttendanceList";
import "../scss/AttendancePage.scss";

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAttendances(page);
  }, [page]);

  const fetchAttendances = async (currentPage) => {
    setLoading(true);
    try {
      console.log("📢 출근/지각/퇴근 근태 기록 요청...");
      const data = await getAttendancesPresentLateOffWork(currentPage, 10); // 
      console.log("📢 API 응답 데이터:", data);

      setAttendances(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  //  승인 요청 함수
  const handleApprovalRequest = async (id) => {
    try {
      await requestApproval(id);
      alert("승인 요청이 완료되었습니다.");
      fetchAttendances(page);
    } catch (error) {
      console.error("승인 요청 실패:", error);
      alert("승인 요청 실패");
    }
  };

  return (
    <BasicLayout>
      <div className="employee-attendance-page-container">
        <div className="page-header">
          <h1>근태 관리</h1>
        </div>
        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : (
          <AttendanceList
            attendances={attendances}
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
