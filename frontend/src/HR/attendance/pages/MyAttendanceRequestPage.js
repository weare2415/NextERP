import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/MyAttendanceRequestPage.scss";

import {
  getVacationAndSickAttendance,
  getRemoteWorkAttendance,
} from "../api/attendanceApi";

import MyVacationSickList from "../components/MyVacationSickList";
import MyRemoteWorkList from "../components/MyRemoteWorkList ";
import RequestAttendance from "../components/RequestAttendance";

const MyAttendanceRequestPage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id);

  // ✅ 휴가 & 병가 데이터
  const [vacationSickData, setVacationSickData] = useState([]);
  const [vacationPage, setVacationPage] = useState(0);
  const [vacationTotalPages, setVacationTotalPages] = useState(1);

  // 재택근무 데이터
  const [remoteWorkData, setRemoteWorkData] = useState([]);
  const [remotePage, setRemotePage] = useState(0);
  const [remoteTotalPages, setRemoteTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 근태 신청 데이터 가져오기 (휴가 & 병가)
  const fetchVacationAndSick = async () => {
    if (!employeeId) {
      console.warn("⚠️ 로그인한 사원 ID가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        `📢 [${employeeId}] 휴가/병가 근태 기록 요청: page=${vacationPage}`
      );

      // ✅ 로그인한 사원의 ID를 API에 전달하여 해당 사원의 데이터만 조회
      const data = await getVacationAndSickAttendance(employeeId, vacationPage);
      console.log("✅ API 응답 데이터 (휴가/병가):", data);

      if (!data || !data.content) {
        console.warn("⚠️ 서버에서 데이터를 받지 못했습니다.");
        return;
      }

      // ✅ 로그인한 사원의 데이터만 필터링
      const parsedEmployeeId = Number(employeeId);
      const filteredData = data.content.filter(
        (record) => record.employeeId === parsedEmployeeId
      );

      console.log("📌 필터링된 휴가/병가 데이터:", filteredData);

      setVacationSickData(filteredData);
      setVacationTotalPages(data.totalPages);
    } catch (error) {
      console.error(`❌ [${employeeId}] 휴가/병가 기록 조회 실패:`, error);
    }
    setLoading(false);
  };

  //  근태 신청 데이터 가져오기 (재택근무)
  const fetchRemoteWork = async () => {
    if (!employeeId) {
      console.warn("⚠️ 로그인한 사원 ID가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        `📢 [${employeeId}] 재택근무 근태 기록 요청: page=${remotePage}`
      );

      // ✅ 로그인한 사원의 ID를 API에 전달하여 해당 사원의 데이터만 조회
      const data = await getRemoteWorkAttendance(employeeId, remotePage);
      console.log("✅ API 응답 데이터 (재택근무):", data);

      if (!data || !data.content) {
        console.warn("⚠️ 서버에서 데이터를 받지 못했습니다.");
        return;
      }

      // ✅ 로그인한 사원의 데이터만 필터링
      const parsedEmployeeId = Number(employeeId);
      const filteredData = data.content.filter(
        (record) => record.employeeId === parsedEmployeeId
      );

      console.log("📌 필터링된 재택근무 데이터:", filteredData);

      setRemoteWorkData(filteredData);
      setRemoteTotalPages(data.totalPages);
    } catch (error) {
      console.error(`❌ [${employeeId}] 재택근무 기록 조회 실패:`, error);
    }
    setLoading(false);
  };

  //  초기 데이터 로드 + 페이지 변경 시 실행
  useEffect(() => {
    if (employeeId) {
      fetchVacationAndSick();
      fetchRemoteWork();
    }
  }, [employeeId, vacationPage, remotePage]);

  // 신청 후 모달이 닫힐 때 자동으로 데이터 갱신
  useEffect(() => {
    if (!isModalOpen) {
      console.log("✅ 모달이 닫힌 후 데이터 갱신");
      fetchVacationAndSick();
      fetchRemoteWork();
    }
  }, [isModalOpen]);

  return (
    <BasicLayout>
      <div className="attendance-request-page">
        <div className="header-section">
          <h1>My 근태 신청</h1>
          <button
            className="attendance-request-btn"
            onClick={() => setIsModalOpen(true)}
          >
            근태 신청
          </button>
        </div>

        {loading ? (
          <p className="loading-text">⏳ 로딩 중...</p>
        ) : (
          <>
            <div className="attendance-lists">
              {/*  휴가 & 병가 리스트 */}
              <MyVacationSickList
                attendances={vacationSickData}
                currentPage={vacationPage}
                totalPages={vacationTotalPages}
                onPageChange={setVacationPage}
              />

              {/* 재택근무 리스트 */}
              <MyRemoteWorkList
                attendances={remoteWorkData}
                currentPage={remotePage}
                totalPages={remoteTotalPages}
                onPageChange={setRemotePage}
              />
            </div>
          </>
        )}

        {isModalOpen && (
          <RequestAttendance onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </BasicLayout>
  );
};

export default MyAttendanceRequestPage;
