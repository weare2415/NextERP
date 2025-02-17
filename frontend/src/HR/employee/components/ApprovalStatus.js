import React, { useState } from "react";
import "../scss/ApprovalStatus.scss";
import Pagination from "../../../common/component/Pagination";

const ApprovalStatus = ({
  pendingRequests,
  getDepartmentName,
  getPositionTitle,
  onApprove,
  onReject,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const paginate = (data, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

  const paginatedRequests = paginate(pendingRequests, currentPage, pageSize);

  const highlightChange = (fieldName, newValue, parentValue, changedFields) => {
    if (parentValue === undefined || parentValue === null)
      return newValue || "-";

    const isChanged =
      changedFields &&
      typeof changedFields === "object" &&
      changedFields.hasOwnProperty(fieldName);

    console.log("🛠 highlightChange Debug:", {
      fieldName,
      newValue,
      parentValue,
      changedFields,
      isChanged,
    });

    if (isChanged) {
      const updatedValue = changedFields[fieldName]?.newValue ?? newValue;
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>{updatedValue}</span>
      );
    }

    return newValue;
  };

  return (
    <div className="approval-list-wrapper">
      <div className="approval-table-section">
        <table className="approval-table">
          <thead>
            <tr>
              <th>사원 번호</th>
              <th>이름</th>
              <th>생년월일</th>
              <th>성별</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>주소</th>
              <th>부서</th>
              <th>직급</th>
              <th>입사일</th>
              <th>퇴사 여부</th>
              <th>승인/반려</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan="12"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  현재 승인 요청이 없습니다.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((request) => {
                const parent = request.parent || {};
                const changedFields = request.changedFields || {};

                return (
                  <tr key={request.id}>
                    <td>{request.parentEmployeeId || "-"}</td>
                    <td>
                      {highlightChange(
                        "이름",
                        request.name,
                        parent.name,
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "생년월일",
                        request.birthDate,
                        parent.birthDate,
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "성별",
                        request.gender ? "여성" : "남성",
                        parent.gender ? "여성" : "남성",
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "전화번호",
                        request.phone || "-",
                        parent.phone || "-",
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "이메일",
                        request.email,
                        parent.email,
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "주소",
                        request.address || "-",
                        parent.address || "-",
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "부서",
                        getDepartmentName(request.departmentId),
                        getDepartmentName(parent.departmentId),
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "직급",
                        getPositionTitle(request.positionId),
                        getPositionTitle(parent.positionId),
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "입사일",
                        request.hireDate,
                        parent.hireDate,
                        changedFields
                      )}
                    </td>
                    <td>
                      {highlightChange(
                        "퇴사 여부",
                        request.isTerminated ? "✅ 퇴사" : "🔵 재직 중",
                        parent.isTerminated ? "✅ 퇴사" : "🔵 재직 중",
                        changedFields
                      )}
                    </td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => onApprove(request.id)}
                      >
                        ✅ 승인
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => onReject(request.id)}
                      >
                        ⛔ 반려
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination 컴포넌트 추가 */}
      <Pagination
        currentPage={currentPage}
        totalItems={pendingRequests.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ApprovalStatus;
