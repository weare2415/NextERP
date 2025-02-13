import React, { useEffect, useState } from "react";
import "../../order/components/scss/ListRequestClient.scss";
import { getEmployeeById } from "../../../common/member/api/memberApi";
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const ListRequestClient = ({ clients, onClientSelect }) => {
  const employeeNames = useEmployeeNames(clients, "employeeId");

  return (
    <div className="client-list-container">
      <div className="client-list">
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
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.clientCode}>
                  <td>{client.clientCode}</td>
                  <td>
                    <button
                      className="client-name-btn"
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
    </div>
  );
};

export default ListRequestClient;
