import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/MyAttendanceRequestPage.scss";
import { getAttendanceByEmployee } from "../api/attendanceApi";
import SearchAttendance from "../components/SearchAttendance";
import MyAttendanceRequestList from "../components/MyAttendanceRequestList";
import RequestAttendance from "../components/RequestAttendance";

const MyAttendanceRequestPage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id); // 로그인한 사용자의 ID 가져오기
  const [attendances, setAttendances] = useState([]); // 근태 기록
  const [filteredAttendances, setFilteredAttendances] = useState([]); // 필터링된 근태 기록
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  useEffect(() => {
    if (employeeId) {
      fetchAttendances(); // 직원 ID가 있을 때만 근태 기록을 불러옴
    }
  }, [employeeId]);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      console.log("현재 로그인한 사원 ID:", employeeId); // employeeId가 잘 설정되어 있는지 확인
      const data = await getAttendanceByEmployee(employeeId); // 내 근태 기록만 가져오기

      console.log("내 근태 기록:", data); // 데이터 확인

      // 근태 기록 필터링 (휴가, 병가, 재택근무만)
      const filteredData = data.filter(
        (attendance) =>
          (attendance.type === "휴가" ||
            attendance.type === "병가" ||
            attendance.type === "재택근무") &&
          attendance.employeeId === employeeId // 내 사원ID에 해당하는 데이터만 필터링
      );

      setFilteredAttendances(filteredData); // 필터링된 근태 기록만 저장
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
    }
    setLoading(false);
  };

  return (
    <BasicLayout>
      <div className="employee-attendance-page-container">
        <div className="employee-attendance-page-header">
          <h1>My 근태 신청 조회</h1>
          <div className="employee-attendance-header-right">
            <SearchAttendance />
            <button
              className="attendance-request-btn"
              onClick={() => setIsModalOpen(true)}
            >
              근태 신청
            </button>
          </div>
        </div>

        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : (
          <MyAttendanceRequestList attendances={filteredAttendances} />
        )}

        {/* 근태 신청 모달 */}
        {isModalOpen && (
          <RequestAttendance onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </BasicLayout>
  );
};

export default MyAttendanceRequestPage;
