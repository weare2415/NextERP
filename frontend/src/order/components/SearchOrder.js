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
    const allClients = await getAllClients();
    const matchingClients = allClients.filter((client) =>
      client.clientName.includes(searchParams.searchTerm)
    );

    if (matchingClients.length === 0) {
      return [];
    }

    // ALL 탭일 경우 모든 주문 조회
    if (selectedTab === "ALL") {
      return await fetchOrdersByClientCode(matchingClients[0].clientCode);
    }

    // SALE/PURCHASE 탭일 경우 해당 타입의 주문만 조회
    return await fetchOrdersByClientCode(matchingClients[0].clientCode);
  };

  // 직원 이름으로 주문 검색
  const searchByEmployeeName = async () => {
    const employees = await getEmployeeByName(searchParams.searchTerm);

    if (employees.length === 0) {
      return [];
    }

    const employeeIds = employees.map((emp) => emp.id);

    // ALL 탭일 경우 모든 주문 조회
    if (selectedTab === "ALL") {
      let allOrders = [];
      for (const empId of employeeIds) {
        const orders = await fetchOrdersByEmployeeId(empId);
        allOrders = [...allOrders, ...orders];
      }
      return allOrders;
    }

    // SALE/PURCHASE 탭일 경우 해당 타입의 주문만 조회
    let filteredOrders = [];
    for (const empId of employeeIds) {
      const orders = await fetchOrdersByEmployeeId(empId);
      filteredOrders = [
        ...filteredOrders,
        ...orders.filter((order) => order.orderType === selectedTab),
      ];
    }
    return filteredOrders;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const searchResults =
        searchParams.searchType === "clientName"
          ? await searchByClientName()
          : await searchByEmployeeName();
      onSearchResults(searchResults);
    } catch (err) {
      console.error("검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 판매/구매 탭 클릭 시 searchTerm 초기화
  useEffect(() => {
    if (resetSearchTerm) {
      setSearchParams((prevParams) => ({ ...prevParams, searchTerm: "" }));
      setResetSearchTerm(false);
    }
  }, [resetSearchTerm, setResetSearchTerm]); // resetSearchTerm 값이 변경되면 실행됨

  return (
    <div className="search-section">
      <form className="search-form" onSubmit={handleSearch}>
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
