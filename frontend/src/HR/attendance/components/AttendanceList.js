import React, { useEffect, useState } from "react";
import Pagination from "../../../common/component/Pagination";
import "../scss/AttendanceList.scss";

const AttendanceList = ({
  attendances,
  totalPages,
  currentPage,
  onPageChange,
  onRequestApproval,
}) => {
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  useEffect(() => {
    setFilteredAttendances(attendances);
  }, [attendances]);

  return (
    <div className="attendance-list-wrapper">
      <div className="attendance-table-section">
        <table>
          <thead>
            <tr>
              <th>사원 ID</th>
              <th>사원명</th>
              <th>날짜</th>
              <th>출근 시간</th>
              <th>퇴근 시간</th>
              <th>현재 상태</th>
              <th>초과 근무 (시간)</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendances.length > 0 ? (
              filteredAttendances.map((attendance) => (
                <tr key={attendance.id}>
                  <td>{attendance.employeeId}</td>
                  <td>{attendance.employeeName}</td>
                  <td>{attendance.date}</td>
                  <td>{attendance.checkInTime || "N/A"}</td>
                  <td>{attendance.checkOutTime || "N/A"}</td>
                  <td>
                    {(() => {
                      const statusMap = {
                        PRESENT: "출근",
                        OFF_WORK: "퇴근",
                        LATE: "지각",
                      };
                      return statusMap[attendance.status] || "기타";
                    })()}
                  </td>
                  <td>{attendance.overtimeHours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">근태 기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default AttendanceList;
