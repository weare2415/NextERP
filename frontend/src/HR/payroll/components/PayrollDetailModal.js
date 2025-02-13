import React, {useEffect, useState} from "react";
import {getEmployeeById} from '../../../common/member/api/memberApi';
import "./scss/PayrollDetailModal.css"

const PayrollDetailModal = ({ payroll, onClose }) => {
	const [employeeName, setEmployeeName] = useState("로딩 중...");

	// ✅ 직원 이름 가져오기
	useEffect(() => {
		const fetchEmployeeName = async () => {
			try {
				const employeeInfo = await getEmployeeById(payroll.employeeId);
				setEmployeeName(employeeInfo.name);
			} catch (error) {
				console.error(`Error fetching employee with ID ${payroll.employeeId}:`, error);
				setEmployeeName("알 수 없음");
			}
		};

		if (payroll.employeeId) {
			fetchEmployeeName();
		}
	}, [payroll.employeeId]);

	return (
			<div className="modal-overlay">
			<div className="payroll-modal">
				<div className="modal-header">
					<h2>급여 상세 정보</h2>
					<button className="close-button" onClick={onClose}>✖</button>
				</div>
				<div className="modal-content">
					<div className="form-grid">
						<div className="form-group">
							<label>직원명</label>
							<input type="text" value={employeeName} readOnly />
						</div>
						<div className="form-group">
							<label>기본급</label>
							<input type="text" value={`${payroll.baseSalary.toLocaleString()}원`} readOnly />
						</div>
						<div className="form-group">
							<label>공제</label>
							<input type="text" value={payroll.deductions ? `${payroll.deductions.toLocaleString()}원` : "0원"} readOnly />
						</div>
						<div className="form-group">
							<label>적용 시작일</label>
							<input type="text" value={payroll.effectiveDate} readOnly />
						</div>
						<div className="form-group">
							<label>종료일</label>
							<input type="text" value={payroll.endDate || "미정"} readOnly />
						</div>
						<div className="form-group full-width">
							<label>비고</label>
							<textarea value="급여 상세 설명 입력 (필요시)" readOnly />
						</div>
					</div>
					<div className="button-container">
						<button className="close-button" onClick={onClose}>닫기</button>
						<button className="update-button">수정</button>
						<button className="delete-button">삭제</button>
					</div>
				</div>
			</div>
			</div>
	);
};

export default PayrollDetailModal;