import React, { useState, useEffect, useMemo } from "react";
import Pagination from "../../../common/component/Pagination";
import "../scss/MyAttendanceWorkSick.scss";

//  근태 상태 한글 변환
const statusTextMap = {
  LEAVE: "휴가",
  SICK_LEAVE: "병가",
};

const requestStatusTextMap = {
  PENDING: "승인 대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

//  전체 휴가 개수 설정
const TOTAL_VACATION_COUNT = 12;
const ITEMS_PER_PAGE = 5; // 한 페이지당 5개 표시

const MyVacationSickList = ({ attendances }) => {
  // ✅ useMemo를 사용하여 불필요한 재계산 방지
  const combinedAttendances = useMemo(() => {
    console.log("✅ combinedAttendances 재계산됨");
    return attendances
      .filter(
        (record) => record.status === "LEAVE" || record.status === "SICK_LEAVE"
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [attendances]); // 🔥 attendances가 변경될 때만 재계산

  // 승인된 휴가 개수 카운트
  const approvedCount = useMemo(() => {
    return combinedAttendances.filter(
      (record) => record.requestStatus === "APPROVED"
    ).length;
  }, [combinedAttendances]); // ✅ 메모이제이션 적용

  // 진행률 (퍼센트 계산)
  const progressPercentage = (approvedCount / TOTAL_VACATION_COUNT) * 100;

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(0);
  const [pagedData, setPagedData] = useState([]);

  // ✅ useEffect에서 의존성을 최소화하여 무한 루프 방지
  useEffect(() => {
    console.log("📌 페이지네이션 데이터 업데이트");
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setPagedData(combinedAttendances.slice(start, end));
  }, [currentPage, combinedAttendances]); // ✅ 의존성 배열 유지

  return (
    <div className="attendance-list-section">
      <h2>휴가 & 병가 내역</h2>

      {/*  프로그레스 바 추가 */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">
          휴가 쓴 일수: {approvedCount} / {TOTAL_VACATION_COUNT}
        </p>
      </div>

      {pagedData.length > 0 ? (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>근태 유형</th>
                <th>사유</th>
                <th>승인 상태</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((record, index) => (
                <tr key={index}>
                  <td>{record.date || "날짜 없음"}</td>
                  <td>{statusTextMap[record.status] || "유형 없음"}</td>
                  <td>{record.approvalReason || "사유 없음"}</td>
                  <td
                    className={`status ${
                      record.requestStatus?.toLowerCase() || ""
                    }`}
                  >
                    {requestStatusTextMap[record.requestStatus] || "상태 없음"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(combinedAttendances.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p>📌 등록된 휴가 & 병가 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default MyVacationSickList;
