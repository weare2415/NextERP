import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAttendanceByEmployee } from "../api/attendanceApi";
import MySearchAttendance from "../components/MySearchAttendance";
import MyAttendanceRequestList from "../components/MyAttendanceRequestList";
import RequestAttendance from "../components/RequestAttendance";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/MyAttendanceRequestPage.scss";

const MyAttendanceRequestPage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id); // 로그인한 사용자의 ID 가져오기
  const employeeName = useSelector((state) => state.loginSlice.name); // 사원명 추가
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
      const data = await getAttendanceByEmployee(employeeId); // 내 근태 기록만 가져오기
      setAttendances(data);
      setFilteredAttendances(data); // 처음에는 모든 데이터를 필터링 없이 설정
    } catch (error) {
      console.error("❌ 근태 기록 조회 실패:", error);
      alert("근태 기록을 불러오지 못했습니다.");
    }
    setLoading(false);
  };

  // 필터 업데이트 함수
  const handleFilterUpdate = (filteredData) => {
    setFilteredAttendances(filteredData);
  };

  // 근태 신청 완료 후 호출되는 함수
  const handleAttendanceRequestSuccess = (newRequest) => {
    // 사원ID와 사원명을 포함하여 새로운 근태 신청 내역을 추가
    const newAttendance = {
      ...newRequest,
      employeeId, // 사원 ID 추가
      employeeName, // 사원명 추가
    };

    setAttendances((prevAttendances) => [...prevAttendances, newAttendance]);
    setFilteredAttendances((prevAttendances) => [
      ...prevAttendances,
      newAttendance,
    ]);
  };

  return (
    <BasicLayout>
      <div className="employee-attendance-page-container">
        <div className="employee-attendance-page-header">
          <h1>My 근태 신청 조회</h1>
          <div className="employee-attendance-header-right">
            <MySearchAttendance
              setFilteredAttendances={handleFilterUpdate}
              filteredAttendances={filteredAttendances}
            />
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
          <MyAttendanceRequestList filteredAttendances={filteredAttendances} />
        )}

        {isModalOpen && (
          <RequestAttendance
            onClose={() => setIsModalOpen(false)}
            onRequestSuccess={handleAttendanceRequestSuccess} // 신청 완료 후 부모 상태 업데이트
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default MyAttendanceRequestPage;
