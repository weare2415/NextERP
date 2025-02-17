import React, { useEffect, useState } from "react";
import { getAllAttendances } from "../api/attendanceApi";
import SearchAttendance from "./SearchAttendance";
import "../scss/AttendanceList.scss";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const allData = await getAllAttendances();
      setAttendances(allData);
      setFilteredAttendances(allData);
    } catch (error) {
      console.error("근태 기록 조회 실패:", error);
      alert("근태 기록을 불러오지 못했습니다.");
    }
  };

  return (
    <div className="attendance-list-wrapper">
      <SearchAttendance setFilteredAttendances={setFilteredAttendances} />
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
              <tr key={attendance.id} className="clickable-row">
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
                      LEAVE: "휴가",
                      SICK_LEAVE: "병가",
                      REMOTE_WORK: "재택근무",
                    };
                    return statusMap[attendance.status] || "기타";
                  })()}
                </td>
                <td>{attendance.overtimeHours}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">근태 기록이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AttendanceList;
