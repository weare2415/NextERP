import React, { useEffect, useState } from "react";
import { getPendingEmployees, approveEmployee, rejectEmployee, getDepartments, getPositions } from "../api/employeeApi";
import "../scss/ApprovalStatus.scss";
import { useSelector } from "react-redux";
import BasicLayout from '../../../common/pages/BasicLayout';

const ApprovalStatus = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const id = useSelector((state) => state.loginSlice.id);

  // ✅ 승인 요청한 모든 직원 목록 가져오기
  const fetchApprovalRequests = async () => {
    try {
      const response = await getPendingEmployees();
      console.log("📌 승인 요청한 직원 목록:", response);
      setPendingRequests(response);
    } catch (error) {
      console.error("❌ 승인 요청 목록 조회 실패:", error);
    }
  };

  // ✅ 부서 및 직급 목록 가져오기
  const fetchDepartmentAndPositions = async () => {
    try {
      const deptResponse = await getDepartments();
      setDepartments(deptResponse || []);

      const posResponse = await getPositions();
      setPositions(posResponse || []);
    } catch (error) {
      console.error("❌ 부서 또는 직급 목록 조회 실패:", error);
    }
  };

  // ✅ 부서 이름 가져오기
  const getDepartmentName = (id) => {
    const department = departments.find((dept) => dept.id === id);
    return department ? department.name : "-";
  };

  // ✅ 직급 이름 가져오기
  const getPositionTitle = (id) => {
    const position = positions.find((pos) => pos.positionId === id);
    return position ? position.title : "-";
  };



 const highlightChange = (fieldName, newValue, parentValue, changedFields) => {
  if (parentValue === undefined || parentValue === null) return newValue || "-";

  const isChanged =
    changedFields &&
    typeof changedFields === "object" &&
    changedFields.hasOwnProperty(fieldName);

  console.log("🛠 highlightChange Debug:", { fieldName, newValue, parentValue, changedFields, isChanged });

  if (isChanged) {
    const updatedValue = changedFields[fieldName]?.newValue ?? newValue;

    return (
      <span style={{ color: "red", fontWeight: "bold" }}>{updatedValue}</span> // ✅ 변경된 값만 빨간색 강조
    );
  }

  return newValue;
};

  
  
  
  
  

  const handleApprove = async (employeeId) => {
    try {
      await approveEmployee(employeeId, id);
      alert("✅ 승인 완료!");
      fetchApprovalRequests();
    } catch (error) {
      alert("❌ 승인 실패");
    }
  };

  const handleReject = async (employeeId) => {
    try {
      await rejectEmployee(employeeId, id);
      alert("⛔ 반려 완료!");
      fetchApprovalRequests();
    } catch (error) {
      alert("❌ 반려 실패");
    }
  };

  useEffect(() => {
    fetchApprovalRequests();
    fetchDepartmentAndPositions();
  }, []);

  return (
    <BasicLayout> {/* ✅ BasicLayout 적용 */}
      <div className="approval-status-container">
        <h3>승인 여부</h3>
        {pendingRequests.length === 0 ? (
          <p>현재 승인 요청이 없습니다.</p>
        ) : (
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
  {pendingRequests.map((request) => {
    const parent = request.parent || {};
    const changedFields = request.changedFields || {}; // ✅ 객체 형태로 변경된 데이터 가져오기

    console.log("🔍 변경된 필드 확인:", request.id, changedFields); // ✅ 확인

    return (
      <tr key={request.id}>
        <td>{request.parentEmployeeId || "-"}</td>
        <td>{highlightChange("이름", request.name, parent.name, changedFields)}</td>
        <td>{highlightChange("생년월일", request.birthDate, parent.birthDate, changedFields)}</td>
        <td>{highlightChange("성별", request.gender ? "여성" : "남성", parent.gender ? "여성" : "남성", changedFields)}</td>
        <td>{highlightChange("전화번호", request.phone || "-", parent.phone || "-", changedFields)}</td>
        <td>{highlightChange("이메일", request.email, parent.email, changedFields)}</td>
        <td>{highlightChange("주소", request.address || "-", parent.address || "-", changedFields)}</td>
        <td>{highlightChange("부서", getDepartmentName(request.departmentId), getDepartmentName(parent.departmentId), changedFields)}</td>
        <td>{highlightChange("직급", getPositionTitle(request.positionId), getPositionTitle(parent.positionId), changedFields)}</td>
        <td>{highlightChange("입사일", request.hireDate, parent.hireDate, changedFields)}</td>
        <td>{highlightChange("퇴사 여부", request.isTerminated ? "✅ 퇴사" : "🔵 재직 중", parent.isTerminated ? "✅ 퇴사" : "🔵 재직 중", changedFields)}</td>
        <td>
          <button className="approve-btn" onClick={() => handleApprove(request.id)}>✅ 승인</button>
          <button className="reject-btn" onClick={() => handleReject(request.id)}>⛔ 반려</button>
        </td>
      </tr>
    );
  })}
</tbody>


          </table>
        )}
      </div>
    </BasicLayout>
  );
};

export default ApprovalStatus;
