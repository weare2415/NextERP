import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPendingEmployees, approveEmployee, rejectEmployee, getDepartments, getPositions } from "../api/employeeApi";
import ApprovalStatus from "../components/ApprovalStatus";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/ApprovalStatusPage.scss";
import Pagination from "../../../common/component/Pagination";

const ApprovalStatusPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const id = useSelector((state) => state.loginSlice.id);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [paginatedRequests, setPaginatedRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ 승인 요청한 모든 직원 목록 가져오기
  const fetchApprovalRequests = async () => {
    try {
      const response = await getPendingEmployees();
      console.log("📌 승인 요청한 직원 목록:", response);
      setPendingRequests(response);
      setTotalPages(Math.ceil(response.length / itemsPerPage));
    } catch (error) {
      console.error("❌ 승인 요청 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedRequests(pendingRequests.slice(startIndex, endIndex));
  }, [currentPage, pendingRequests, itemsPerPage]);

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
    <BasicLayout>
      <div className="approval-page-container">
        <div className="page-header">
          <h1>사원 수정 승인</h1>
        </div>
        <ApprovalStatus
          pendingRequests={paginatedRequests}
          getDepartmentName={getDepartmentName}
          getPositionTitle={getPositionTitle}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default ApprovalStatusPage;