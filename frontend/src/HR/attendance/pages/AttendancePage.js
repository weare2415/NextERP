import React, { useEffect, useState } from "react";
import {
  getAttendancesPresentLateOffWork,
  requestApproval,
} from "../api/attendanceApi"; // ✅ 변경된 API 적용
import BasicLayout from "../../../common/pages/BasicLayout";
import AttendanceList from "../components/AttendanceList";
import "../scss/AttendancePage.scss";

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      console.log("📢 출근/지각/퇴근 근태 기록 요청...");
      const data = await getAttendancesPresentLateOffWork(); // ✅ API 호출
      console.log("📢 API 응답 데이터:", JSON.stringify(data, null, 2)); // 응답 데이터 확인

      // ✅ 데이터 구조 변경 반영
      setAttendances(data); // content가 없으므로 직접 설정
      setFilteredAttendances(data);
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  // ✅ 승인 요청 함수 (휴가, 병가, 재택만 승인 요청 가능)
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
            attendances={filteredAttendances}
            onRequestApproval={handleApprovalRequest}
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default AttendancePage;
