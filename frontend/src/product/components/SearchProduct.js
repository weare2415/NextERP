import React, { useState } from "react";
import {
  getProductById,
  getAllProducts,
  searchProductsByName
} from "../api/productApi";
import '../scss/SearchProduct.scss';

const SearchProduct = ({ onSearchResults }) => {
  const [searchParams, setSearchParams] = useState({
    searchType: "productName", // 기본값: 제품명 검색
    searchTerm: "",
  });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data = [];

      if (searchParams.searchType === "id") {
        // ✅ 제품 ID로 검색
        const productById = await getProductById(searchParams.searchTerm);
        data = productById ? [productById] : [];
      } else if (searchParams.searchType === "productName") {
        // ✅ 제품명으로 검색
        const productByName = await searchProductsByName();
        data = productByName ? productByName : [];
      }

      onSearchResults(data);
    } catch (err) {
      console.error("검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSearch} className="search-form">
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
      {error && <p style={{ color: "red" }}></p>}
    </div>
  );
};

export default SearchProduct;
