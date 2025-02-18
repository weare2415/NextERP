import React, { useEffect, useState } from "react";
import "../scss/ListProduct.scss";
import SearchProduct from "./SearchProduct";
import Sale from "./Sale";
import Purchase from "./Purchase";
import { getAllProducts } from "../api/productApi";
import Pagination from "../../../common/component/Pagination";
import { getEmployeeById } from "../../../common/member/api/memberApi";
import useEmployeeNames from "../../../common/hooks/useEmployeeNames";

const ListProduct = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const employeeNames = useEmployeeNames(products, "employeeId");

  useEffect(() => {
    fetchAllProducts(page);
  }, [page]);

  const fetchAllProducts = async (page) => {
    try {
      const response = await getAllProducts(page, size);

      setProducts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError("제품 목록을 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching all products:", error);
    }
  };

  const handleSearchResults = (results) => {
    setProducts(results.length > 0 ? results : []);
    setError(results.length === 0 ? "검색한 제품이 존재하지 않습니다." : null);
  };

  return (
    <div className="product-list-wrapper">
      <SearchProduct onSearchResults={handleSearchResults} />

      <div className="product-table-section">
        <table>
          <thead>
            <tr>
              <th>제품 ID</th>
              <th>제품명</th>
              <th>판매 가격</th>
              <th>재고 수량</th>
              <th>담당자</th>
              <th>상세정보</th>
              <th>판매/구매</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                  {error}
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.productName}</td>
                  <td>
                    {product?.salePrice
                      ? parseFloat(product.salePrice).toLocaleString() + " 원"
                      : "가격 없음"}
                  </td>
                  <td>{product.stock}</td>
                  <td>{employeeNames[product.employeeId] || "Loading..."}</td>
                  <td>
                    <button
                      className="product-table-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductSelect(product);
                      }}
                      onClose={() => fetchAllProducts}
                    >
                      보기
                    </button>
                  </td>
                  <td>
                    <button
                      className="sale-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSaleModalOpen(true);
                        setSelectedProduct(product);
                      }}
                    >
                      판매 요청
                    </button>
                    <button
                      className="purchase-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPurchaseModalOpen(true);
                        setSelectedProduct(product);
                      }}
                    >
                      구매 요청
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  제품을 검색해주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      {(isSaleModalOpen || isPurchaseModalOpen) && (
        <div className="modal-overlay">
          {isSaleModalOpen && (
            <Sale
              isOpen={isSaleModalOpen}
              onClose={() => setIsSaleModalOpen(false)}
              selectedProduct={selectedProduct}
            />
          )}
          {isPurchaseModalOpen && (
            <Purchase
              isOpen={isPurchaseModalOpen}
              onClose={() => setIsPurchaseModalOpen(false)}
              selectedProduct={selectedProduct}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ListProduct;
