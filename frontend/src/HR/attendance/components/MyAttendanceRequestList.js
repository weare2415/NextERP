import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAttendanceByEmployee } from "../api/attendanceApi";
import Pagination from "../../../common/component/Pagination";
import "../scss/MyAttendanceRequestList.scss";

const MyAttendanceRequestList = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Redux에서 로그인한 사용자의 ID 가져오기
  const employeeId = useSelector((state) => state.loginSlice.id);

  useEffect(() => {
    if (employeeId) {
      fetchAttendanceRecords(employeeId);
    } else {
      console.error("❌ 로그인된 사원 ID를 찾을 수 없습니다.");
      alert("로그인된 사원 ID를 찾을 수 없습니다.");
    }
  }, [employeeId]);

  const fetchAttendanceRecords = async (employeeId) => {
    try {
      const data = await getAttendanceByEmployee(employeeId);
      console.log("📌 가져온 근태 데이터:", data);

      // ✅ 출퇴근 상태도 포함하도록 필터 수정
      const validStatuses = [
        "PRESENT", // 출근
        "OFF_WORK", // 퇴근
        "LATE", // 지각
        "LEAVE", // 휴가
        "SICK_LEAVE", // 병가
        "REMOTE_WORK", // 재택근무
      ];

      const filteredData = data.filter((attendance) =>
        validStatuses.includes(attendance.status)
      );

      setAttendances(data);
      setFilteredAttendances(filteredData);
    } catch (error) {
      console.error(`❌ 직원 근태 기록 조회 실패 (ID: ${employeeId}):`, error);
      alert("근태 기록을 불러오지 못했습니다.");
    }
  };

  const paginate = (data, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

  const paginatedAttendances = paginate(
    filteredAttendances,
    currentPage,
    pageSize
  );

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
            {paginatedAttendances.length > 0 ? (
              paginatedAttendances.map((attendance) => (
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

      <Pagination
        currentPage={currentPage}
        totalItems={filteredAttendances.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MyAttendanceRequestList;
