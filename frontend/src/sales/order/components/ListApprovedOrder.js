import React, { useState } from "react";
import useEmployeeNames from "../../../common/hooks/useEmployeeNames";
import "./scss/ListApprovedOrder.scss";

const ListApprovedOrder = ({ mergedOrders, clientNames, productNames }) => {
  const employeeName = useEmployeeNames(mergedOrders, "employeeId");

  const getOrderTypeLabel = (orderType) => {
    return orderType === "PURCHASE"
      ? "구매"
      : orderType === "SALE"
      ? "판매"
      : "알 수 없음";
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : "날짜 없음";
  };

  const formatAmount = (amount) => {
    return amount ? new Intl.NumberFormat("ko-KR").format(amount) + "원" : "0";
  };

  return (
    <div className="order-list-container">
      <div className="order-header"></div>
      <div className="order-list">
        <table className="order-list-grid">
          <thead>
            <tr>
              <th>거래 ID</th>
              <th>구분</th>
              <th>거래처명</th>
              <th>거래일자</th>
              <th>제품명</th>
              <th>주문 수량</th>
              <th>주문 금액</th>
              <th>주문 담당자</th>
            </tr>
          </thead>
          <tbody>
            {mergedOrders.length > 0 ? (
              mergedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.transactionId}</td>
                  <td>{getOrderTypeLabel(order.orderType)}</td>
                  <td>{clientNames?.[order.clientCode] || "Loading..."}</td>
                  <td>{formatDate(order.transactionDetails.date)}</td>
                  <td>{productNames?.[order.productId]}</td>
                  <td>{order.orderCount}</td>
                  <td>{formatAmount(order.transactionDetails.amount)}</td>
                  <td>{employeeName?.[order.employeeId] || "Loading..."}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  주문 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListApprovedOrder;
