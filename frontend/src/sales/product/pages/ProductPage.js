import React, { useState } from "react";
import CreateProduct from "../components/CreateProduct";
import ProductDetail from "../components/ProductDetail";
import ListProduct from "../components/ListProduct";
import "../scss/ProductPage.scss";
import BasicLayout from "../../../common/pages/BasicLayout";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentView, setCurrentView] = useState("상태");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetailForm(true);
  };

  const handleCreateSuccess = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setShowCreateForm(false);
  };

  const handleDeleteSuccess = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
    setShowDetailForm(false);
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setShowDetailForm(false);
    setSelectedProduct(null);
  };

  return (
    <BasicLayout>
      <div className="product-page-container">
        <div className="page-header">
          <h1>제품 관리</h1>
          <div className="header-right">
            <button
              className="new-product-btn"
              onClick={() => setShowCreateForm(true)}
            >
              신규등록
            </button>
          </div>
        </div>

        <ListProduct products={products} onProductSelect={handleProductClick} />

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
