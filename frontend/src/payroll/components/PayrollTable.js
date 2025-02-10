import React, { useState, useEffect } from "react";
import {getEmployeeById} from '../../employee/api/employeeApi';
import "./scss/PayrollTable.css"

const PayrollTable = ({ payrolls, onSelectPayroll }) => {
	const [employeeNames, setEmployeeNames] = useState({});

	// ✅ 직원 이름 가져오기
	useEffect(() => {
		const fetchEmployeeNames = async () => {
			const employeeIds = [...new Set(payrolls.map(payroll => payroll.employeeId))]; // 중복 제거
			const employeeData = {};

			await Promise.all(employeeIds.map(async (id) => {
				try {
					const employeeInfo = await getEmployeeById(id); // API 호출
					employeeData[id] = employeeInfo.name;  // employeeId → name 매핑
				} catch (error) {
					console.error(`Error fetching employee with ID ${id}:`, error);
					employeeData[id] = "알 수 없음";  // 오류 시 기본값 설정
				}
			}));

			setEmployeeNames(employeeData);
		};

		if (payrolls.length > 0) {
			fetchEmployeeNames();
		}
	}, [payrolls]);

	return (
			<div className="payroll-table-container">
			<table className="payroll-table">
				<thead>
				<tr>
					<th>직원명</th>
					<th>사원번호</th>
					<th>기본급</th>
					<th>공제</th>
					<th>적용 시작일</th>
					<th>종료일</th>
					<th>상세</th>
				</tr>
				</thead>
				<tbody>
				{payrolls.map((payroll) => (
						<tr key={payroll.id}>
							<td>{employeeNames[payroll.employeeId] || "로딩 중..."}</td>
							<td>{payroll.employeeId}</td>
							<td>{payroll.baseSalary.toLocaleString()}원</td>
							<td>{payroll.deductions ? payroll.deductions.toLocaleString() : "0"}원</td>
							<td>{payroll.effectiveDate}</td>
							<td>{payroll.endDate || "미정"}</td>
							<td>
								<button className="detail-btn" onClick={() => onSelectPayroll(payroll)}>🔍</button>
							</td>
						</tr>
				))}
				</tbody>
			</table>
			</div>
	);
};

export default PayrollTable;