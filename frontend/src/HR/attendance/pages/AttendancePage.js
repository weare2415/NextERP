import React, { useEffect, useState } from "react";
import { getAllAttendances, requestApproval } from "../api/attendanceApi";
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
