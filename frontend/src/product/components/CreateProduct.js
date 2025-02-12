import React, { useEffect, useState } from "react";
import { createProduct } from "../api/productApi";
import { useSelector } from "react-redux";
import "../scss/CreateProduct.scss";
import { getEmployeeByName } from "../../member/api/memberApi";

const CreateProduct = ({ onClose, onSuccess }) => {
  const name = useSelector((state) => state.loginSlice.name);

  const [productData, setProductData] = useState({
    productName: "",
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    specifications: "",
    memo: "",
    employeeName: name,
    employeeId: "",
  });

  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (name) {
        try {
          const employees = await getEmployeeByName(name);
          if (employees.length > 0) {
            setProductData((prev) => ({
              ...prev,
              employeeId: employees[0].id, // 첫 번째 검색 결과의 ID 저장
            }));
          }
        } catch (error) {
          console.error("사원 ID 조회 실패:", error);
        }
      }
    };

    fetchEmployeeId();
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]:
        name === "purchasePrice" || name === "salePrice" || name === "stock"
          ? parseFloat(value) || 0 // 숫자 필드 변환
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = await createProduct(productData);
      alert("✅ 등록이 완료되었습니다.");
      onSuccess(newProduct);
      onClose();
    } catch (error) {
      alert("❌ 제품 등록에 실패했습니다.");
      console.error("❌ 제품 등록 실패:", error);
    }
  };

  return (
    <div className="product-create-form" onClick={onClose}>
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
            name="employeeName"
            value={productData.employeeName}
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

        <div className="product-create-buttons">
          <button type="submit">등록</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
