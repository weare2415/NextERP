import React, { useState, useEffect } from "react";
import {createEmployeeSalary, fetchEmployeeSalaryById} from '../api/payrollApi';
import './scss/EmployeeSalaryModal.scss'
import {getEmployeesByName} from '../../../HR/employee/api/employeeApi';

const EmployeeSalaryModal = ({ onClose, onSuccess }) => {
	const [employeeSearch, setEmployeeSearch] = useState("");
	const [employeeResults, setEmployeeResults] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [salaryData, setSalaryData] = useState({
		employeeId: "",
		baseSalary: "",
		deductions: "",
		effectiveDate: "",
		endDate: ""
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// 직원 검색 API 호출
	const handleSearch = async () => {
		try {
			const results = await getEmployeesByName(employeeSearch);
			setEmployeeResults(results);
			setError(null);
		} catch (err) {
			console.error("직원 검색 중 오류 발생:", err);
			setError("직원 검색에 실패했습니다.");
		}
	};

	// 직원 선택 시 처리
	const handleSelectEmployee = (employee) => {
		setSelectedEmployee(employee);
		// 선택한 직원의 ID를 salaryData에 설정
		setSalaryData({
			...salaryData,
			employeeId: employee.id
		});
	};

	// 선택된 직원이 변경되면 기존 급여 정보 조회
	useEffect(() => {
		if (selectedEmployee) {
			fetchEmployeeSalaryById(selectedEmployee.id)
					.then((data) => {
						if (data) {
							// 기존 급여 데이터가 있는 경우 폼에 채워줌
							setSalaryData({
								employeeId: data.employeeId,
								baseSalary: data.baseSalary,
								deductions: data.deductions,
								effectiveDate: data.effectiveDate,
								endDate: data.endDate || ""
							});
						} else {
							// 데이터가 없으면 상태를 초기화하여 기존 값 클리어
							setSalaryData({
								employeeId: selectedEmployee.id,
								baseSalary: "",
								deductions: "",
								effectiveDate: "",
								endDate: ""
							});
						}
					})
					.catch((err) => {
						console.error("급여 정보 조회 중 오류 발생:", err);
						// 에러(예: 404)가 발생하면 상태를 초기화
						setSalaryData({
							employeeId: selectedEmployee.id,
							baseSalary: "",
							deductions: "",
							effectiveDate: "",
							endDate: ""
						});
					});
		}
	}, [selectedEmployee]);

	// 폼 입력 처리
	const handleChange = (e) => {
		const { name, value } = e.target;
		setSalaryData({
			...salaryData,
			[name]: value
		});
	};

	// 폼 제출 시 처리
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!salaryData.employeeId) {
			setError("직원을 선택해주세요.");
			return;
		}
		if (!salaryData.effectiveDate || !salaryData.baseSalary) {
			setError("필수 항목을 모두 입력해주세요.");
			return;
		}

		try {
			setLoading(true);
			await createEmployeeSalary(salaryData);
			setLoading(false);
			onSuccess && onSuccess();
			onClose();
		} catch (err) {
			console.error("급여 정보 저장 중 오류 발생:", err);
			setError("급여 정보 저장에 실패했습니다.");
			setLoading(false);
		}
	};

	return (
			<div className="modal-overlay">
				<div className="modal-container">
					<h2>급여정보 생성 / 수정</h2>
					<button className="modal-close-btn" onClick={onClose}>
						X
					</button>
					{error && <p className="error-message">{error}</p>}
					<form onSubmit={handleSubmit} className="salary-form">
						{/* 직원 검색 */}
						<div className="form-group">
							<label htmlFor="employeeSearch">직원 검색 (이름)</label>
							<div className="search-wrapper">
								<input
										type="text"
										id="employeeSearch"
										value={employeeSearch}
										onChange={(e) => setEmployeeSearch(e.target.value)}
								/>
								<button type="button" onClick={handleSearch}>
									검색
								</button>
							</div>
						</div>
						{/* 검색 결과 리스트 */}
						{employeeResults.length > 0 && (
								<div className="employee-results">
									<ul>
										{employeeResults.map((emp) => (
												<li key={emp.id} onClick={() => handleSelectEmployee(emp)}>
													{emp.name} (ID: {emp.id})
												</li>
										))}
									</ul>
								</div>
						)}
						{/* 선택된 직원 표시 */}
						{selectedEmployee && (
								<div className="form-group">
									<label>선택된 직원</label>
									<p>
										{selectedEmployee.name} (ID: {selectedEmployee.id})
									</p>
								</div>
						)}
						{/* 급여 정보 입력 */}
						<div className="form-group">
							<label htmlFor="baseSalary">연봉</label>
							<input
									type="number"
									id="baseSalary"
									name="baseSalary"
									value={salaryData.baseSalary}
									onChange={handleChange}
									placeholder="연봉 입력"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="deductions">공제</label>
							<input
									type="number"
									id="deductions"
									name="deductions"
									value={salaryData.deductions}
									onChange={handleChange}
									placeholder="공제액 입력"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="effectiveDate">적용 시작일</label>
							<input
									type="date"
									id="effectiveDate"
									name="effectiveDate"
									value={salaryData.effectiveDate}
									onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="endDate">종료일 (옵션)</label>
							<input
									type="date"
									id="endDate"
									name="endDate"
									value={salaryData.endDate}
									onChange={handleChange}
							/>
						</div>
						<button type="submit" disabled={loading} className="submit-btn">
							{loading ? "저장 중..." : "저장"}
						</button>
					</form>
				</div>
			</div>
	);
};

export default EmployeeSalaryModal;
