import React, { useEffect, useState } from "react";
import { fetchApprovedOrders } from "../../order/api/orderApi";
import BasicLayout from "../../common/pages/BasicLayout";
import "./OrderPage.scss";
import ListOrder from "../components/ListOrder";
import SearchOrder from "../components/SearchOrder";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState("전체");
  const [resetSearchTerm, setResetSearchTerm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setResetSearchTerm(true);
    setSearchResults(null);
    setDropdownOpen(false);
  };

  return (
    <BasicLayout>
      <div className="order-page-container">
        <div className="page-header">
          <h1>주문 내역 조회</h1>
          <div className="header-controls">
            <SearchOrder
              onSearchResults={handleSearchResults}
              resetSearchTerm={resetSearchTerm}
              setResetSearchTerm={setResetSearchTerm}
              selectedTab={activeTab}
              className="order-search"
            />
            <div className="dropdown">
              <button
                className="dropdown-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {activeTab}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li onClick={() => handleTabClick("전체")}>전체</li>
                  <li onClick={() => handleTabClick("판매")}>판매</li>
                  <li onClick={() => handleTabClick("구매")}>구매</li>
                </ul>
              )}
            </div>
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
