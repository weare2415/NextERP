import React from "react";
import "../scss/MyAttendanceRequestList.scss";

const MyAttendanceRequestList = ({ filteredAttendances }) => {
  return (
    <div className="attendance-list-wrapper">
      <div className="attendance-table-section">
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>사원 ID</th>
              <th>사원명</th>
              <th>출근 시간</th>
              <th>퇴근 시간</th>
              <th>현재 상태</th>
              <th>초과 근무 (시간)</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendances.length > 0 ? (
              filteredAttendances.map((attendance) => (
                <tr key={attendance.id} className="clickable-row">
                  <td>{attendance.date}</td>
                  <td>{attendance.employeeId}</td>
                  <td>{attendance.employeeName}</td>
                  <td>{attendance.checkInTime || "N/A"}</td>
                  <td>{attendance.checkOutTime || "N/A"}</td>
                  <td>
                    {(() => {
                      const statusMap = {
                        PRESENT: "출근",
                        OFF_WORK: "퇴근",
                        LATE: "지각",
                        LEAVE: "휴가",
                        SICK_LEAVE: "병가",
                        REMOTE_WORK: "재택근무",
                      };
                      return statusMap[attendance.status] || "알 수 없음";
                    })()}
                  </td>
                  <td>{attendance.overtimeHours || "0"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">📌 근태 기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendanceRequestList;
