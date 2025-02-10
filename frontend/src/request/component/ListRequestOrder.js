import React, { useEffect, useState } from "react";
import "../../request/component/scss/ListRequestOrder.scss";
import { getEmployeeById } from "../../member/api/memberApi";
import { getProductById } from "../../product/api/productApi";
import { getClientById } from "../../client/api/clientApi";
import RequestOrder from "./RequestOrder";
import { paginate } from "../../common/util/paginationUtils";
import Pagination from "../../common/util/Pagination";

const ListRequestOrder = ({ orders, onUpdateSuccess }) => {
  const [employeeNames, setEmployeeNames] = useState({});
  const [productNames, setProductNames] = useState({});
  const [clientNames, setClientNames] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderList, setOrderList] = useState(orders);
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 상태
  const pageSize = 5; // ✅ 한 페이지당 5개 표시

  useEffect(() => {
    setOrderList(orders); // ✅ 부모 컴포넌트에서 받은 orders 값이 변경될 때 리스트 갱신
  }, [orders]);

  // ✅ 현재 페이지에 맞는 데이터 가져오기
  const paginatedData = paginate(orderList, currentPage, pageSize);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      if (orders.length === 0) return;
      const employeeIds = [...new Set(orders.map((order) => order.employeeId))];
      const employeeData = {};

      await Promise.all(
        employeeIds.map(async (id) => {
          try {
            const employeeInfo = await getEmployeeById(id);
            employeeData[id] = employeeInfo.name;
          } catch (error) {
            console.error(`직원 정보 조회 오류 (ID: ${id})`, error);
            employeeData[id] = "알 수 없음";
          }
        })
      );

      setEmployeeNames(employeeData);
    };

    fetchEmployeeNames();
  }, [orders]);

  useEffect(() => {
    const fetchProductNames = async () => {
      if (orders.length === 0) return;
      const productIds = [...new Set(orders.map((order) => order.productId))];
      const productData = {};

      await Promise.all(
        productIds.map(async (id) => {
          try {
            const productInfo = await getProductById(id);
            productData[id] = productInfo.productName;
          } catch (error) {
            console.error(`제품 정보 조회 오류 (ID: ${id})`, error);
            productData[id] = "알 수 없음";
          }
        })
      );

      setProductNames(productData);
    };

    fetchProductNames();
  }, [orders]);

  useEffect(() => {
    const fetchClientNames = async () => {
      if (orders.length === 0) return;
      const clientCodes = [...new Set(orders.map((order) => order.clientCode))];
      const clientData = {};

      await Promise.all(
        clientCodes.map(async (code) => {
          try {
            const clientInfo = await getClientById(code);
            clientData[code] = clientInfo.clientName;
          } catch (error) {
            console.error(`거래처 정보 조회 오류 (코드: ${code})`, error);
            clientData[code] = "알 수 없음";
          }
        })
      );

      setClientNames(clientData);
    };

    fetchClientNames();
  }, [orders]);

  // ✅ 주문 승인 또는 반려 후 리스트에서 제거
  const handleUpdateSuccess = (updatedTransactionId) => {
    setOrderList((prevOrders) =>
      prevOrders.filter((order) => order.transactionId !== updatedTransactionId)
    );

    // 부모 컴포넌트에서도 데이터 업데이트 (RequestOrderPage.js)
    if (onUpdateSuccess) {
      onUpdateSuccess(updatedTransactionId);
    }
  };

  // ✅ 주문 클릭 시 모달 열기
  const handleOrderClick = (order) => {
    setSelectedOrder({
      ...order,
      productName: productNames[order.productId] || "알 수 없음",
      clientName: clientNames[order.clientCode] || "알 수 없음",
      employeeName: employeeNames[order.employeeId] || "알 수 없음",
    });

    setShowModal(true);
  };

  return (
    <>
      <div className="request-product-list-wrapper">
        <div className="product-table-section">
          <table>
            <thead>
              <tr>
                <th>제품ID</th>
                <th>제품명</th>
                <th>기업명</th>
                <th>수량</th>
                <th>판매/구매</th>
                <th>승인 요청자</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((order) => (
                  <tr key={order.id}>
                    <td>{order.productId}</td>
                    <td>
                      <button
                        className="product-table-name-btn"
                        onClick={() => handleOrderClick(order)}
                      >
                        {productNames[order.productId] || "Loading..."}
                      </button>
                    </td>
                    <td>
                      <button
                        className="product-table-name-btn"
                        onClick={() => handleOrderClick(order)}
                      >
                        {clientNames[order.clientCode] || "Loading..."}
                      </button>
                    </td>
                    <td>{order.orderCount} 개</td>
                    <td>{order.orderType === "SALE" ? "판매" : "구매"}</td>
                    <td>{employeeNames[order.employeeId] || "Loading..."}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    승인 요청된 주문이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ 페이지네이션 컴포넌트 추가 */}
        <Pagination
          currentPage={currentPage}
          totalItems={orderList.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ✅ 모달 적용 */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <RequestOrder
              order={selectedOrder}
              onClose={() => setShowModal(false)}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ListRequestOrder;
