import React, { useEffect, useState } from "react";
import "../scss/ListProduct.scss";
import { getAllProducts } from "../api/productApi";
import { getEmployeeById } from "../../member/api/memberApi";

const ListProduct = ({
  onProductSelect,
  products,
  onSaleRequest,
  onPurchaseRequest,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employeeNames, setEmployeeNames] = useState({});
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("상태");
  const [paginationData, setPaginationData] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const dataToShow = filteredProducts.length > 0 ? filteredProducts : products;

  const fetchAllProducts = async (page = 0) => {
    setDropdownOpen(false);
    try {
      const response = await getAllProducts(page);
      setFilteredProducts(response.content);
      setPaginationData({
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
      await fetchEmployeeNames(response.content);

      setCurrentView("전체 상품 보기");
    } catch (error) {
      console.error("Error fetching all products:", error);
      setError("제품 목록을 불러오는데 실패했습니다.");
    }
  };

  // ✅ 직원 이름 가져오기
  const fetchEmployeeNames = async (productList) => {
    const uniqueEmployeeIds = [
      ...new Set(productList.map((product) => product.employeeId)),
    ].filter(Boolean);
    const employeeData = {};

    try {
      const employeePromises = uniqueEmployeeIds.map(async (id) => {
        try {
          const employeeInfo = await getEmployeeById(id);
          return { id, name: employeeInfo.name };
        } catch (error) {
          console.error(`Error fetching employee with ID ${id}:`, error);
          return { id, name: "알 수 없음" };
        }
      });

      // 모든 직원 데이터를 기다린 후 상태 업데이트
      const resolvedEmployees = await Promise.all(employeePromises);
      resolvedEmployees.forEach(({ id, name }) => {
        employeeData[id] = name;
      });

      setEmployeeNames(employeeData);
    } catch (error) {
      console.error("Error fetching employee names:", error);
      setEmployeeNames({});
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-buttons")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 페이지 변경 시 호출
  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= paginationData.totalPages) {
      return;
    }
    fetchAllProducts(newPage);
  };

  return (
    <div className="product-list-wrapper">
      <div className="product-table-section">
        <table>
          <thead>
            <tr>
              <th>제품 ID</th>
              <th>제품명</th>
              <th>판매 가격</th>
              <th>재고 수량</th>
              <th>담당자</th>
              <th>작업</th>
              <th>판매/구매</th>
            </tr>
          </thead>
          <tbody>
            {dataToShow.length > 0 ? (
              dataToShow.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.productName}</td>
                  <td>
                    {product?.salePrice?.toLocaleString() || "가격 없음"} 원
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
                    >
                      보기
                    </button>
                  </td>
                  <td>
                    <button
                      className="sale-btn"
                      onClick={() => onSaleRequest(product)}
                    >
                      판매 요청
                    </button>
                    <button
                      className="purchase-btn"
                      onClick={() => onPurchaseRequest(product)}
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

      {/* 페이징 부분 항상 렌더링 */}
      <div className="pagination-controls">
        <button
          disabled={paginationData.currentPage === 0}
          onClick={() => handlePageChange(paginationData.currentPage - 1)}
        >
          이전
        </button>
        <span>
          {paginationData.currentPage + 1} / {paginationData.totalPages}
        </span>
        <button
          disabled={
            paginationData.currentPage === paginationData.totalPages - 1
          }
          onClick={() => handlePageChange(paginationData.currentPage + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ListProduct;
