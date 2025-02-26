import React, { useState } from "react";
import { getEmployeeByName } from "../../../common/member/api/memberApi";
import { fetchEmployeeSalaryById } from "../api/payrollApi";
import "./scss/PayrollFilter.scss";

const PayrollFilter = ({ setPayrolls }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    try {
      let payrollData = [];

      // 직원 이름으로 직원 목록 가져오기
      const response = await getEmployeeByName(searchTerm);
      const employees = response.content; // content 배열을 사용

      // 직원 정보가 있을 경우 급여 정보 가져오기
      if (Array.isArray(employees) && employees.length > 0) {
        payrollData = await Promise.all(
          employees.map(async (employee) => {
            try {
              const salaryInfo = await fetchEmployeeSalaryById(employee.id);
              console.log(salaryInfo);
              return { ...salaryInfo, employeeName: employee.name };
            } catch (error) {
              console.error(
                `급여 정보 불러오기 실패 (ID: ${employee.id}):`,
                error
              );
              return null;
            }
          })
        );

        // null 값 필터링 (오류로 인해 실패한 데이터 제외)
        payrollData = payrollData.filter((data) => data !== null);
      }

      // 결과를 상태에 반영
      setPayrolls(payrollData);
    } catch (error) {
      setPayrolls([]); // 오류 발생 시 빈 배열로 초기화
    }
  };

  return (
    <div className="search-payroll-container">
      <form className="search-payroll-form">
        <div className="search-payroll-wrapper">
          <input
            type="text"
            placeholder="직원 이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={handleSearch}>검색</button>
      </form>
    </div>
  );
};

export default PayrollFilter;
