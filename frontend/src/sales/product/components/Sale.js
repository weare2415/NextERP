import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getClientByName } from "../../client/api/clientApi";
import { processSaleOrder } from "../../order/api/orderApi";
import "../scss/Sale.scss";

const Sale = ({ isOpen, onClose, selectedProduct }) => {
  const name = useSelector((state) => state.loginSlice.name) || "";
  const id = useSelector((state) => state.loginSlice.id) || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  // 초기 주문 데이터
  const initialOrderData = {
    productId: selectedProduct ? selectedProduct.id : "",
    quantity: "",
    price: selectedProduct ? selectedProduct.salePrice : "",
    clientCode: "",
    clientName: "",
    employeeName: name,
    employeeId: id,
    saleDate: new Date().toISOString().split("T")[0],
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
        price: selectedProduct.salePrice,
      }));
    }
  }, [selectedProduct]);

  // 거래처 검색 함수
  const searchClientByName = async (query) => {
    try {
      const response = await getClientByName(query);
      setSuggestions(
        response.content.map((client) => ({
          clientName: client.clientName,
          clientCode: client.clientCode,
        }))
      );
    } catch (err) {
      console.error("거래처 검색 오류:", err);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  // 검색어 변경 시 자동완성 실행
  useEffect(() => {
    if (searchTerm.length > 1) {
      searchClientByName(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSelectSuggestion = (suggestion) => {
    setIsSelecting(true);
    setSearchTerm(suggestion.clientName);
    setSuggestions([]);
    setOrderData((prev) => ({
      ...prev,
      clientName: suggestion.clientName,
      clientCode: suggestion.clientCode,
    }));
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex < 0 || selectedIndex >= suggestions.length) return;
      handleSelectSuggestion(suggestions[selectedIndex]);
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  // 판매 요청 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("최종 전송 데이터:", orderData);
    if (!orderData.clientCode) {
      alert("거래처를 선택하세요.");
      return;
    }
    try {
      const saleData = {
        productId: parseInt(orderData.productId, 10),
        quantity: parseInt(orderData.quantity, 10),
        salePrice: parseFloat(orderData.price),
        clientCode: orderData.clientCode,
        paymentAccountId: orderData.paymentAccountId,
        employee: {
          id: orderData.employeeId,
        },
        saleDate: orderData.saleDate,
        memo: orderData.memo || "",
      };

      await processSaleOrder(saleData);
      alert("판매 요청이 완료되었습니다!");
      onClose();
    } catch (error) {
      alert("판매 요청 처리 중 오류가 발생했습니다.");
      console.error("판매 요청 오류:", error);
    }
  };

  return (
    isOpen && (
      <div className="product-order-detail-form" onClick={onClose}>
        <div className="product-order-detail-header">
          <h2>판매 요청</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
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
            <label>판매 날짜</label>
            <input
              type="date"
              name="saleDate"
              value={orderData.saleDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>주문 기업명</label>
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
                    className={
                      selectedIndex === index && selectedIndex !== -1
                        ? "selected"
                        : ""
                    }
                    onMouseEnter={() => setSelectedIndex(index)}
                    onMouseDown={() => {
                      setIsSelecting(true);
                      setSearchTerm(item.clientName);
                      setOrderData((prev) => ({
                        ...prev,
                        clientName: item.clientName,
                        clientCode: item.clientCode,
                      }));
                      setSuggestions([]);
                      setSelectedIndex(-1);
                    }}
                  >
                    {item.clientName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label>판매 가격</label>
            <input
              type="number"
              name="price"
              value={orderData.price}
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label>주문 수량</label>
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
            <select
              name="paymentAccountId"
              value={orderData.paymentAccountId}
              onChange={handleChange}
            >
              <option value="101">현금</option>
              <option value="110">외상</option>
            </select>
          </div>

          <div className="form-group">
            <label>주문 담당자</label>
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
              판매 요청
            </button>
            <button
              type="button"
              className="close-button"
              onClick={handleClose}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default Sale;
