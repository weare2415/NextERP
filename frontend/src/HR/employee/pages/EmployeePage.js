import React, { useRef, useState } from "react";
import CreateEmployee from "../components/CreateEmployee";
import ListEmployee from "../components/ListEmployee";
import "../scss/EmployeePage.scss";
import BasicLayout from '../../../common/pages/BasicLayout';

const EmployeePage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const listEmployeeRef = useRef();

  // ✅ 검색 버튼 클릭 시 검색어를 적용
  const handleSearch = () => {
    listEmployeeRef.current?.handleSearch(searchTerm);
  };

  // ✅ 직원 등록 성공 시 목록 업데이트
  const handleCreateSuccess = (newEmployee) => {
    listEmployeeRef.current?.handleCreateSuccess?.(newEmployee);
    setShowCreateForm(false);
  };

  return (
    <BasicLayout>
      <div className="employee-page">
        <div className="page-header">
          <h2>직원 관리</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="사원명, 사원ID, 부서, 직위 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>
          <button 
            className="new-employee-btn"
            onClick={() => setShowCreateForm(true)}
          >
            신규 직원 등록
          </button>
        </div>

        {/* 직원 목록 */}
        <ListEmployee 
          ref={listEmployeeRef}
          searchTerm={searchTerm} // ✅ 검색어 전달
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
