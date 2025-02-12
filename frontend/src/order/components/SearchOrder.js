import React, { useEffect, useState } from "react";
import { getAllClients } from "../../client/api/clientApi";
import { getEmployeeByName } from "../../member/api/memberApi";
import "../../order/components/scss/SearchOrder.scss";
import {
  fetchOrdersByClientCode,
  fetchOrdersByEmployeeId,
} from "../api/orderApi";

const SearchOrder = ({
  onSearchResults,
  resetSearchTerm,
  setResetSearchTerm,
  selectedTab,
}) => {
  const [searchParams, setSearchParams] = useState({
    searchType: "clientName",
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // 거래처명으로 주문 검색
  const searchByClientName = async () => {
    try {
      const allClients = await getAllClients();
      const matchingClients = allClients.filter((client) =>
        client.clientName.includes(searchParams.searchTerm)
      );

      if (matchingClients.length === 0) {
        return [];
      }

      const clientOrders = await Promise.all(
        matchingClients.map((client) =>
          fetchOrdersByClientCode(client.clientCode)
        )
      );

      // 모든 주문을 하나의 배열로 합침
      let allOrders = clientOrders.flat();

      // 선택된 탭에 따라 필터링
      if (selectedTab !== "ALL") {
        allOrders = allOrders.filter(
          (order) => order.orderType === selectedTab
        );
      }

      return allOrders;
    } catch (error) {
      console.error("Error in searchByClientName:", error);
      throw error;
    }
  };

  // 직원 이름으로 주문 검색
  const searchByEmployeeName = async () => {
    try {
      const employees = await getEmployeeByName(searchParams.searchTerm);

      if (employees.length === 0) {
        return [];
      }

      const employeeOrders = await Promise.all(
        employees.map((emp) => fetchOrdersByEmployeeId(emp.id))
      );

      // 모든 주문을 하나의 배열로 합침
      let allOrders = employeeOrders.flat();

      // 선택된 탭에 따라 필터링
      if (selectedTab !== "ALL") {
        allOrders = allOrders.filter(
          (order) => order.orderType === selectedTab
        );
      }

      return allOrders;
    } catch (error) {
      console.error("Error in searchByEmployeeName:", error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("검색어:", searchParams.searchTerm);
    setLoading(true);
    setError(null);

    try {
      const searchResults = await (searchParams.searchType === "clientName"
        ? searchByClientName()
        : searchByEmployeeName());
      console.log("검색 결과:", searchResults);
      onSearchResults(searchResults);
    } catch (err) {
      console.error("검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resetSearchTerm) {
      setSearchParams((prevParams) => ({ ...prevParams, searchTerm: "" }));
      setResetSearchTerm(false);
    }
  }, [resetSearchTerm, setResetSearchTerm]);

  return (
    <div className="search-order-container">
      <form className="search-order-form" onSubmit={handleSearch}>
        <select
          name="searchType"
          value={searchParams.searchType}
          onChange={handleInputChange}
        >
          <option value="clientName">거래처명</option>
          <option value="employeeName">주문 담당자</option>
        </select>
        <input
          type="text"
          name="searchTerm"
          placeholder="검색어를 입력하세요"
          value={searchParams.searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">검색</button>
      </form>
      {loading && <p className="loading-text">검색 중...</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default SearchOrder;
