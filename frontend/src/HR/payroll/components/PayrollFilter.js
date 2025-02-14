import React, { useState } from "react";
import {getEmployeeByName} from '../../../common/member/api/memberApi';
import {fetchEmployeeSalaryById} from '../api/payrollApi';
import './scss/PayrollFilter.css'

const PayrollFilter = ({ setPayrolls }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = async () => {
		try {
			let payrollData = [];

			//직원 이름으로 직원 목록 가져오기
			const employees = await getEmployeeByName(searchTerm);

			//직원 정보가 있을 경우 급여 정보 가져오기
			if (Array.isArray(employees) && employees.length > 0) {
				payrollData = await Promise.all(
						employees.map(async (employee) => {
							try {
								const salaryInfo = await fetchEmployeeSalaryById(employee.id);
								return { ...salaryInfo, employeeName: employee.name };
							} catch (error) {
								console.error(`급여 정보 불러오기 실패 (ID: ${employee.id}):`, error);
								return null;
							}
						})
				);

				//null 값 필터링 (오류로 인해 실패한 데이터 제외)
				payrollData = payrollData.filter((data) => data !== null);
			}

			setPayrolls(payrollData);
		} catch (error) {
			setPayrolls([]);
		}
	};

	return (
			<div className="payroll-filter">
				<input
						type="text"
						placeholder="직원 이름 검색"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button onClick={handleSearch}>검색</button>
			</div>
	);
};

export default PayrollFilter;