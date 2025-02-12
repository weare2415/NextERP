import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllClients } from "../../client/api/clientApi"; // 🔥 거래처 조회 API
import { processSaleOrder } from "../../order/api/orderApi";
import "../scss/Sale.scss";

const Sale = ({ isOpen, onClose, selectedProduct }) => {
  const name = useSelector((state) => state.loginSlice.name) || "";
  const id = useSelector((state) => state.loginSlice.id) || "";
  const [orderData, setOrderData] = useState({
    productId: selectedProduct ? selectedProduct.id : "",
    quantity: "",
    price: selectedProduct ? selectedProduct.salePrice : "",
    clientCode: "",
    companyName: "",
    employeename: name,
    employeeId: id,
    orderDate: "",
    memo: "",
    paymentAccountId: "101",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      const currentDate = new Date().toISOString().split("T")[0];

      setOrderData((prev) => ({
        ...prev,
        productId: selectedProduct.id,
        price: selectedProduct.salePrice,
        orderDate: currentDate,
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
    console.log("선택한 거래처:", client);
    setSearchTerm(client.clientName);
    setShowDropdown(false);
    setOrderData((prev) => ({
      ...prev,
      clientCode: client.clientCode,
      companyName: client.clientName,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 판매 요청 API 호출
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
    <div className="product-order-detail-form" onClick={onClose}>
      <div className="product-order-detail-header">
        <h2>판매 요청</h2>
        <button className="close-button" onClick={onClose}>
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
          <label>주문 기업명</label>
          <input
            type="text"
            placeholder="거래처명을 입력하세요"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(searchResults.length > 0)}
          />
          {showDropdown && (
            <ul className="dropdown">
              {searchResults.map((client, index) => (
                <li key={index} onClick={() => handleSelectClient(client)}>
                  {client.clientName}
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
          <label>주문 날짜</label>
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
          <label>주문 담당자</label>
          <input
            type="text"
            name="employeename"
            value={orderData.employeename}
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
          <button type="button" className="close-button" onClick={onClose}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sale;
