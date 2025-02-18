import React from "react";
import "../scss/ApprovalList.scss";

const ApprovalList = ({ requests, statusMap, onApprove, onReject }) => {
  return (
    <div className="approval-list-wrapper">
      <div className="approval-list-section">
        <table className="approval-list-grid">
          <thead>
            <tr>
              <th>사원 번호</th>
              <th>신청 사원명</th>
              <th>신청 유형</th>
              <th>신청 날짜</th>
              <th>신청 사유</th>
              <th>승인 관리</th>
            </tr>
          </thead>
          <tbody>
            {requests && requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employeeId}</td>
                  <td>{request.employeeName}</td>
                  <td>{statusMap[request.status] || request.status}</td>
                  <td>{request.date}</td>
                  <td>{request.approvalReason}</td>
                  <td>
                    <button
                      className="approval-table-approve-btn"
                      onClick={() => onApprove(request.id)}
                    >
                      승인
                    </button>
                    <button
                      className="approval-table-reject-btn"
                      onClick={() => onReject(request.id)}
                    >
                      반려
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-message">
                  승인 대기 요청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalList;
