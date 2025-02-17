import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  checkIn,
  checkOut,
  getAttendanceByEmployee,
} from "../../attendance/api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/MyAttendancePage.scss";

// ✅ 상태 값을 한글로 변환하는 매핑 객체
const statusTextMap = {
  PRESENT: "출근",
  LATE: "지각",
  OFF_WORK: "퇴근",
};

const MyAttendancePage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id);
  const [attendance, setAttendance] = useState(null); // 당일 출퇴근 기록
  const [allAttendance, setAllAttendance] = useState([]); // 전체 출퇴근 기록
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await getAttendanceByEmployee(employeeId);
      setAllAttendance(data); // 전체 근태 기록 저장

      setAttendance(data.length > 0 ? data[0] : null); // 오늘 출근 기록 설정
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    try {
      await checkIn(employeeId);
      alert("출근 완료!");
      fetchAttendance();
    } catch (error) {
      alert("출근 실패: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut(employeeId);
      alert("퇴근 완료!");
      fetchAttendance();
    } catch (error) {
      alert("퇴근 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <BasicLayout>
      <div className="mypage">
        <h1>My 출/퇴근 조회</h1>

        <div className="user-controls">
          <p>
            <strong>사원 ID:</strong> {employeeId || "로그인이 필요합니다."}
          </p>

          <div className="buttons">
            <button onClick={handleCheckIn} disabled={attendance?.checkInTime}>
              출근
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!attendance || attendance?.checkOutTime}
            >
              퇴근
            </button>
          </div>
        </div>

        <div className="page-container">
          {/* ✅ 당일 출퇴근 내역 */}
          <div className="left-section">
            <h3>당일 출퇴근 내역</h3>
            {loading ? (
              <p className="loading">⏳ 로딩 중...</p>
            ) : attendance ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>사원번호</th>
                    <th>출근 시간</th>
                    <th>퇴근 시간</th>
                    <th>상태</th>
                    <th>초과 근무(시간)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{attendance.date}</td>
                    <td>{employeeId}</td>
                    <td>{attendance.checkInTime || "출근 전"}</td>
                    <td>{attendance.checkOutTime || "퇴근 전"}</td>
                    <td>{statusTextMap[attendance?.status] || ""}</td>
                    <td>{attendance.overtimeHours || "0"}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>📌 출근 기록이 없습니다.</p>
            )}
          </div>

          {/* ✅ 전체 출퇴근 내역 */}
          <div className="right-section">
            <h3>전체 출퇴근 내역</h3>
            {loading ? (
              <p className="loading">⏳ 로딩 중...</p>
            ) : allAttendance.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>사원번호</th>
                    <th>출근 시간</th>
                    <th>퇴근 시간</th>
                    <th>상태</th>
                    <th>초과 근무(시간)</th>
                  </tr>
                </thead>
                <tbody>
                  {allAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{employeeId}</td>
                      <td>{record.checkInTime || "출근 전"}</td>
                      <td>{record.checkOutTime || "퇴근 전"}</td>
                      <td>{statusTextMap[record?.status] || ""}</td>
                      <td>{record.overtimeHours || "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>📌 출근 기록이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default MyAttendancePage;
