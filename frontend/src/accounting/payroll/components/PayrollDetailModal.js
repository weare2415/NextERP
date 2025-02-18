import React from "react";
import "./scss/PayrollDetailModal.scss"
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const PayrollDetailModal = ({ payroll, onClose }) => {
	const employeeName = useEmployeeNames(payroll);

	// 연봉을 12로 나누어 월 기본급과 월 공제 계산 (정수형)
	const monthlyBasic = Math.floor(payroll.baseSalary / 12);
	const monthlyDeduction = payroll.deductions ? Math.floor(payroll.deductions / 12) : 0;
	const netPay = monthlyBasic - monthlyDeduction;


	return (
/*	  <div className="modal-overlay">
		<div className="payroll-modal">
		  <div className="modal-header">
			<h2>급여 상세 정보</h2>
			<button className="close-button" onClick={onClose}>
			  ✖
			</button>
		  </div>
		  <div className="modal-content">
			<div className="form-grid">
			  <div className="form-group">
				<label>직원명</label>
				<input type="text" value={employeeName[payroll.employeeId]} readOnly />
			  </div>
			  <div className="form-group">
				<label>기본급</label>
				<input
				  type="text"
				  value={`${payroll.baseSalary.toLocaleString()}원`}
				  readOnly
				/>
			  </div>
			  <div className="form-group">
				<label>공제</label>
				<input
				  type="text"
				  value={
					payroll.deductions
					  ? `${payroll.deductions.toLocaleString()}원`
					  : "0원"
				  }
				  readOnly
				/>
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
				<textarea value="급여 상세 설명" readOnly />
			  </div>
			</div>
		  </div>
		</div>
	  </div>*/
			<div className="modal-overlay">
				<div className="payroll-modal">
					<h2>급여 상세 정보</h2>
					<button className="modal-close-btn" onClick={onClose}>
						X
					</button>
					<div className="modal-content">
						<div className="form-grid">
							<div className="form-group">
								<label>직원명</label>
								<input type="text" value={employeeName[payroll.employeeId]} readOnly />
							</div>
							<div className="form-group">
								<label>연봉</label>
								<input
										type="text"
										value={`${payroll.baseSalary.toLocaleString("ko-KR", {
											maximumFractionDigits: 0,
										})}원`}
										readOnly
								/>
							</div>
							<div className="form-group">
								<label>기본급(월)</label>
								<input
										type="text"
										value={`${monthlyBasic.toLocaleString("ko-KR", {
											maximumFractionDigits: 0,
										})}원`}
										readOnly
								/>
							</div>
							<div className="form-group">
								<label>공제(월)</label>
								<input
										type="text"
										value={`${monthlyDeduction.toLocaleString("ko-KR", {
											maximumFractionDigits: 0,
										})}원`}
										readOnly
								/>
							</div>
							<div className="form-group">
								<label>실지급 급여</label>
								<input
										type="text"
										value={`${netPay.toLocaleString("ko-KR", {
											maximumFractionDigits: 0,
										})}원`}
										readOnly
								/>
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
							<button className="close-button" onClick={onClose}>
								닫기
							</button>
							<button className="update-button">수정</button>
							<button className="delete-button">삭제</button>
						</div>
					</div>
				</div>
			</div>
			);
  };
  
  export default PayrollDetailModal;
  