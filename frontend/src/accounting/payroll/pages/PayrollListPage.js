import React, {useEffect, useState} from 'react';
import {fetchAllEmployeeSalaries} from '../api/payrollApi';
import PayrollTable from '../components/PayrollTable';
import PayrollFilter from '../components/PayrollFilter';
import PayrollDetailModal from '../components/PayrollDetailModal';
import BasicLayout from '../../../common/pages/BasicLayout';
import "./PayrollListPage.scss";
import PayrollForm from '../components/PayrollForm';
import Pagination from '../../../common/component/Pagination';


const PayrollListPage = () => {
	const [payrolls, setPayrolls] = useState([]);
	const [selectedPayroll, setSelectedPayroll] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	// 급여 데이터 불러오기
	useEffect(() => {
		fetchEmployeeSal(page)
	}, [page]);

	const fetchEmployeeSal = async (page) => {
		try{
			const response = await fetchAllEmployeeSalaries(page, size);
			setPayrolls(response.content || []);
			setTotalPages(response.totalPages);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
  
	const handleSelectPayroll = (payroll) => {
	  setSelectedPayroll(payroll);
	  setIsModalOpen(true);
	};

	const handleFormModal = () => {
		setIsFormModalOpen(!isFormModalOpen);
	}
  
	return (
	  <BasicLayout>
		<div className="payroll-page">
		  <div className="page-header">
			<h1>급여 정보 관리</h1>
			<div className="header-right">
			<PayrollFilter setPayrolls={setPayrolls} />
			<button
			  className="new-payroll-btn"
			  onClick={handleFormModal}
			>
			  급여 정보 추가 / 생성
			</button>
			</div>
		  </div>
		  <div className="payroll-table-container">
		  {payrolls.length === 0 ? (
            <p>내역이 없습니다.</p>
          ) : (
            <PayrollTable
              payrolls={payrolls}
              onSelectPayroll={handleSelectPayroll}
            />
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
          {isModalOpen && selectedPayroll && (
            <PayrollDetailModal
              payroll={selectedPayroll}
              onClose={() => setIsModalOpen(false)}
            />
          )}
			</div>
		  </div>
			{isFormModalOpen && (
					<div className="modal-overlay">
						<button onClick={handleFormModal}>x</button>
						<PayrollForm/>
					</div>
			)}
		</BasicLayout>
	);
  };
  
  export default PayrollListPage;
  