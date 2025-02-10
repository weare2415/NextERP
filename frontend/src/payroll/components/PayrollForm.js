import React, { useState } from "react";
import { createEmployeeSalary } from "../api/payrollApi";

const PayrollForm = () => {
	const [employeeName, setEmployeeName] = useState("");
	const [baseSalary, setBaseSalary] = useState("");
	const [deductions, setDeductions] = useState("");
	const [effectiveDate, setEffectiveDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const salaryData = { employeeName, baseSalary, deductions, effectiveDate, endDate };

		try {
			await createEmployeeSalary(salaryData);
			alert("급여 정보가 저장되었습니다.");
			window.location.href = "/payroll";
		} catch (error) {
			console.error("급여 정보 추가 실패:", error);
			alert("오류 발생");
		}
	};

	return (
			<form onSubmit={handleSubmit}>
				<h3>급여 정보 입력</h3>
				<input type="text" placeholder="직원 이름" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />
				<input type="number" placeholder="기본급" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} required />
				<input type="number" placeholder="공제" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
				<input type="date" placeholder="적용 시작일" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} required />
				<input type="date" placeholder="종료일 (선택)" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
				<button type="submit">저장</button>
			</form>
	);
};

export default PayrollForm;