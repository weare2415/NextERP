import React, {useEffect, useState} from 'react';
import {fetchAllEmployeeSalaries} from '../api/payrollApi';
import PayrollTable from '../components/PayrollTable';
import PayrollFilter from '../components/PayrollFilter';
import PayrollDetailModal from '../components/PayrollDetailModal';
import BasicLayout from '../../common/pages/BasicLayout';
import {Link} from 'react-router-dom';
import PayrollForm from '../components/PayrollForm';

const PayrollListPage = () => {
	const [payrolls, setPayrolls] = useState([]);
	const [selectedPayroll, setSelectedPayroll] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false)

	// 급여 데이터 불러오기
	useEffect(() => {
		fetchAllEmployeeSalaries()
				.then(data => setPayrolls(data))
				.catch(error => console.error("급여 정보 로딩 실패:", error));
	}, []);

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
				<div className="payroll-list">
					<h2>급여 정보 관리</h2>
					<PayrollFilter setPayrolls={setPayrolls}/>
					<button className="new-payroll-btn" onClick={handleFormModal}>급여 정보 추가 / 생성
					</button>
					<div className="payroll-table-container">
					<PayrollTable payrolls={payrolls}
					              onSelectPayroll={handleSelectPayroll}/>
						{isModalOpen && selectedPayroll && (
									<PayrollDetailModal payroll={selectedPayroll} onClose={() => setIsModalOpen(false)} />
						)}
					</div>
				</div>
				</div>
				{isFormModalOpen && (
						<div className="payroll-form">
						<button onClick={handleFormModal}>x</button>
							<PayrollForm/>
						</div>
				)}
			</BasicLayout>
	);
};

export default PayrollListPage;