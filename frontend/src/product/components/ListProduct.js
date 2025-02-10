import React, {useEffect, useState} from "react";
import "../scss/ListProduct.scss";
import SearchProduct from "../components/SearchProduct";
import Sale from "../components/Sale";
import Purchase from "../components/Purchase";
import Pagination from "../../common/util/Pagination";
import { paginate } from "../../common/util/paginationUtils";
import {getEmployeeById} from '../../employee/api/employeeApi';

const ListProduct = ({ onProductSelect, products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeNames, setEmployeeNames] = useState({})
  const pageSize = 10;

  // 현재 페이지에 맞는 데이터 가져오기
  const dataToShow = filteredProducts !== null ? filteredProducts : products;
  const paginatedData = paginate(dataToShow, currentPage, pageSize);

  // 검색 결과 업데이트 시 1페이지로 초기화
  const handleSearchResults = (results) => {
    setFilteredProducts(results.length > 0 ? results : null);
    setCurrentPage(1);
  };

  const handleOpenSaleModal = (product) => {
    setIsSaleModalOpen(true);
    setSelectedProduct(product);
  };

  const handleCloseSaleModal = () => {
    setIsSaleModalOpen(false);
  };

  const handleOpenPurchaseModal = (product) => {
    setIsPurchaseModalOpen(true);
    setSelectedProduct(product);
  };

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      if (products.employeeId) {
        try {
          const employeeData = await getEmployeeById(products.employeeId);
          products((prev) => ({
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
  }, []);

  return (
    <div className="list-product">
      <SearchProduct onSearchResults={handleSearchResults} />
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
          {paginatedData.length > 0 ? (
            paginatedData.map((product) => (
              <tr key={product.id} onClick={() => onProductSelect(product)}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>
                  {product?.salePrice?.toLocaleString() || "가격 없음"} 원
                </td>
                <td>{product.stock}</td>
                <td>
                  {product.employeeId
                      ? employeeNames[product.employeeId] || "로딩 중..."
                      : "담당자 없음"}
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductSelect(product);
                    }}
                  >
                    상세보기
                  </button>
                </td>
                <td>
                  <button
                    className="sale-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSaleModal(product);
                    }}
                  >
                    판매 요청
                  </button>

                  <button
                    className="purchase-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPurchaseModal(product);
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

      <Pagination 
        currentPage={currentPage} 
        totalItems={dataToShow.length} 
        pageSize={pageSize} 
        onPageChange={setCurrentPage} 
      />

      <Sale
        isOpen={isSaleModalOpen}
        onClose={handleCloseSaleModal}
        selectedProduct={selectedProduct}
      />

      <Purchase
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default ListProduct;
