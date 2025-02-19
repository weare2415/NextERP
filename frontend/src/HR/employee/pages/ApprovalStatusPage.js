import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getPendingEmployees,
  approveEmployee,
  rejectEmployee,
  getDepartments,
  getPositions,
} from "../api/employeeApi";
import ApprovalStatus from "../components/ApprovalStatus";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/ApprovalStatusPage.scss";
import Pagination from "../../../common/component/Pagination";

const ApprovalStatusPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // 승인 요청 목록
  const [departments, setDepartments] = useState([]); // 부서 목록
  const [positions, setPositions] = useState([]); // 직급 목록
  const id = useSelector((state) => state.loginSlice.id); // 로그인한 사용자 ID

  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (백엔드는 0부터 시작)
  const itemsPerPage = 10; // 한 페이지당 직원 수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  //  승인 요청한 모든 직원 목록 가져오기 (백엔드 페이징 적용)
  const fetchApprovalRequests = async (page = 0) => {
    try {
      const response = await getPendingEmployees(page, itemsPerPage);
      console.log("📌 승인 요청한 직원 목록:", response);

      if (response && response.content) {
        setPendingRequests(response.content);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(page);
      } else {
        console.error("❌ 응답 데이터 구조 이상:", response);
        setPendingRequests([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ 승인 요청 목록 조회 실패:", error);
      setPendingRequests([]);
      setTotalPages(1);
    }
  };

  // 부서 및 직급 목록 가져오기
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

  //  부서 이름 가져오기
  const getDepartmentName = (id) => {
    const department = departments.find((dept) => dept.id === id);
    return department ? department.name : "-";
  };

  //  직급 이름 가져오기
  const getPositionTitle = (id) => {
    const position = positions.find((pos) => pos.positionId === id);
    return position ? position.title : "-";
  };

  //  승인 처리
  const handleApprove = async (employeeId) => {
    try {
      await approveEmployee(employeeId, id);
      alert("✅ 승인 완료!");
      fetchApprovalRequests(currentPage); // 승인 후 목록 갱신
    } catch (error) {
      alert("❌ 승인 실패");
    }
  };

  //  반려 처리
  const handleReject = async (employeeId) => {
    try {
      await rejectEmployee(employeeId, id);
      alert("⛔ 반려 완료!");
      fetchApprovalRequests(currentPage); // 반려 후 목록 갱신
    } catch (error) {
      alert("❌ 반려 실패");
    }
  };

  useEffect(() => {
    fetchApprovalRequests(currentPage);
    fetchDepartmentAndPositions();
  }, []);

  return (
    <BasicLayout>
      <div className="approval-page-container">
        <div className="page-header">
          <h1>사원 수정 승인</h1>
        </div>

        <ApprovalStatus
          pendingRequests={pendingRequests}
          getDepartmentName={getDepartmentName}
          getPositionTitle={getPositionTitle}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchApprovalRequests} // 페이지 변경 시 API 호출
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default ApprovalStatusPage;
