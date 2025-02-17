import React from "react";
import "../../attendance/scss/MyAttendanceList.scss";

const statusTextMap = {
  PRESENT: "출근",
  LATE: "지각",
  OFF_WORK: "퇴근",
};

const MyAttendanceList = ({ attendanceRecords, loading, title }) => {
  return (
    <div className="attendance-section">
      <h3>{title}</h3>
      {loading ? (
        <p className="loading">⏳ 로딩 중...</p>
      ) : attendanceRecords.length > 0 ? (
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
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.employeeId}</td>
                <td>{record.checkInTime || "출근 전"}</td>
                <td>{record.checkOutTime || "퇴근 전"}</td>
                <td>{statusTextMap[record.status] || ""}</td>
                <td>{record.overtimeHours || "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>📌 출근 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default MyAttendanceList;
