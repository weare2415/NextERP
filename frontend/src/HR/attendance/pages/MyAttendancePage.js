import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  checkIn, //출근 post
  checkOut,
  getAttendancesPresentLateOffWork,
} from "../../attendance/api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import Pagination from "../../../common/component/Pagination"; //
import "../scss/MyAttendancePage.scss";

const statusTextMap = {
  PRESENT: "출근",
  LATE: "지각",
  OFF_WORK: "퇴근",
};

const MyAttendancePage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id);
  const [todayAttendance, setTodayAttendance] = useState(null); // 오늘 출근 내역 유지
  const [allAttendance, setAllAttendance] = useState([]); // 전체 출퇴근 기록
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0); //  현재 페이지
  const [size] = useState(5); //  한 페이지당 5개로 설정
  const [totalPages, setTotalPages] = useState(1); //  전체 페이지 수

  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId, page]); //  페이지 변경될 때도 실행

  const fetchAttendance = async () => {
    if (!employeeId) {
      console.warn("⚠️ 로그인한 사원 ID가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        `📢 [${employeeId}] 출근/지각/퇴근 근태 기록 요청: page=${page}, size=${size}`
      );

      const data = await getAttendancesPresentLateOffWork(page, size);
      console.log("✅ API 응답 데이터:", data);

      if (!data || !data.content) {
        console.warn("⚠️ 데이터가 존재하지 않습니다.");
        return;
      }

      // ✅ employeeId를 숫자로 변환 후 필터링
      const parsedEmployeeId = Number(employeeId);
      console.log(
        "🔍 변환된 employeeId 타입:",
        typeof parsedEmployeeId,
        parsedEmployeeId
      );

      const filteredAttendance = data.content.filter(
        (record) => record.employeeId === parsedEmployeeId
      );

      console.log("✅ 필터링된 데이터:", filteredAttendance);

      setAllAttendance(filteredAttendance);
      setTotalPages(data.totalPages);

      // ✅ 오늘 날짜의 출근 기록만 필터링
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
      const todayRecord = filteredAttendance.find(
        (record) => record.date === today
      );

      if (todayRecord) {
        setTodayAttendance(todayRecord);
      }
    } catch (error) {
      console.error(`❌ [${employeeId}] 근태 기록 조회 실패:`, error);
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
            <button
              onClick={handleCheckIn}
              disabled={todayAttendance?.checkInTime}
            >
              출근
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!todayAttendance || todayAttendance?.checkOutTime}
            >
              퇴근
            </button>
          </div>
        </div>

        <div className="page-container">
          {/* 당일 출퇴근 내역 */}
          <div className="left-section">
            <h3>당일 출퇴근 내역</h3>
            {loading ? (
              <p className="loading">⏳ 로딩 중...</p>
            ) : todayAttendance ? (
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
                    <td>{todayAttendance.date}</td>
                    <td>{employeeId}</td>
                    <td>{todayAttendance.checkInTime || "출근 전"}</td>
                    <td>{todayAttendance.checkOutTime || "퇴근 전"}</td>
                    <td>{statusTextMap[todayAttendance?.status] || ""}</td>
                    <td>{todayAttendance.overtimeHours || "0"}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>📌 출근 기록이 없습니다.</p>
            )}
          </div>

          {/*  전체 출퇴근 내역 */}
          <div className="right-section">
            <h3>전체 출퇴근 내역</h3>
            {loading ? (
              <p className="loading">⏳ 로딩 중...</p>
            ) : allAttendance.length > 0 ? (
              <>
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

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
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
