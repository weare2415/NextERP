import React, { useState } from "react";
import { updateProduct, deleteProduct } from "../api/productApi";
import "../scss/ProductDetail.scss";

const ProductDetail = ({
  product,
  onClose,
  onDeleteSuccess,
  onUpdateSuccess,
}) => {
  const [editedProduct, setEditedProduct] = useState(
    product || {
      id: "",
      productName: "",
      purchasePrice: "",
      salePrice: "",
      stock: "",
      specifications: "",
      createdDate: "",
      employeeId: "",
      employeeName: "",
      memo: "",
    }
  );

  const handleChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateProduct(product.id, editedProduct);
      onUpdateSuccess(updated);
      alert("✅ 제품 정보가 수정되었습니다.");
      onClose();
    } catch (error) {
      console.error("❌ 제품 수정 실패:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("❌ 해당 제품을 삭제하시겠습니까?")) {
      try {
        await deleteProduct(product.id);
        onDeleteSuccess(product.id);
        alert("✅ 제품이 삭제되었습니다.");
        onClose();
      } catch (error) {
        console.error("❌ 제품 삭제 실패:", error);
      }
    }
  };

  return (
    <div className="product-detail-form" onClick={onClose}>
      <div className="product-detail-header">
        <h2>제품 상세 정보</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <form onClick={(e) => e.stopPropagation()}>
        <div className="form-group">
          <label>제품 ID</label>
          <input type="text" value={editedProduct.id} readOnly />
        </div>

        <div className="form-group">
          <label>제품명</label>
          <input
            type="text"
            name="productName"
            value={editedProduct.productName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>매입 가격</label>
          <input
            type="number"
            name="purchasePrice"
            value={editedProduct.purchaseprice}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>판매 가격</label>
          <input
            type="number"
            name="salePrice"
            value={editedProduct.saleprice}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>재고 수량</label>
          <input
            type="number"
            name="stock"
            value={editedProduct.stock}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>제품 규격</label>
          <input
            type="text"
            name="specifications"
            value={editedProduct.specifications}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>등록 날짜</label>
          <input type="text" value={editedProduct.createdDate} readOnly />
        </div>

        <div className="form-group">
          <label>담당자</label>
          <input
            type="text"
            value={editedProduct.employee?.name || "담당자 없음"}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>메모</label>
          <textarea
            name="memo"
            value={editedProduct.memo}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="product-detail-buttons">
          <button
            type="button"
            className="update-button"
            onClick={handleUpdate}
          >
            수정
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;
