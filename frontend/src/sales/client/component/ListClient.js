import React, { useEffect, useState } from "react";
import './scss/ListClient.scss';
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const ListClient = ({ clients, onClientSelect }) => {
  const employeeNames = useEmployeeNames(clients, "employeeId");

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
            {clients.map((client) => (
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
    </div>
  );
};

export default ListClient;