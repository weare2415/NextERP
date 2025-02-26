import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/MyAttendanceRequestPage.scss";

import {
  getVacationAndSickAttendance,
  getRemoteWorkAttendance,
  getApprovedAttendances,
} from "../api/attendanceApi";

import MyVacationSickList from "../components/MyVacationSickList";
import MyRemoteWorkList from "../components/MyRemoteWorkList ";
import RequestAttendance from "../components/RequestAttendance";

const MyAttendanceRequestPage = () => {
  const employeeId = useSelector((state) => state.loginSlice.id);

  // 휴가 & 병가 데이터
  const [vacationSickData, setVacationSickData] = useState([]);
  const [vacationPage, setVacationPage] = useState(0);
  const [vacationTotalPages, setVacationTotalPages] = useState(1);
  const [totalApprovedCount, setTotalApprovedCount] = useState(0); // 전체 승인 건수 저장

  // 재택근무 데이터
  const [remoteWorkData, setRemoteWorkData] = useState([]);
  const [remotePage, setRemotePage] = useState(0);
  const [remoteTotalPages, setRemoteTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 휴가 & 병가 데이터 가져오기
  const fetchVacationAndSick = async () => {
    if (!employeeId) {
      console.warn("⚠️ 로그인한 사원 ID가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      // 1. 승인된 모든 근태 기록을 가져옵니다 (size를 크게 설정)
      const allApprovedData = await getApprovedAttendances(0, 1000);

      // 2. "LEAVE" 상태이면서 "APPROVED" 상태인 것만 필터링하여 카운트
      const approvedLeaves = allApprovedData.content.filter((record) => {
        const isLeaveApproved =
          record.status === "LEAVE" && record.requestStatus === "APPROVED";
        const isCurrentEmployee =
          String(record.employeeId) === String(employeeId); // employeeId 타입을 문자열로 변환하여 비교

        // 콘솔로 확인
        console.log(
          `📈 record: ${record.date} - ${record.status} - ${
            record.requestStatus
          } - ${record.employeeId} (필터링: ${
            isLeaveApproved && isCurrentEmployee
          })`
        );

        return isLeaveApproved && isCurrentEmployee;
      });

      // 3. 승인된 휴가 개수 출력
      const totalApproved = approvedLeaves.length;
      console.log(`📊 승인된 휴가 총 개수: ${totalApproved}`);

      // 4. 현재 페이지의 휴가/병가 데이터 가져오기
      const currentPageData = await getVacationAndSickAttendance(
        employeeId,
        vacationPage
      );

      // 실제로 데이터를 화면에 표시
      setVacationSickData(currentPageData.content);
      setVacationTotalPages(currentPageData.totalPages);

      // 5. 승인된 휴가만 카운팅한 값을 사용
      setTotalApprovedCount(totalApproved); // 여기에서 승인된 휴가일수만 카운트하여 사용
    } catch (error) {
      console.error(`❌ [${employeeId}] 휴가/병가 기록 조회 실패:`, error);
    }
    setLoading(false);
  };

  // 재택근무 데이터 가져오기
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
      const data = await getRemoteWorkAttendance(employeeId, remotePage);

      console.log("✅ API 응답 데이터 (재택근무):", data);

      if (!data || !data.content) {
        console.warn("⚠️ 서버에서 데이터를 받지 못했습니다.");
        setRemoteWorkData([]);
        setRemoteTotalPages(1);
        return;
      }

      setRemoteWorkData(data.content);
      setRemoteTotalPages(data.totalPages);
    } catch (error) {
      console.error(`❌ [${employeeId}] 재택근무 기록 조회 실패:`, error);
    }
    setLoading(false);
  };

  // 초기 데이터 로드 및 페이지 변경 시 실행
  useEffect(() => {
    if (employeeId) {
      fetchVacationAndSick();
      fetchRemoteWork();
    }
  }, [employeeId, vacationPage, remotePage]);

  // 신청 후 모달이 닫힐 때 데이터 갱신
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
          <h1>근태 신청</h1>
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
          <div className="attendance-lists">
            <MyVacationSickList
              attendances={vacationSickData}
              currentPage={vacationPage}
              totalPages={vacationTotalPages}
              totalApprovedCount={totalApprovedCount} // 전체 승인된 휴가 일수 전달
              onPageChange={setVacationPage}
            />

            <MyRemoteWorkList
              attendances={remoteWorkData}
              currentPage={remotePage}
              totalPages={remoteTotalPages}
              onPageChange={setRemotePage}
            />
          </div>
        )}

        {isModalOpen && (
          <RequestAttendance onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </BasicLayout>
  );
};

export default MyAttendanceRequestPage;
