import React, { useEffect, useState } from "react";
import "./scss/ListRequestOrder.scss";
import { getProductById } from "../../product/api/productApi";
import { getClientById } from "../../client/api/clientApi";
import RequestOrder from "./RequestOrder";
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const ListRequestOrder = ({
  orders,
  onUpdateSuccess,
}) => {
  const employeeNames = useEmployeeNames(orders, "employeeId");
  const [productNames, setProductNames] = useState({});
  const [clientNames, setClientNames] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
              const response = await getClientById(code); // API 호출

              // Page 형식 응답 처리: content 배열이 있는지 확인 후 첫 번째 요소 가져오기
              if (response?.content?.length > 0) {
                clientData[code] = response.content[0].clientName;
              } else {
                clientData[code] = "알 수 없음"; // 데이터가 없을 경우 기본값 설정
              }
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
      <div className="request-order-list-wrapper">
        <div className="request-order-table-section">
          <table className="request-order-list">
            <thead>
              <tr>
                <th>제품 ID</th>
                <th>제품명</th>
                <th>주문 기업명</th>
                <th>주문 수량</th>
                <th>판매/구매</th>
                <th>승인 요청자</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.productId}</td>
                    <td>
                      <button
                        className="order-list-name-btn"
                        onClick={() => handleOrderClick(order)}
                      >
                        {productNames[order.productId] || "Loading..."}
                      </button>
                    </td>
                    <td>{clientNames[order.clientCode] || "Loading..."}</td>
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
      </div>

      {/* ✅ 모달 적용 */}
      {showModal && selectedOrder && (
        <div onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
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