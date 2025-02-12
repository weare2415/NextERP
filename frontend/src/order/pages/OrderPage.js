import React, { useEffect, useState } from "react";
import { fetchApprovedOrders } from "../../order/api/orderApi";
import BasicLayout from "../../common/pages/BasicLayout";
import "./OrderPage.scss";
import ListOrder from "../components/ListOrder";
import SearchOrder from "../components/SearchOrder";
import OrderFilter from "../components/OrderFilter"; // OrderFilter 추가

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState("전체");
  const [resetSearchTerm, setResetSearchTerm] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchApprovedOrders();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("반환된 데이터가 배열이 아닙니다:", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error loading approved orders:", error);
        setOrders([]);
      }
    };
    loadOrders();
  }, []);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResetSearchTerm(true);
    setSearchResults(null);
  };

  return (
    <BasicLayout>
      <div className="order-page-container">
        <div className="page-header">
          <h1>주문 내역 조회</h1>
          <div className="header-right">
            <SearchOrder
              onSearchResults={handleSearchResults}
              resetSearchTerm={resetSearchTerm}
              setResetSearchTerm={setResetSearchTerm}
              selectedTab={activeTab}
              className="order-search"
            />
            <OrderFilter // OrderFilter 추가
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
        <ListOrder
          orders={searchResults || orders}
          activeTab={activeTab}
          className="list-order"
        />
      </div>
    </BasicLayout>
  );
};

export default OrderPage;
