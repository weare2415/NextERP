import React, { useEffect, useState } from "react";
import "../../request/component/scss/ListRequestClient.scss";
import { getEmployeeById } from "../../member/api/memberApi";
import { paginate } from "../../common/util/paginationUtils";
import Pagination from "../../common/util/Pagination";

const ListRequestClient = ({ clients, onClientSelect }) => {
  const [employeeNames, setEmployeeNames] = useState({}); // employeeId -> name 매핑
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 상태
  const pageSize = 5; // ✅ 한 페이지당 5개 표시

  // ✅ 현재 페이지에 맞는 데이터 가져오기
  const paginatedData = paginate(clients, currentPage, pageSize);

  // 직원 이름을 가져와서 매핑하는 함수 (useEffect 내부에서 API 호출)
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      if (clients.length === 0) return;

      const employeeIds = [
        ...new Set(clients.map((client) => client.employeeId)),
      ];
      const employeeData = {};

      await Promise.all(
        employeeIds.map(async (id) => {
          try {
            const employeeInfo = await getEmployeeById(id);
            employeeData[id] = employeeInfo.name;
          } catch (error) {
            console.error(`직원 정보 조회 오류 (ID: ${id})`, error);
            employeeData[id] = "알 수 없음";
          }
        })
      );

      setEmployeeNames(employeeData);
    };

    fetchEmployeeNames();
  }, [clients]);

  return (
    <div className="request-client-list-wrapper">
      <div className="client-table-section">
        <table>
          <thead>
            <tr>
              <th>거래처 코드</th>
              <th>기업명</th>
              <th>회사 전화</th>
              <th>주소</th>
              <th>사업자등록번호</th>
              <th>승인 요청자</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((client) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  승인 요청된 거래처가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ✅ 페이지네이션 컴포넌트 추가 */}
      <Pagination
        currentPage={currentPage}
        totalItems={clients.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ListRequestClient;
