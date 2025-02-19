import React from "react";
import "../scss/ApprovalStatus.scss";

const ApprovalStatus = ({
  pendingRequests, //  ApprovalStatusPage에서 전달받음
  getDepartmentName,
  getPositionTitle,
  onApprove,
  onReject,
}) => {
  return (
    <div className="approval-list-wrapper">
      <div className="approval-table-section">
        <table className="approval-table">
          <thead>
            <tr>
              <th>사원 번호</th>
              <th>이름</th>
              <th>생년월일</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>주소</th>
              <th>부서</th>
              <th>직급</th>
              <th>퇴사 여부</th>
              <th>승인/반려</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.name}</td>
                  <td>{request.birthDate}</td>
                  <td>{request.phone || "-"}</td>
                  <td>{request.email}</td>
                  <td>{request.address || "-"}</td>
                  <td>
                    {request.departmentName ||
                      getDepartmentName(request.departmentId)}
                  </td>
                  <td>
                    {request.positionTitle ||
                      getPositionTitle(request.positionId)}
                  </td>
                  <td>{request.isTerminated ? "✅ 퇴사" : "🔵 재직 중"}</td>
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
                <td
                  colSpan="10"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  현재 승인 요청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalStatus;
