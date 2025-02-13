import React, { useEffect, useState } from "react";
import { getAllAttendances, requestApproval } from "../api/attendanceApi";
import BasicLayout from "../../common/pages/BasicLayout";
import AttendanceList from "../components/AttendanceList"; // ✅ 리스트 분리
import "../scss/AttendancePage.scss";

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]); // ✅ 전체 근태 기록
  const [filteredAttendances, setFilteredAttendances] = useState([]); // ✅ 검색 필터링된 근태 기록
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const data = await getAllAttendances();
      setAttendances(data);
      setFilteredAttendances(data);
    } catch (error) {
      console.error("근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  // ✅ 승인 요청 함수 (휴가, 병가, 재택만 승인 요청 가능)
  const handleApprovalRequest = async (id) => {
    try {
      await requestApproval(id);
      alert("승인 요청이 완료되었습니다.");
      fetchAttendances(); // 데이터 새로고침
    } catch (error) {
      console.error("❌ 승인 요청 실패:", error);
      alert("승인 요청 실패");
    }
  };

  return (
    <BasicLayout>
      <div className="attendance-page">
        <h2>근태 관리</h2>
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
