import React, { useState } from "react";
import { createEmployeeSalary } from "../api/payrollApi";
import "../components/scss/PayrollForm.scss";

const PayrollForm = ({ closeModal }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [deductions, setDeductions] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const salaryData = {
      employeeName,
      baseSalary,
      deductions,
      effectiveDate,
      endDate,
    };

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
    <div className="payroll-create-form">
      <div className="payroll-create-header">
        <h2>급여 정보 입력</h2>
        <button
          className="close-button"
          onClick={closeModal} // 부모에서 전달받은 closeModal 호출
        >
          X
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>직원 이름</label>
          <input
            type="text"
            placeholder="직원 이름"
            value={employeeName}
            required
            readOnly
          />
        </div>
        <div className="form-group">
          <label>기본 급여</label>
          <input
            type="number"
            placeholder="기본급"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>공제</label>
          <input
            type="number"
            placeholder="공제"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>기간</label>
          <input
            type="date"
            placeholder="적용 시작일"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="종료일 (선택)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="payroll-create-buttons">
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
};

export default PayrollForm;
