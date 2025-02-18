import React, { useState, useEffect } from "react";
import {getEmployeeById} from '../../../HR/employee/api/employeeApi';
import "./scss/PayrollTable.scss";
import Pagination from "../../../common/component/Pagination";
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const PayrollTable = ({ payrolls, onSelectPayroll }) => {
  const employeeNames = useEmployeeNames(payrolls);
  
	return (
			<div className="payroll-table-wrapper">
				<div className="payroll-table-section">
					<table>
						<thead>
						<tr>
							<th>직원명</th>
							<th>사원번호</th>
							<th>연봉</th>
							<th>월급</th>
							<th>적용 시작일</th>
							<th>상세</th>
						</tr>
						</thead>
						<tbody>
						{payrolls.map((payroll) => {
							const monthlyDeduction = payroll.deductions / 12;
							const monthlySalary = (payroll.baseSalary / 12) - monthlyDeduction;
							return (
									<tr key={payroll.id}>
										<td>{employeeNames[payroll.employeeId] || "로딩 중..."}</td>
										<td>{payroll.employeeId}</td>
										<td>{payroll.baseSalary.toLocaleString()}원</td>
										<td>{Math.round(monthlySalary).toLocaleString()}원</td>
										<td>{payroll.effectiveDate}</td>
										<td>
											<button className="payroll-detail-btn" onClick={() => onSelectPayroll(payroll)}>🔍</button>
										</td>
									</tr>
							);
						})}
						</tbody>
					</table>
				</div>
			</div>
	);
};


export default PayrollTable;
  