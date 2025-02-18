import React, { useState } from "react";
import useEmployeeNames from "../../../common/hooks/useEmployeeNames";
import "./scss/ListApprovedOrder.scss";

const ListApprovedOrder = ({ mergedOrders, clientNames, productNames }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const employeeName = useEmployeeNames(mergedOrders, "employeeId");

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevState) =>
      prevState.includes(orderId)
        ? prevState.filter((id) => id !== orderId)
        : [...prevState, orderId]
    );
  };

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
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedOrders(
                      e.target.checked
                        ? mergedOrders.map((order) => order.id)
                        : []
                    );
                  }}
                  checked={
                    mergedOrders.length > 0 &&
                    selectedOrders.length === mergedOrders.length
                  }
                />
              </th>
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
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleCheckboxChange(order.id)}
                    />
                  </td>
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
                <td colSpan="9" style={{ textAlign: "center" }}>
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
