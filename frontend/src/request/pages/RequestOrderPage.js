import React, { useEffect, useState } from "react";
import "./RequestOrderPage.scss";
import BasicLayout from "../../common/pages/BasicLayout";
import ListRequestOrder from "../component/ListRequestOrder";
import { fetchPendingOrders } from "../../order/api/orderApi";

const RequestOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  const loadPendingOrders = async (pageNumber = 0, pageSize = 10) => {
    try {
      const data = await fetchPendingOrders(pageNumber, pageSize);

      setOrders(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("주문 목록을 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const handlePageChange = (newPage) => {
    loadPendingOrders(newPage); // 새로운 페이지 데이터 로드
  };

  return (
    <BasicLayout>
      <div className="request-order-page-container">
        <div className="page-header">
          <h1>주문 승인 요청 관리</h1>
        </div>

        <ListRequestOrder
          orders={orders}
          onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </BasicLayout>
  );
};

export default RequestOrderPage;
