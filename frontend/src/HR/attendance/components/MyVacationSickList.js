import React, { useState, useEffect } from "react";
import Pagination from "../../../common/component/Pagination";
import "../scss/MyAttendanceWorkSick.scss";

// 근태 상태 한글 변환
const statusTextMap = {
  LEAVE: "휴가",
  SICK_LEAVE: "병가",
};

const requestStatusTextMap = {
  PENDING: "승인 대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 개수
const TOTAL_VACATION_COUNT = 12; // 전체 휴가 개수 설정

const MyVacationSickList = ({
  attendances,
  currentPage,
  totalPages,
  totalApprovedCount, // 전체 승인된 휴가 개수
  onPageChange,
}) => {
  // 진행률 (퍼센트 계산)
  const progressPercentage = (totalApprovedCount / TOTAL_VACATION_COUNT) * 100;

  // 페이지네이션 상태 관리
  const [pagedData, setPagedData] = useState([]);

  useEffect(() => {
    console.log(
      `📌 페이지 데이터 업데이트: currentPage=${currentPage}, totalPages=${totalPages}`
    );

    if (!attendances || attendances.length === 0) {
      setPagedData([]);
      return;
    }

    // 모든 데이터 표시
    setPagedData(attendances);
  }, [attendances, currentPage, totalPages]);

  return (
    <div className="attendance-list-section">
      <h2>휴가 & 병가 내역</h2>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">
          휴가 쓴 일수: {totalApprovedCount} / {TOTAL_VACATION_COUNT}
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
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <p>현재 등록된 휴가 및 병가 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default MyVacationSickList;
