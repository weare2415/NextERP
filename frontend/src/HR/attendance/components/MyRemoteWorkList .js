import React from "react";
import Pagination from "../../../common/component/Pagination";
import "../scss/MyAttendanceWorkSick.scss";

// 근태 유형을 한국어로 변환하는 매핑 객체
const statusTextMap = {
  REMOTE_WORK: "재택근무",
};

const requestStatusTextMap = {
  PENDING: "승인 대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

const MyRemoteWorkList = ({
  attendances,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  //  재택근무(`REMOTE_WORK`)만 필터링
  const filteredAttendances = attendances.filter(
    (record) => record.status === "REMOTE_WORK"
  );

  return (
    <div className="attendance-list-section">
      <h2>재택근무 내역</h2>
      {filteredAttendances.length > 0 ? (
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
              {filteredAttendances.map((record, index) => (
                <tr key={index}>
                  <td>{record.date || "날짜 없음"}</td>
                  <td>{statusTextMap[record.status] || "유형 없음"}</td>{" "}
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
        <p>📌 등록된 재택근무 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default MyRemoteWorkList;
