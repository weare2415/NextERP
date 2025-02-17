import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  getAllEmployees,
  getEmployeesByName,
  getDepartments,
  getPositions,
} from "../api/employeeApi";
import EmployeeDetail from "./EmployeeDetail";
import "../scss/ListEmployee.scss";

const ListEmployee = forwardRef(({ searchTerm }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // ✅ 직원, 부서, 직급 데이터를 가져오는 함수
  const fetchAllData = async () => {
    try {
      const deptResponse = await getDepartments();
      setDepartments(deptResponse || []); // ✅ 부서 데이터 저장

      const posResponse = await getPositions();
      setPositions(posResponse || []); // ✅ 직급 데이터 저장

      const empResponse = await getAllEmployees(); // 기본적으로 퇴사하지 않은 직원만 가져옴
      setEmployees(empResponse || []);
      setFilteredEmployees(empResponse || []); // ✅ 초기 필터링된 직원 목록 설정
    } catch (error) {
      console.error("❌ 데이터 가져오기 실패:", error);
      setEmployees([]);
      setFilteredEmployees([]);
    }
  };

  // ✅ 최초 로딩 시 실행
  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ 검색어에 따라 직원 목록 필터링
  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    try {
      // ✅ 검색 시 퇴사 여부 관계없이 모든 직원 검색
      const searchResults = await getEmployeesByName(searchTerm);
      setFilteredEmployees(searchResults);
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
    handleSearch, // ✅ 검색 실행 함수 추가
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

  return (
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
            {filteredEmployees.map((employee) => (
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
                <td>{employee.isTerminated ? "✅ 퇴사" : "🔵 재직 중"}</td>{" "}
                {/* ✅ 퇴사 여부 표시 */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdateSuccess={fetchAllData} // ✅ 직원 수정 후 목록 즉시 업데이트
          onDeleteSuccess={fetchAllData} // ✅ 직원 삭제 후 목록 즉시 업데이트
        />
      )}
    </div>
  );
});

export default ListEmployee;
