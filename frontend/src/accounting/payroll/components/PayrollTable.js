import React, { useState, useEffect } from "react";
import {getEmployeeById} from '../../../HR/employee/api/employeeApi';
import "./scss/PayrollTable.scss";
import Pagination from "../../../common/component/Pagination";

const PayrollTable = ({ payrolls, onSelectPayroll }) => {
	const [employeeNames, setEmployeeNames] = useState({});
	const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
	const pageSize = 10; // 한 페이지에 표시할 항목 수
  
	// ✅ 직원 이름 가져오기
	useEffect(() => {
	  const fetchEmployeeNames = async () => {
		const employeeIds = [
		  ...new Set(payrolls.map((payroll) => payroll.employeeId)),
		]; // 중복 제거
		const employeeData = {};
  
		await Promise.all(
		  employeeIds.map(async (id) => {
			try {
			  const employeeInfo = await getEmployeeById(id); // API 호출
			  employeeData[id] = employeeInfo.name; // employeeId → name 매핑
			} catch (error) {
			  console.error(`Error fetching employee with ID ${id}:`, error);
			  employeeData[id] = "알 수 없음"; // 오류 시 기본값 설정
			}
		  })
		);
  
		setEmployeeNames(employeeData);
	  };
  
	  if (payrolls.length > 0) {
		fetchEmployeeNames();
	  }
	}, [payrolls]);
  
	// 페이지네이션 처리
	const paginate = (payrolls, currentPage, pageSize) => {
	  const startIndex = (currentPage - 1) * pageSize;
	  return payrolls.slice(startIndex, startIndex + pageSize);
	};
  
	const paginatedPayrolls = paginate(payrolls, currentPage, pageSize);
  
	return (
	  <div className="payroll-table-wrapper">
		<div className="payroll-table-section">
			<table>
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
			{paginatedPayrolls.length > 0 ? (
			  paginatedPayrolls.map((payroll) => (
				<tr key={payroll.id}>
				  <td>{employeeNames[payroll.employeeId] || "로딩 중..."}</td>
				  <td>{payroll.employeeId}</td>
				  <td>{payroll.baseSalary.toLocaleString()}원</td>
				  <td>
					{payroll.deductions
					  ? payroll.deductions.toLocaleString()
					  : "0"}
					원
				  </td>
				  <td>{payroll.effectiveDate}</td>
				  <td>{payroll.endDate || "미정"}</td>
				  <td>
					<button
					  className="payroll-detail-btn"
					  onClick={() => onSelectPayroll(payroll)}
					>
					  🔍
					</button>
				  </td>
				</tr>
			  ))
			) : (
			  <tr>
				<td colSpan="7" style={{ textAlign: "center" }}>
				  급여 내역이 없습니다.
				</td>
			  </tr>
			)}
		  </tbody>
		  </table>
		</div>
  
		{/* 페이지네이션 컴포넌트 */}
		<Pagination
		  currentPage={currentPage}
		  totalItems={payrolls.length}
		  pageSize={pageSize}
		  onPageChange={setCurrentPage}
		/>
	  </div>
	);
  };
  
  export default PayrollTable;
  