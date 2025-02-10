import React, { useState } from "react";
import CreateProduct from "../components/CreateProduct"; // ✅ components로 수정
import ProductDetail from "../components/ProductDetail"; // ✅ components로 수정
import ListProduct from "../components/ListProduct"; // ✅ components로 수정
import "../scss/ProductPage.scss"; // ✅ 올바른 경로로 수정
import BasicLayout from "../../common/pages/BasicLayout";

const ProductPage = () => {
  const [products, setProducts] = useState([]); // ✅ 제품 목록 상태 추가
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetailForm(true);
  };

  const handleCreateSuccess = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]); // ✅ 리스트에 추가
    setShowCreateForm(false);
  };

  const handleDeleteSuccess = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    ); // ✅ 리스트에서 삭제
    setShowDetailForm(false);
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    ); // ✅ 리스트 업데이트
    setShowDetailForm(false);
    setSelectedProduct(null);
  };

  return (
    <BasicLayout>
      <div className="product-page-container">
        <div className="page-header">
          <h1>제품 관리</h1>
          <button
            className="new-product-btn"
            onClick={() => setShowCreateForm(true)}
          >
            신규등록
          </button>
        </div>

        <ListProduct
          products={products} // ✅ props 추가
          onProductSelect={handleProductClick}
        />

        {(showCreateForm || showDetailForm) && (
          <div className="modal-overlay">
            {showCreateForm && (
              <CreateProduct
                onClose={() => setShowCreateForm(false)}
                onSuccess={handleCreateSuccess}
              />
            )}
            {showDetailForm && selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                onClose={() => {
                  setShowDetailForm(false);
                  setSelectedProduct(null);
                }}
                onDeleteSuccess={() => handleDeleteSuccess(selectedProduct.id)}
                onUpdateSuccess={handleUpdateSuccess}
              />
            )}
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default ProductPage;
