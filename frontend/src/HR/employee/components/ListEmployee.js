import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  getAllActiveEmployees,
  getEmployeesByName,
  getDepartments,
  getPositions,
  getEmployeesByDepartment,
  getEmployeesByPosition,
  getEmployeesByDepartmentAndPosition,
} from "../api/employeeApi";
import EmployeeDetail from "./EmployeeDetail";
import "../scss/ListEmployee.scss";
import Pagination from "../../../common/component/Pagination";

const ListEmployee = forwardRef(({ searchTerm }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchAllData = async () => {
    try {
      const deptResponse = await getDepartments();
      setDepartments(deptResponse || []);

      const posResponse = await getPositions();
      setPositions(posResponse || []);

      const empResponse = await getAllActiveEmployees();
      setEmployees(empResponse || []);
      setFilteredEmployees(empResponse || []);
    } catch (error) {
      console.error("❌ 직원 데이터 가져오기 실패:", error);
      setEmployees([]);
      setFilteredEmployees([]);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    try {
      let searchResults = [];

      const nameResults = await getEmployeesByName(searchTerm);
      searchResults = [...nameResults];

      const departmentMatch = departments.find((dept) =>
        dept.name.includes(searchTerm)
      );
      if (departmentMatch) {
        const deptResults = await getEmployeesByDepartment(departmentMatch.id);
        searchResults = [...searchResults, ...deptResults];
      }

      const positionMatch = positions.find((pos) =>
        pos.title.includes(searchTerm)
      );
      if (positionMatch) {
        const posResults = await getEmployeesByPosition(
          positionMatch.positionId
        );
        searchResults = [...searchResults, ...posResults];
      }

      if (departmentMatch && positionMatch) {
        const combinedResults = await getEmployeesByDepartmentAndPosition(
          departmentMatch.id,
          positionMatch.positionId
        );
        searchResults = [...searchResults, ...combinedResults];
      }

      const uniqueResults = Array.from(
        new Map(searchResults.map((emp) => [emp.id, emp])).values()
      );

      setFilteredEmployees(uniqueResults);
    } catch (error) {
      console.error("❌ 검색 실패:", error);
      setFilteredEmployees([]);
    }
  };

  // ✅ `EmployeePage`에서 검색 실행 시 이 함수 호출 가능하도록 설정
  useImperativeHandle(ref, () => ({
    handleCreateSuccess: async () => await fetchAllData(),
    handleDeleteSuccess: async () => await fetchAllData(),
    handleUpdateSuccess: async () => await fetchAllData(),
    handleSearch,
  }));

  // ✅ 부서 이름 가져오기
  const getDepartmentName = (id) => {
    const department = departments.find((dept) => dept.id === id);
    return department ? department.name : "-";
  };

  // ✅ 직급 이름 가져오기
  const getPositionTitle = (id) => {
    const position = positions.find((pos) => pos.positionId === id);
    return position ? position.title : "-";
  };

  useEffect(() => {
    fetchAllData();
  }, [currentPage]);

  // ✅ 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ 페이지에 맞는 직원 데이터 추출
  const paginate = (data, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

  const paginatedEmployees = paginate(filteredEmployees, currentPage, pageSize);

  return (
    <div>
      <div className="employee-list-container">
        {filteredEmployees.length === 0 ? (
          <p>직원이 없습니다.</p>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>사원 번호</th>
                <th>이름</th>
                <th>생년월일</th>
                <th>성별</th>
                <th>전화번호</th>
                <th>이메일</th>
                <th>주소</th>
                <th>부서</th>
                <th>직급</th>
                <th>입사일</th>
                <th>퇴사 여부</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td
                    className="clickable-name"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    {employee.name}
                  </td>
                  <td>{employee.birthDate}</td>
                  <td>{employee.gender ? "여성" : "남성"}</td>
                  <td>{employee.phone || "-"}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address || "-"}</td>
                  <td>{getDepartmentName(employee.departmentId)}</td>
                  <td>{getPositionTitle(employee.positionId)}</td>
                  <td>{employee.hireDate}</td>
                  <td>{employee.isTerminated ? "✅ 퇴사" : "🔵 재직 중"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedEmployee && (
          <EmployeeDetail
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onUpdateSuccess={fetchAllData}
            onDeleteSuccess={fetchAllData}
          />
        )}
      </div>

      {/* 페이징 컴포넌트 추가 */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredEmployees.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
});

export default ListEmployee;
