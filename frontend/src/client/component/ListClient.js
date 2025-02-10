import React, { useEffect, useState } from "react";
import '../component/scss/ListClient.scss';
import SearchClient from "./SearchClient";
import { getEmployeeById } from "../../member/api/memberApi";
import Pagination from "../../common/util/Pagination";
import { paginate } from "../../common/util/paginationUtils";

const ListClient = ({ clients, onClientSelect }) => {
  const [employeeNames, setEmployeeNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1); 
  const pageSize = 7;

  useEffect(() => {
    setCurrentPage(1); // 검색 결과가 변경되면 첫 페이지로 초기화
  }, [clients]);

  // ✅ 직원 이름 가져오기
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const employeeIds = [...new Set(clients.map(client => client.employeeId))];
      const employeeData = {};

      await Promise.all(employeeIds.map(async (id) => {
        try {
          const employeeInfo = await getEmployeeById(id);
          employeeData[id] = employeeInfo.name;
        } catch (error) {
          console.error(`Error fetching employee with ID ${id}:`, error);
          employeeData[id] = "알 수 없음";
        }
      }));

      setEmployeeNames(employeeData);
    };

    if (clients.length > 0) {
      fetchEmployeeNames();
    }
  }, [clients]);

  const paginatedData = paginate(clients, currentPage, pageSize);

  return (
    <div className="client-list-wrapper">
      <div className="client-table-section">
        <table>
          <thead>
            <tr>
              <th>거래처 코드</th>
              <th>기업명</th>
              <th>거래처 전화</th>
              <th>주소</th>
              <th>사업자등록번호</th>
              <th>영업 담당자</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((client) => (
              <tr key={client.clientCode}>
                <td>{client.clientCode}</td>
                <td>
                  <button 
                    className="client-table-name-btn" 
                    onClick={() => onClientSelect(client)}
                  >
                    {client.clientName}
                  </button>
                </td>
                <td>{client.clientPhone}</td>
                <td>{client.clientAddress}</td>
                <td>{client.registrationNumber}</td>
                <td>{employeeNames[client.employeeId] || "Loading..."}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalItems={clients.length} 
        pageSize={pageSize} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};

export default ListClient;