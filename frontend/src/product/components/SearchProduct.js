import React, { useState } from "react";
import { getProductById, searchProductsByName } from "../api/productApi";
import "../scss/SearchProduct.scss";

const SearchProduct = ({ onSearchResults }) => {
  const [searchParams, setSearchParams] = useState({
    searchType: "productName", // 기본값: 제품명 검색
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data = [];

      if (searchParams.searchType === "id") {
        const product = await getProductById(searchParams.searchTerm);
        if (product?.error) {
          data = [];
        } else {
          data = [product];
        }
      } else if (searchParams.searchType === "productName") {
        const allProducts = await searchProductsByName(
          searchParams.searchTerm,
          0,
          5
        ); // 첫 페이지와 5개 표시
        data = allProducts; // 페이징을 고려하여 데이터 설정
      }

      onSearchResults(data);
    } catch (err) {
      console.error("검색 중 오류 발생:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-search-section">
      <form onSubmit={handleSearch} className="product-search-form ">
        <select
          name="searchType"
          value={searchParams.searchType}
          onChange={handleInputChange}
        >
          <option value="productName">제품명</option>
          <option value="id">제품 번호</option>
        </select>

        <input
          type="text"
          name="searchTerm"
          placeholder="검색어를 입력하세요"
          value={searchParams.searchTerm}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />

        <button type="submit">검색</button>
      </form>

      {loading && <p>검색 중...</p>}
    </div>
  );
};

export default SearchProduct;
