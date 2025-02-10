import React, { useState } from "react";
import { createProduct } from "../api/productApi";
import { useSelector } from "react-redux";
import "../scss/CreateProduct.scss";

const CreateProduct = ({ onClose, onSuccess }) => {
  const [productData, setProductData] = useState({
    productName: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
    specifications: "",
    memo: "",
  });

  const employeeId = useSelector((state) => state.loginSlice.id);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = await createProduct({ ...productData, employeeId });
      alert("✅ 등록이 완료되었습니다.");
      onSuccess(newProduct);
      onClose();
    } catch (error) {
      alert("❌ 제품 등록에 실패했습니다.");
      console.error("❌ 제품 등록 실패:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-product-form" onClick={(e) => e.stopPropagation()}>
        <h2>제품 등록</h2>

        <form onSubmit={handleSubmit}>
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
              value={productData.purchasePrice}
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
              value={productData.salePrice}
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
            <input
              type="text"
              name="employeeId"
              value={employeeId}
              readOnly
            />
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

          <div className="form-group">
            <button type="submit">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
