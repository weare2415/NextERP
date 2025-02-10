import React, { useEffect, useState } from "react";
import "../../product/scss/ListProduct.scss";
import SearchProduct from "../components/SearchProduct";
import Sale from "../components/Sale";
import Purchase from "../components/Purchase";
import Pagination from "../../common/util/Pagination";
import { getAllProducts } from "../api/productApi";
import { getEmployeeById } from "../../employee/api/employeeApi";

const ListProduct = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchAllProducts();
  }, [currentPage]);

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts(currentPage - 1, pageSize);

      console.log(response.content);

      if (response.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // 제품 데이터를 가져온 후 직원 이름을 API로 조회
        const productsWithEmployeeNames = await Promise.all(
          response.content.map(async (product) => {
            let employeeName = "담당자 없음";
            if (product.employeeId) {
              try {
                const employee = await getEmployeeById(product.employeeId);
                employeeName = employee.name || "담당자 없음";
              } catch (error) {
                console.error("직원 정보를 불러오는 중 오류가 발생했습니다.");
              }
            }
            return { ...product, employeeName };
          })
        );
        setProducts(productsWithEmployeeNames);
      }

      setError(null);
    } catch (error) {
      setError("제품 목록을 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching all products:", error);
    }
  };

  const handleSearchResults = (results) => {
    setProducts(results.length > 0 ? results : []);
    setError(results.length === 0 ? "검색한 제품이 존재하지 않습니다." : null);
    setCurrentPage(1);
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
                  <td>{product.employeeName || "담당자 없음"}</td>
                  <td>
                    <button
                      className="product-table-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductSelect(product);
                      }}
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
        currentPage={currentPage}
        totalItems={products.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <Sale
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        selectedProduct={selectedProduct}
      />
      <Purchase
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default ListProduct;
