import React, { useState } from "react";
import "../components/scss/OrderFilter.scss";

const OrderFilter = ({ activeTab, onTabChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleTabClick = (tab) => {
    onTabChange(tab);
    setDropdownOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="filter-buttons">
      <button
        className="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {activeTab}
      </button>
      {dropdownOpen && (
        <ul className="dropdown-menu">
          <button onClick={() => handleTabClick("전체")}>전체</button>
          <button onClick={() => handleTabClick("판매")}>판매</button>
          <button onClick={() => handleTabClick("구매")}>구매</button>
        </ul>
      )}
    </div>
  );
};

export default OrderFilter;
