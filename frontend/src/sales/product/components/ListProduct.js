import React, { useEffect, useState } from "react";
import "../scss/ListProduct.scss";
import Sale from "./Sale";
import Purchase from "./Purchase";
import { getAllProducts } from "../api/productApi";
import Pagination from "../../../common/component/Pagination";
import useEmployeeNames from "../../../common/hooks/useEmployeeNames";

const ListProduct = ({ onProductSelect, products: externalProducts = [] }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const employeeNames = useEmployeeNames(products, "employeeId");

  // 외부에서 전달된 products가 있으면 이를 사용, 없으면 전체 목록을 가져옴
  useEffect(() => {
    if (externalProducts && externalProducts.length > 0) {
      setProducts(externalProducts);
    } else {
      fetchAllProducts(page);
    }
  }, [externalProducts, page]);

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

  return (
    <div className="product-list-wrapper">
      <div className="product-table-section">
        <table className="product-list-grid">
          <thead>
            <tr>
              <th>제품 ID</th>
              <th>제품명</th>
              <th>판매 가격</th>
              <th>재고 수량</th>
              <th>담당자</th>
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
                  <td
                    className="product-name-btn"
                    onClick={() => onProductSelect(product)}
                  >
                    {product.productName}
                  </td>
                  <td>
                    {product?.salePrice
                      ? parseFloat(product.salePrice).toLocaleString() + " 원"
                      : "가격 없음"}
                  </td>
                  <td>{product.stock}</td>
                  <td>{employeeNames[product.employeeId] || "Loading..."}</td>
                  <td>
                    <button
                      className="sale-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSaleModalOpen(true);
                        setSelectedProduct(product);
                      }}
                    >
                      판매
                    </button>
                    <button
                      className="purchase-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPurchaseModalOpen(true);
                        setSelectedProduct(product);
                      }}
                    >
                      구매
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

      {/* 외부 검색 결과가 없을 때만 페이지네이션 표시 */}
      {(!externalProducts || externalProducts.length === 0) && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {(isSaleModalOpen || isPurchaseModalOpen) && (
        <div>
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
