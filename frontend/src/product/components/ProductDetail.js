import React, {useEffect, useState} from "react";
import { updateProduct, deleteProduct } from "../api/productApi";
import "../scss/ProductDetail.scss";
import {getEmployeeById} from '../../employee/api/employeeApi';

const ProductDetail = ({ product, onClose, onDeleteSuccess, onUpdateSuccess }) => {

  const [editedProduct, setEditedProduct] = useState(product || {
    id: "",
    productName: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
    specifications: "",
    createdDate: "",
    employeeId: "",
    employeeName:"",
    memo: ""
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      if (editedProduct.employeeId) {
        try {
          const employeeData = await getEmployeeById(editedProduct.employeeId);
          setEditedProduct((prev) => ({
            ...prev,
            employeeName: employeeData.name || "담당자 없음",
          }));
          console.log("Employee ID: ", employeeData);
        } catch (error) {
          console.error("❌ 직원 정보 불러오기 실패:", error);
        }
      }
    };

    fetchEmployee();
  }, [editedProduct.employeeId]);

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 영역 */}
        <div className="modal-header">
          <h2>제품 상세 정보</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* 제품 상세 내용 */}
        <div className="modal-content">
          <div className="form-grid">
            <div className="form-group">
              <label>제품 ID</label>
              <input type="text" value={editedProduct.id} readOnly />
            </div>

            <div className="form-group">
              <label>제품명</label>
              <input type="text" name="productName" value={editedProduct.productName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>매입 가격</label>
              <input type="number" name="purchasePrice" value={editedProduct.purchasePrice} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>판매 가격</label>
              <input type="number" name="salePrice" value={editedProduct.salePrice} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>재고 수량</label>
              <input type="number" name="stock" value={editedProduct.stock} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>제품 규격</label>
              <input type="text" name="specifications" value={editedProduct.specifications} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>등록 날짜</label>
              <input type="text" value={editedProduct.createdDate} readOnly />
            </div>

            <div className="form-group">
              <label>담당자</label>
              <input type="text" value={editedProduct.employeeName || "담당자 없음"} readOnly />
            </div>

            <div className="form-group full-width">
              <label>메모</label>
              <textarea name="memo" value={editedProduct.memo} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="button-container">
          <button className="update-button" onClick={handleUpdate}>수정</button>
          <button className="delete-button" onClick={handleDelete}>삭제</button>
          <button className="close-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
