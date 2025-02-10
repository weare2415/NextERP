import React, { useEffect, useState } from "react";
import { fetchApprovedOrders } from "../api/orderApi";
import BasicLayout from "../../common/pages/BasicLayout";
import "../../order/pages/OrderPage.scss";
import ListOrder from "../components/ListOrder";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const loadOrders = async () => {
        try {
          const data = await fetchApprovedOrders();
          setOrders(data);
        } catch (error) {
          console.error("Error loading approved orders:", error);
        }
      };
      loadOrders();
    }, []);
  
    return (
      <BasicLayout>
      <div className="order-page-container">
      <div className="page-header">
          <h1>주문 내역 조회</h1>
          <ListOrder orders={orders} />
        </div>
        </div>
      </BasicLayout>
    );
  };
  
  export default OrderPage;