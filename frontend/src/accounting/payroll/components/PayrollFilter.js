import React, { useState } from "react";
import { getEmployeeByName } from "../../../common/member/api/memberApi";
import { fetchEmployeeSalaryById } from "../api/payrollApi";
import "./scss/PayrollFilter.scss";

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

        //null 값 필터링 (오류로 인해 실패한 데이터 제외)
        payrollData = payrollData.filter((data) => data !== null);
      }

      setPayrolls(payrollData);
    } catch (error) {
      setPayrolls([]);
    }
  };

  return (
    <div className="search-payroll-container">
      <form className="search-payroll-form">
        <div className="search-input-wrapper">
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
