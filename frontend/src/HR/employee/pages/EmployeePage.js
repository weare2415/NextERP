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

  // ✅ 검색 실행 (검색 시 페이지를 0으로 초기화)
  const handleSearch = () => {
    if (listEmployeeRef.current) {
      listEmployeeRef.current.handleSearch(searchTerm, searchCategory, 0, true);
    }
  };

  // ✅ 직원 등록 성공 시 목록 업데이트
  const handleCreateSuccess = () => {
    if (listEmployeeRef.current) {
      listEmployeeRef.current.handleCreateSuccess();
    }
    setShowCreateForm(false);
  };

  return (
    <BasicLayout>
      <div className="employee-page-container">
        <div className="employee-page-header">
          <h1>직원 관리</h1>
          <div className="search-container">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-category-select"
            >
              <option value="name">사원명</option>
              <option value="department">부서</option>
              <option value="position">직급</option>
            </select>

            {/* 검색 입력창 */}
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
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
