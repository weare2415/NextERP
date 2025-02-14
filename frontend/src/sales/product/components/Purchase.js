import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {getClientByName} from "../../client/api/clientApi";
import { processPurchaseOrder } from "../../order/api/orderApi";
import "../scss/Sale.scss";


const Purchase = ({ isOpen, onClose, selectedProduct }) => {
  const name = useSelector((state) => state.loginSlice.name) || "";
  const id = useSelector((state) => state.loginSlice.id) || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const todayDate = new Date().toISOString().split("T")[0];

  // 초기 주문 데이터
  const initialOrderData = {
    productId: selectedProduct ? selectedProduct.id : "",
    quantity: "",
    price: selectedProduct ? selectedProduct.purchasePrice : "",
    clientCode: "",
    clientName: "",
    employeeName: name,
    employeeId: id,
    orderDate: todayDate,
    memo: "",
    paymentAccountId: "101",
  };
  const [orderData, setOrderData] = useState(initialOrderData);

  // 주문 데이터 초기화
  const resetOrderData = () => {
    setSearchTerm("");
    setSuggestions([]);
    setOrderData(initialOrderData);
  };

  const handleClose = () => {
    resetOrderData();
    onClose();
  };

  useEffect(() => {
    if (selectedProduct) {
      setOrderData((prev) => ({
        ...prev,
        productId: selectedProduct.id,
        price: selectedProduct.purchasePrice,
        orderDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, [selectedProduct]);

  // 거래처 검색 함수
  const searchClientByName = async (query) => {
    try {
      let result = [];

      const response = await getClientByName(query);
      result = response.content.map((client => ({clientName: client.clientName, clientCode: client.clientCode })))
      setSuggestions(result);
    } catch (err) {
      console.error("거래처 검색 오류:", err);
      setSuggestions([])
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어 변경 시 자동완성 실행
  useEffect(() => {
    if (searchTerm.length > 1 && !isSelecting) {
      searchClientByName(searchTerm);
    } else {
      setSuggestions([]);
    }
    setIsSelecting(false);
  }, [searchTerm]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (selectedIndex < 0 || selectedIndex >= suggestions.length) return; // 인덱스 범위 체크

      const selectedItem = suggestions[selectedIndex];
      if (!selectedItem) return;

      setIsSelecting(true);
      setSearchTerm("")
      setSuggestions([]);
      setOrderData(prev => ({
        ...prev,
        clientName: selectedItem.clientName,
        clientCode: selectedItem.clientCode,
      }))
      e.preventDefault();
      setSearchTerm(selectedItem.clientName);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 구매매 요청 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("최종 전송 데이터:", orderData);
    if (!orderData.clientCode) {
      alert("거래처를 선택하세요.");
      return;
    }

    try {
      const purchaseData = {
        productId: parseInt(orderData.productId, 10),
        quantity: parseInt(orderData.quantity, 10),
        purchasePrice: parseFloat(orderData.price),
        clientCode: orderData.clientCode,
        paymentAccountId: orderData.paymentAccountId,
        employee: {
          id: orderData.employeeId,
        },
        memo: orderData.memo || "",
      };

      await processPurchaseOrder(purchaseData);
      alert("구매 요청이 완료되었습니다!");
      onClose();
    } catch (error) {
      alert("구매 요청 처리 중 오류가 발생했습니다.");
      console.error("구매 요청 오류:", error);
    }
  };

  return (
      isOpen && (
      <div className="product-order-detail-form" onClick={onClose}>
        <div className="product-order-detail-header">
          <h2>구매 요청</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제품 번호:</label>
            <input
                type="text"
                name="productId"
                value={orderData.productId}
                readOnly
                required
            />
          </div>

          <div className="form-group">
            <label>발주 기업명:</label>
            <input
                type="text"
                placeholder="거래처명을 입력하세요"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            {/*자동완성 드롭다운 */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((item, index) => (
                      <li
                          key={item.clientCode || item.clientName || index}
                          className={selectedIndex === index ? "selected" : ""}
                          onMouseDown={() => {
                            setIsSelecting(true);
                            setSearchTerm(item.clientName);
                            setSuggestions([]);
                          }}
                      >
                        {item.clientName}
                      </li>
                  ))}
                </ul>
            )}
          </div>

          <div className="form-group">
            <label>발주 가격:</label>
            <input
                type="number"
                name="price"
                value={orderData.price}
                readOnly
                required
            />
          </div>

          <div className="form-group">
            <label>발주 수량:</label>
            <input
                type="number"
                name="quantity"
                value={orderData.quantity}
                onChange={handleChange}
                required
            />
          </div>

          <div className="form-group">
            <label>결제 방식</label>
            <select name="paymentAccountId" value={orderData.paymentAccountId} onChange={handleChange}>
              <option value="101">현금</option>
              <option value="110">외상</option>
            </select>
          </div>

          <div className="form-group">
            <label>발주 담당자:</label>
            <input
                type="text"
                name="employeeName"
                value={name}
                readOnly
                required
            />
          </div>

          <div className="form-group">
            <label>메모</label>
            <textarea
                name="memo"
                value={orderData.memo}
                onChange={handleChange}
            />
          </div>
          <div className="product-order-detail-buttons">
            <button type="submit" className="update-button">
              구매 요청
            </button>
            <button type="button" className="close-button" onClick={handleClose}>
              취소
            </button>
          </div>
        </form>
      </div>
  )
  );
};

export default Purchase;
