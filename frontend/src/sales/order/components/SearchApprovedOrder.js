import React, { useState } from "react";
import { getTransactionByDateBetween } from "../../../accounting/api/transactionApi";
import { fetchOrderById } from "../api/orderApi";
import "./scss/SearchApprovedOrder.scss";

const SearchApprovedOrder = ({ onSearchResults }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [size] = useState(10);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = async (e, page = 0) => {
    if (e && e.preventDefault) e.preventDefault();

    setLoading(true);
    setError(null);

    if (!startDate || !endDate) {
      setError("검색할 날짜를 선택하세요.");
      setLoading(false);
      return;
    }

    try {
      // 선택한 페이지의 트랜잭션 가져오기
      const transactions = await getTransactionByDateBetween(
        startDate,
        endDate,
        page,
        size
      );

      // 트랜잭션 ID 리스트 생성
      const transactionIds = transactions.content.map((tx) => tx.id);
      if (transactionIds.length === 0) {
        setError("해당 날짜 범위에 대한 주문이 없습니다.");
        setLoading(false);
        return;
      }

      // 해당 트랜잭션의 주문 데이터 가져오기
      const orderPromises = transactionIds.map((id) => fetchOrderById(id));
      const orders = await Promise.all(orderPromises);

      // 부모 컴포넌트로 검색 결과 전달 (페이지네이션 포함)
      onSearchResults(orders, transactions.totalPages, page);
    } catch (err) {
      console.error("날짜 검색 오류:", err);
      setError("날짜 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-order-container">
      <form className="search-order-form" onSubmit={(e) => handleSearch(e, 0)}>
        <label>날짜 선택:</label>
        <div className="date-inputs">
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <span> ~ </span>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <button type="submit" disabled={loading} className="loading-text">
          {loading ? "검색 중..." : "검색"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default SearchApprovedOrder;
