import React from "react";
import "../scss/RequestHistory.scss";

const RequestHistory = ({ requests, onApprovalRequest }) => {
  console.log("📌 전달된 requests 데이터:", requests);

  const title = requests.length > 0 && requests[0].requestStatus === "PENDING"
    ? "승인 대기 내역"
    : "승인 완료 내역";

  return (
    <div className="history-list-wrapper">
      <div className="history-table-section">
      <h3>{title}</h3>
        <table className="history-grid">
          <thead>
            <tr>
              <th>사원명</th>
              <th>신청 날짜</th>
              <th>근태 유형</th>
              <th>신청 사유</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employeeName}</td>
                  <td>{request.date}</td>
                  <td>
                    {request.status === "LEAVE"
                      ? "휴가"
                      : request.status === "SICK_LEAVE"
                      ? "병가"
                      : "재택근무"}
                  </td>
                  <td>{request.approvalReason || "N/A"}</td>
                  <td>
                    <span
                      className={`status-label ${request.requestStatus.toLowerCase()}`}
                    >
                      {request.requestStatus === "PENDING"
                        ? "승인 대기"
                        : request.requestStatus === "APPROVED"
                        ? "승인됨"
                        : "거부됨"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">신청 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestHistory;
