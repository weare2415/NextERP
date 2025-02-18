import React, { useEffect, useState } from "react";
import "./scss/RequestOrderPage.scss";
import BasicLayout from "../../../common/pages/BasicLayout";
import ListRequestOrder from "../components/ListRequestOrder";
import { fetchPendingOrders } from "../api/orderApi";
import Pagination from '../../../common/component/Pagination';

const RequestOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadPendingOrders = async (page) => {
    try {
      const data = await fetchPendingOrders(page, size);

      console.log(data.content);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("주문 목록을 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    loadPendingOrders();
  }, []);


  return (
    <BasicLayout>
      <div className="request-order-page-container">
        <div className="page-header">
          <h1>주문 승인 요청 관리</h1>
        </div>

        <ListRequestOrder
          orders={orders}
        />
        {totalPages > 0 && (
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        )}
      </div>
    </BasicLayout>
  );
};

export default RequestOrderPage;
