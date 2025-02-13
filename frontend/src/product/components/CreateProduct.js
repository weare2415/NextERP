import React, { useState } from "react";
import { createProduct } from "../api/productApi";
import { useSelector } from "react-redux";
import "../scss/CreateProduct.scss"; // ✅ SCSS 파일 import

const CreateProduct = ({ onClose, onSuccess }) => {
  const [productData, setProductData] = useState({
    productName: "",
    purchasePrice: "", // 수정된 필드 이름
    salePrice: "", // 수정된 필드 이름
    stock: "",
    specifications: "",
    memo: "",
  });

  const employeeId = useSelector((state) => state.loginSlice.id); // 로그인한 사용자의 ID 가져오기

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // employeeId가 이미 productData에 포함되어 있는지 확인하고, 없으면 추가
    const productDataToSend = { ...productData, employeeId };

    // 데이터 전송
    try {
      const newProduct = await createProduct(productDataToSend);
      alert("✅ 등록이 완료되었습니다.");
      onSuccess(newProduct);
      onClose();
    } catch (error) {
      alert("❌ 제품 등록에 실패했습니다.");
      console.error("❌ 제품 등록 실패:", error);
      onClose();
    }
  };

  return (
    <div className="product-create-form " onClick={onClose}>
      {" "}
      {/* ✅ 바깥 클릭 시 닫힘 */}
      <div
        className="product-create-header"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* ✅ 내부 클릭 시 닫히지 않음 */}
        <h2>제품 등록</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="form-group">
          <label>제품명</label>
          <input
            type="text"
            name="productName"
            placeholder="제품명을 입력하세요"
            value={productData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>재고 수량</label>
          <input
            type="number"
            name="stock"
            placeholder="재고 수량을 입력하세요"
            value={productData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>매입 가격</label>
          <input
            type="number"
            name="purchasePrice"
            placeholder="매입 가격을 입력하세요"
            value={productData.purchaseprice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>판매 가격</label>
          <input
            type="number"
            name="salePrice"
            placeholder="판매 가격을 입력하세요"
            value={productData.saleprice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>제품 규격</label>
          <input
            type="text"
            name="specifications"
            placeholder="제품 규격을 입력하세요"
            value={productData.specifications}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>담당자 ID</label>
          <input type="text" name="employeeId" value={employeeId} readOnly />
        </div>

        <div className="form-group">
          <label>메모</label>
          <textarea
            name="memo"
            placeholder="메모를 입력하세요"
            value={productData.memo}
            onChange={handleChange}
          />
        </div>

        <div className="product-create-buttons">
          <button type="submit">등록</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
