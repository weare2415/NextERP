import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // ✅ Redux에서 로그인 정보 가져오기
import { checkIn, checkOut, getAttendanceByEmployee } from "../../attendance/api/attendanceApi";
import BasicLayout from '../../../common/pages/BasicLayout'; // ✅ 경로 수정

const MyPage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id); // ✅ 로그인한 사용자의 ID 가져오기
  const [attendance, setAttendance] = useState(null); // 근태 기록 저장
  const [loading, setLoading] = useState(false);

  // ✅ 직원의 근태 기록 조회
  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await getAttendanceByEmployee(employeeId);
      if (data.length > 0) {
        setAttendance(data[0]); // 오늘 출근 기록이 있으면 설정
      } else {
        setAttendance(null); // 출근 기록이 없으면 초기화
      }
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  // ✅ 출근 버튼 클릭
  const handleCheckIn = async () => {
    try {
      await checkIn(employeeId);
      alert("출근 완료!");
      fetchAttendance(); // 출근 후 다시 데이터 불러오기
    } catch (error) {
      alert("출근 실패: " + error.response?.data?.message || error.message);
    }
  };

  // ✅ 퇴근 버튼 클릭
  const handleCheckOut = async () => {
    try {
      await checkOut(employeeId);
      alert("퇴근 완료!");
      fetchAttendance(); // 퇴근 후 다시 데이터 불러오기
    } catch (error) {
      alert("퇴근 실패: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <BasicLayout>
      <div className="mypage">
        <h2>마이페이지 (출퇴근 관리)</h2>

        {/* 로그인한 사용자의 ID 확인 */}
        <p><strong>사원 ID:</strong> {employeeId || "로그인이 필요합니다."}</p>

        {/* 출근 / 퇴근 버튼 */}
        <div className="buttons">
          <button onClick={handleCheckIn} disabled={attendance && attendance.checkInTime}>
            출근
          </button>
          <button onClick={handleCheckOut} disabled={!attendance || attendance.checkOutTime}>
            퇴근
          </button>
        </div>

        {/* 근태 정보 표시 */}
        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : attendance ? (
          <div className="attendance-info">
            <p><strong>출근 시간:</strong> {attendance.checkInTime || "출근 전"}</p>
            <p><strong>퇴근 시간:</strong> {attendance.checkOutTime || "퇴근 전"}</p>
            <p><strong>상태:</strong> {attendance.status}</p>
          </div>
        ) : (
          <p>📌 출근 기록이 없습니다.</p>
        )}
      </div>
    </BasicLayout>
  );
};

export default MyPage;
