import React, { useEffect, useState } from "react";
import { getAllAttendances } from "../api/attendanceApi";
import SearchAttendance from "./SearchAttendance";
import Pagination from "../../../common/component/Pagination"; // ✅ 페이징 컴포넌트 추가
import "../scss/AttendanceList.scss";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 페이징 상태 추가
  const [page, setPage] = useState(0); // 현재 페이지
  const [size] = useState(10); // 한 페이지당 항목 수 (기본값: 10)
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  useEffect(() => {
    fetchAttendanceRecords(page);
  }, [page]); // ✅ 페이지 변경 시 API 호출

  // ✅ 페이징된 근태 목록 가져오기
  const fetchAttendanceRecords = async (currentPage) => {
    try {
      setLoading(true);
      const data = await getAllAttendances(currentPage, size); // ✅ 페이지 & 사이즈 전달
      setAttendances(data.content);
      setFilteredAttendances(data.content);
      setTotalPages(data.totalPages);
      console.log("📌 서버 응답 데이터:", data);
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
      setError("근태 기록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-list-wrapper">
      <SearchAttendance setFilteredAttendances={setFilteredAttendances} />

      {loading && <p>⏳ 데이터 불러오는 중...</p>}
      {error && <p className="error-message">{error}</p>}

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

      {/* ✅ 페이징 적용 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AttendanceList;
