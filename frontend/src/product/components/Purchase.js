import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllClients } from "../../client/api/clientApi"; // 🔥 거래처 조회 API
import { processPurchase } from "../api/productApi"; // 🔥 구매 처리 API

const Purchase = ({ isOpen, onClose, selectedProduct }) => {
  const name = useSelector((state) => state.loginSlice.name) || "";
  const id = useSelector((state) => state.loginSlice.id) || "";
  const [orderData, setOrderData] = useState({
    productId: selectedProduct ? selectedProduct.id : "",
    quantity: "",
    price: selectedProduct ? selectedProduct.salePrice : "",
    clientCode: "", // ✅ 거래처 Code 저장
    companyName: "",
    employeeName: name,
    employeeId: id,
    orderDate: "",
    memo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      // 현재 날짜로 주문 날짜 설정 (YYYY-MM-DD 형식)
      const currentDate = new Date().toISOString().split("T")[0];

      setOrderData((prev) => ({
        ...prev,
        productId: selectedProduct.id,
        price: selectedProduct.salePrice,
        orderDate: currentDate, // ✅ 주문 날짜 자동 설정
      }));
    }
  }, [selectedProduct]);

  if (!isOpen) return null;

  // 🔎 거래처 검색 함수
  const searchClientByName = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const allClients = await getAllClients();
      const results = allClients
        .filter((client) => client.clientName.includes(term))
        .map((client) => ({
          clientCode: client.clientCode,
          clientName: client.clientName,
        }));

      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch (err) {
      console.error("거래처 검색 오류:", err);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // 🔎 검색어 입력 시 호출
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchClientByName(value);
  };

  // ✅ 거래처 선택 시 clientCode 저장
  const handleSelectClient = (client) => {
    console.log("선택한 거래처:", client); // 🔥 디버깅용 로그 추가
    setSearchTerm(client.clientName);
    setShowDropdown(false);
    setOrderData((prev) => ({
      ...prev,
      clientCode: client.clientCode, // ✅ clientCode 저장
      companyName: client.clientName, // 선택한 거래처명 반영
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 판매 요청 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("최종 전송 데이터:", orderData); // 🔥 디버깅용 로그 추가

    if (!orderData.clientCode) {
      alert("거래처를 선택하세요.");
      return;
    }

    try {
      const purchaseData = {
        productId: orderData.productId,
        quantity: orderData.quantity,
        price: orderData.price,
        clientCode: orderData.clientCode,
        paymentAccountId: "201",
        employee: {
          id: orderData.employeeId, // 🔥 로그인된 직원 ID 전송
        },
      };

      await processPurchase(purchaseData);
      alert("구매 요청이 완료되었습니다!");
      onClose();
    } catch (error) {
      alert("구매 요청 처리 중 오류가 발생했습니다.");
      console.error("구매 요청 오류:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>구매 요청</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
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

              {/* 🔥 거래처 검색 input */}
              <div className="form-group">
                <label>발주 기업명:</label>
                <input
                  type="text"
                  placeholder="거래처명을 입력하세요"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(searchResults.length > 0)}
                />
                {/* 🔥 검색 결과 드롭다운 */}
                {showDropdown && (
                  <ul className="dropdown">
                    {searchResults.map((client, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectClient(client)}
                      >
                        {client.clientName}
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
                <label>발주 날짜:</label>
                <input
                  type="date"
                  name="orderDate"
                  value={orderData.orderDate}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              <div className="form-group">
                <label>발주 담당자:</label>
                <input
                  type="text"
                  name="employeename"
                  value={orderData.employeename}
                  readOnly
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>메모:</label>
                <textarea
                  name="memo"
                  value={orderData.memo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="update-button">
                구매 요청
              </button>
              <button type="button" className="close-button" onClick={onClose}>
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
