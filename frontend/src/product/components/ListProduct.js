import React, { useEffect, useState } from "react";
import "../../product/scss/ListProduct.scss";
import SearchProduct from "../components/SearchProduct";
import Sale from "../components/Sale";
import Purchase from "../components/Purchase";
import { getAllProducts } from "../api/productApi";
import Pagination from '../../common/component/Pagination';
import {getEmployeeById} from '../../member/api/memberApi';

const ListProduct = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [employeeNames, setEmployeeNames] = useState({});


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

  // ✅ 직원 이름 가져오기
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const employeeIds = [...new Set(products.map(product => product.employeeId))];
      const employeeData = {};

      await Promise.all(employeeIds.map(async (id) => {
        try {
          const employeeInfo = await getEmployeeById(id);
          employeeData[id] = employeeInfo.name;
        } catch (error) {
          console.error(`Error fetching employee with ID ${id}:`, error);
          employeeData[id] = "알 수 없음";
        }
      }));

      setEmployeeNames(employeeData);
    };

    if (products.length > 0) {
      fetchEmployeeNames();
    }
  }, [products]);

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
                      onClose={()=> fetchAllProducts}
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
      {totalPages > 1 && (
          <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
          />
      )}

      <Sale
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false) && {fetchAllProducts}}
        selectedProduct={selectedProduct}
      />
      <Purchase
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false) && {fetchAllProducts}}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default ListProduct;
