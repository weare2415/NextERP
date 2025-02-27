import React, { useEffect, useState } from "react";
import { getProductById, searchProductsByName } from "../api/productApi";
import "../scss/SearchProduct.scss";

const SearchProduct = ({ onSearchResults }) => {
  const [searchParams, setSearchParams] = useState({
    searchType: "productName", // 기본값: 제품명 검색
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  // 자동완성 API 요청
  const fetchSuggestions = async (query, searchType) => {
    try {
      let data = [];
      // console.log(query); // 이 줄을 제거하면 매 입력마다 로그가 찍히지 않습니다.

      if (searchType === "id") {
        const response = await getProductById(query);
        data = response.id;
      } else if (searchType === "productName") {
        const response = await searchProductsByName(query);
        data = response.content.map((product) => ({
          productName: product.productName,
        }));
      }
      setSuggestions(data);
    } catch (error) {
      console.error("자동완성 검색 오류:", error);
      setSuggestions([]);
    }
  };

  // 검색어 변경 시 자동완성 실행
  useEffect(() => {
    if (searchParams.searchTerm.length > 1 && !isSelecting) {
      fetchSuggestions(searchParams.searchTerm, searchParams.searchType);
    } else {
      setSuggestions([]);
    }
    setIsSelecting(false);
  }, [searchParams.searchTerm, searchParams.searchType]);

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
        const product = await getProductById(searchParams.searchTerm);
        data = product ? [product] : [];
        console.log(product);
      } else if (searchParams.searchType === "productName") {
        const product = await searchProductsByName(searchParams.searchTerm);
        data = product.content ? product.content : [];
        console.log(data);
      }

      onSearchResults(data);
    } catch (err) {
      console.error("검색 중 오류 발생:", err);
      setError("검색 중 오류가 발생하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex < 0 || selectedIndex >= suggestions.length) return; // 인덱스 범위 체크

      const selectedItem = suggestions[selectedIndex];
      if (!selectedItem) return; // 선택된 항목이 존재하는지 확인

      const selectedValue = selectedItem?.id || selectedItem?.productName; // 안전한 접근
      if (!selectedValue) return; // 값이 없는 경우 리턴

      setIsSelecting(true);
      setSearchParams((prev) => ({ ...prev, searchTerm: selectedValue }));
      setSuggestions([]); // 자동완성 닫기
      e.preventDefault();
    }
  };

  return (
    <div className="product-search-section">
      <form onSubmit={handleSearch} className="product-search-form">
        <select
          name="searchType"
          value={searchParams.searchType}
          onChange={handleInputChange}
          className="product-search-all"
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
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {/*자동완성 목록 */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item, index) => (
              <li
                key={`${item.productName}-${index}`} // 제품명 + index 조합
                onMouseDown={() => {
                  setIsSelecting(true);
                  setSearchParams((prev) => ({
                    ...prev,
                    searchTerm: item.productName,
                  }));
                  setSuggestions([]);
                }}
              >
                {item.productName}
              </li>
            ))}
          </ul>
        )}
        <button type="submit">검색</button>
      </form>

      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SearchProduct;
