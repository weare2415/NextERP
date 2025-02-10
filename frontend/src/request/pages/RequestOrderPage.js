import React, { useEffect, useState } from "react";
import "./RequestOrderPage.scss";
import BasicLayout from "../../common/pages/BasicLayout";
import ListRequestOrder from "../component/ListRequestOrder";
import { fetchPendingOrders } from "../../order/api/orderApi";

const RequestOrderPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await fetchPendingOrders();
      setOrders([...data].reverse());
    } catch (error) {
      console.error("주문 목록을 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ 승인 또는 반려 후 목록에서 제거
  const handleUpdateSuccess = (updatedTransactionId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.transactionId !== updatedTransactionId)
    );
  };

  return (
    <BasicLayout>
      <div className="request-order-page-container">
        <div className="page-header">
          <h1>주문 승인 요청 관리</h1>
        </div>

        <ListRequestOrder
          orders={orders}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    </BasicLayout>
  );
};

export default RequestOrderPage;
