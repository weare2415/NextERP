import React, { useEffect, useState } from "react";
import "./scss/RequestOrder.scss";
import { approvePurchaseOrder, approveSaleOrder, rejectPurchaseOrder, rejectSaleOrder } from "../../order/api/orderApi";
import { getProductById } from "../../product/api/productApi";

const RequestOrder = ({ order, onClose, onUpdateSuccess }) => {
  const [productData, setProductData] = useState({ stock: 0 });

  useEffect(() => {
    const fetchProductData = async () => {
      if (order.productId) {
        try {
          const productInfo = await getProductById(order.productId);
          setProductData({
            stock: productInfo.stock,
          });
        } catch (error) {
          console.error("제품 정보 가져오기 실패:", error);
          setProductData({ stock: "알 수 없음" });
        }
      }
    };

    fetchProductData();
  }, [order.productId]);

  // ✅ 승인 처리
  const handleApprove = async () => {
    try {
      if (order.orderType === "SALE") {
        await approveSaleOrder(order.transactionId);
      } else if (order.orderType === "PURCHASE") {
        await approvePurchaseOrder(order.transactionId);
      }
      alert("거래 요청이 승인되었습니다.");
      onUpdateSuccess(order.transactionId);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("승인 요청 실패:", error);
      alert("승인 요청이 실패되었습니다.");
    }
  };

  // ✅ 반려 처리
  const handleReject = async () => {
    try {
      if (order.orderType === "SALE") {
        await rejectSaleOrder(order.transactionId); // 판매 주문 반려
      } else if (order.orderType === "PURCHASE") {
        await rejectPurchaseOrder(order.transactionId); // 구매 주문 반려
      }
      alert("거래 요청이 반려되었습니다.");
      onUpdateSuccess(order.transactionId); // 부모 컴포넌트에 변경 사항 전달
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("반려 요청 실패:", error);
      alert("반려 요청이 실패되었습니다.");
    }
  };

  return (
    <div className="request-product-detail-form">
      <div className="request-product-detail-header">
        <h2>거래 승인 요청</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
        <form>
            <div className="form-group">
              <label>제품 번호</label>
              <input type="text" value={order.productId} readOnly />
            </div>

            <div className="form-group">
              <label>제품명</label>
              <input type="text" value={order.productName} readOnly />
            </div>

            <div className="form-group">
              <label>거래 기업명</label>
              <input type="text" value={order.clientName} readOnly />
            </div>

            <div className="form-group">
              <label>수량</label>
              <input type="number" value={order.orderCount} readOnly />
            </div>

            <div className="form-group">
              <label>판매/구매</label>
              <input type="text" value={order.orderType === "SALE" ? "판매" : "구매"} readOnly />
            </div>

            <div className="form-group">
              <label>거래 승인 요청자</label>
              <input type="text" value={order.employeeName} readOnly />
            </div>

            <div className="form-group">
              <label>제품 재고</label>
              <input type="text" value={productData.stock} readOnly />
          </div>

          <div className="form-group">
              <label>주문 일자</label>
              <input type="text" readOnly />
          </div>

          <div className="form-group">
                <label>메모</label>
                <textarea name="memo" value={order.memo} readOnly />
          </div>

          <div className="request-product-detail-buttons">
            <button
              type="button"
              onClick={handleApprove}
              className="approve-button"
            >
              승인
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="reject-button"
            >
              반려
            </button>
          </div>
        </form>
      </div>
  );
};

export default RequestOrder;