import React, { useState } from "react";
import CreateProduct from "../components/CreateProduct";
import ProductDetail from "../components/ProductDetail";
import ListProduct from "../components/ListProduct";
import "../scss/ProductPage.scss";
import BasicLayout from "../../common/pages/BasicLayout";
import SearchProduct from "../components/SearchProduct";
import Sale from "../components/Sale";
import Purchase from "../components/Purchase";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
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

  const handleOpenSaleModal = (product) => {
    setSelectedProduct(product);
    setShowSaleModal(true);
  };

  const handleOpenPurchaseModal = (product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailForm(false);
    setShowSaleModal(false);
    setShowPurchaseModal(false);
    setSelectedProduct(null);
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

  const handleSearchResults = (results) => {
    console.log("SearchProdcut에서 전달된 검색 결과:", results);
    setSearchResults(results);
  };

  return (
    <BasicLayout>
      <div className="product-page-container">
        <div className="page-header">
          <h1>제품 관리</h1>
          <div className="header-right">
            <SearchProduct onSearchResults={handleSearchResults} />
            <button
              className="new-product-btn"
              onClick={() => setShowCreateForm(true)}
            >
              신규등록
            </button>
            <div className="filter-buttons">
              <button onClick={toggleDropdown}>{currentView}</button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button>전체 제품 보기</button>
                  <button>삭제된 제품 보기</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ListProduct
          products={searchResults || products}
          onProductSelect={handleProductClick}
          onSaleRequest={handleOpenSaleModal}
          onPurchaseRequest={handleOpenPurchaseModal}
        />

        {showCreateForm && (
          <div className="modal-overlay">
            <CreateProduct
              onClose={() => setShowCreateForm(false)}
              onSuccess={handleCreateSuccess}
            />
          </div>
        )}
        {showDetailForm && selectedProduct && (
          <div className="modal-overlay">
            <ProductDetail
              product={selectedProduct}
              onClose={handleCloseModal}
              onDeleteSuccess={() => handleDeleteSuccess(selectedProduct.id)}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>
        )}
        {showSaleModal && selectedProduct && (
          <div className="modal-overlay">
            <Sale
              isOpen={showSaleModal}
              onClose={handleCloseModal}
              selectedProduct={selectedProduct}
            />
          </div>
        )}
        {showPurchaseModal && selectedProduct && (
          <div className="modal-overlay">
            <Purchase
              isOpen={showPurchaseModal}
              onClose={handleCloseModal}
              selectedProduct={selectedProduct}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default ProductPage;
