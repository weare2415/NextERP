import React, { useEffect } from "react";
import "../scss/RequestHistory.scss";

const RequestHistory = ({ requests, title }) => {
  useEffect(() => {
    console.log("📌 전달된 requests 데이터:", requests);
  }, [requests]);

  return (
    <div className="history-list-wrapper">
      <div className="history-table-section">
        <h3>{title}</h3>
        <table className="history-grid">
          <thead>
            <tr>
              <th>사원ID</th>
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
                  <td>{request.employeeId}</td>
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
                      className={`status-label ${
                        request.requestStatus
                          ? request.requestStatus.toLowerCase()
                          : "default"
                      }`}
                    >
                      {request.requestStatus === "PENDING"
                        ? "승인 대기"
                        : request.requestStatus === "APPROVED"
                        ? "승인됨"
                        : request.requestStatus === "REJECTED"
                        ? "거부됨"
                        : "상태 없음"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">신청 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestHistory;
