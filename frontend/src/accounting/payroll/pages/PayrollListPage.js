import React, { useEffect, useState } from "react";
import { fetchAllEmployeeSalaries } from "../api/payrollApi";
import PayrollTable from "../components/PayrollTable";
import PayrollFilter from "../components/PayrollFilter";
import PayrollDetailModal from "../components/PayrollDetailModal";
import BasicLayout from "../../../common/pages/BasicLayout";
import "./PayrollListPage.scss";
import EmployeeSalaryModal from "../components/EmployeeSalaryModal";
import Pagination from "../../../common/component/Pagination";

const PayrollListPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 급여 데이터 불러오기
  useEffect(() => {
    fetchEmployeeSal(page);
  }, [page]);

  const fetchEmployeeSal = async (page) => {
    try {
      const response = await fetchAllEmployeeSalaries(page, size);
      setPayrolls(response.content || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleSelectPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  return (
    <BasicLayout>
      <div className="payroll-page-container">
        <div className="payroll-page-header">
          <h1>급여 관리</h1>
          <div className="header-right">
            <PayrollFilter setPayrolls={setPayrolls} />
            {/* 신규 급여 정보 생성을 위한 모달 호출 버튼 */}
            <button
              className="new-payroll-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + 급여 추가
            </button>
          </div>
        </div>
        <PayrollTable
          payrolls={payrolls}
          onSelectPayroll={handleSelectPayroll}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        {isDetailModalOpen && selectedPayroll && (
          <PayrollDetailModal
            payroll={selectedPayroll}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}

        {isCreateModalOpen && (
          <EmployeeSalaryModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              // 저장 후 현재 페이지의 데이터 재조회
              fetchEmployeeSal(page);
            }}
          />
        )}
      </div>
    </BasicLayout>
  );
};

export default PayrollListPage;
