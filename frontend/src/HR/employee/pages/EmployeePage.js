import React, { useRef, useState } from "react";
import CreateEmployee from "../components/CreateEmployee";
import ListEmployee from "../components/ListEmployee";
import "../scss/EmployeePage.scss";
import BasicLayout from "../../../common/pages/BasicLayout";

const EmployeePage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name"); 
  const listEmployeeRef = useRef();

  // ✅ 검색 버튼 클릭 시 검색어를 적용
  const handleSearch = () => {
    listEmployeeRef.current?.handleSearch(searchTerm, searchCategory);
  };

  // ✅ 직원 등록 성공 시 목록 업데이트
  const handleCreateSuccess = (newEmployee) => {
    listEmployeeRef.current?.handleCreateSuccess?.(newEmployee);
    setShowCreateForm(false);
  };

  return (
    <BasicLayout>
      <div className="employee-page-container">
        <div className="employee-page-header">
          <h2>직원 관리</h2>
          <div className="search-container">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-category-select"
            >
              <option value="name">사원명</option>
              <option value="id">사원ID</option>
              <option value="department">부서</option>
              <option value="position">직위</option>
            </select>

            {/* 검색창 */}
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {/* 검색 버튼 */}
            <button className="search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>

          {/* 신규 직원 등록 버튼 */}
          <button
            className="new-employee-btn"
            onClick={() => setShowCreateForm(true)}
          >
            직원 등록
          </button>
        </div>

        {/* 직원 목록 */}
        <ListEmployee
          ref={listEmployeeRef}
          searchTerm={searchTerm} 
          searchCategory={searchCategory} 
        />

        {/* 직원 등록 모달 */}
        {showCreateForm && (
          <div className="modal-overlay">
            <CreateEmployee
              onClose={() => setShowCreateForm(false)}
              onSuccess={handleCreateSuccess}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default EmployeePage;
