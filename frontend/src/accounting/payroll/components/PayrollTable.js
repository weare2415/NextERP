import React, { useState, useEffect } from "react";
import { getEmployeeById } from "../../../HR/employee/api/employeeApi";
import "./scss/PayrollTable.scss";
import Pagination from "../../../common/component/Pagination";
import useEmployeeNames from "../../../common/hooks/useEmployeeNames";

const PayrollTable = ({ payrolls, onSelectPayroll }) => {
  const employeeNames = useEmployeeNames(payrolls); // 직원명 매핑
  const [employeeDetails, setEmployeeDetails] = useState({}); // { employeeId: { ...employeeData } }

  // 직급 불러오기
  useEffect(() => {
    const fetchDetails = async () => {
      const details = {};
      await Promise.all(
        payrolls.map(async (payroll) => {
          if (!details[payroll.employeeId]) {
            try {
              const detail = await getEmployeeById(payroll.employeeId);
              details[payroll.employeeId] = detail;
            } catch (error) {
              console.error(
                `직원 ${payroll.employeeId} 상세 조회 실패:`,
                error
              );
            }
          }
        })
      );
      setEmployeeDetails(details);
    };

    if (payrolls.length > 0) {
      fetchDetails();
    }
  }, [payrolls]);

  return (
    <div className="payroll-table-wrapper">
      {/*      <div className="payroll-table-section">
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
         {payrolls.length > 0 ? (
           payrolls.map((payroll) => (
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
     </div>
   );
  };*/}
      <div className="payroll-table-section">
        <table>
          <thead>
            <tr>
              <th>사원번호</th>
              <th>직원명</th>
              <th>직급</th>
              <th>연봉</th>
              <th>월급</th>
              <th>적용 시작일</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(payrolls) && payrolls.length > 0 ? (
              payrolls.map((payroll) => {
                const monthlyDeduction = payroll.deductions / 12;
                const monthlySalary =
                  payroll.baseSalary / 12 - monthlyDeduction;
                const empDetail = employeeDetails[payroll.employeeId];
                const positionTitle = empDetail
                  ? empDetail.positionTitle
                  : "로딩 중...";
                return (
                  <tr key={payroll.id}>
                    <td>{payroll.employeeId}</td>
                    <td
                      className="payroll-name-btn"
                      onClick={() => onSelectPayroll(payroll)}
                    >
                      {employeeNames[payroll.employeeId] || "로딩 중..."}
                    </td>
                    <td>{positionTitle}</td>
                    <td>{payroll.baseSalary.toLocaleString()}원</td>
                    <td>{Math.round(monthlySalary).toLocaleString()}원</td>
                    <td>{payroll.effectiveDate}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  급여 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollTable;
