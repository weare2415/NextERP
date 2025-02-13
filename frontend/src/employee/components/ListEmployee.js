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

const ListEmployee = forwardRef(({ searchTerm }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // ✅ 직원, 부서, 직급 데이터를 가져오는 함수
  // const fetchAllData = async () => {
  //   try {
  //     const deptResponse = await getDepartments();
  //     setDepartments(deptResponse || []); // ✅ 부서 데이터 저장

  //     const posResponse = await getPositions();
  //     setPositions(posResponse || []); // ✅ 직급 데이터 저장

  //     const empResponse = await getAllEmployees(); // 기본적으로 퇴사하지 않은 직원만 가져옴
  //     setEmployees(empResponse || []);
  //     setFilteredEmployees(empResponse || []); // ✅ 초기 필터링된 직원 목록 설정
  //   } catch (error) {
  //     console.error("❌ 데이터 가져오기 실패:", error);
  //     setEmployees([]);
  //     setFilteredEmployees([]);
  //   }
  // };
  const fetchAllData = async () => {
    try {
      const deptResponse = await getDepartments();
      setDepartments(deptResponse || []); // ✅ 부서 데이터 저장

      const posResponse = await getPositions();
      setPositions(posResponse || []); // ✅ 직급 데이터 저장

      const empResponse = await getAllActiveEmployees(); // ✅ PENDING 제외한 직원만 조회
      setEmployees(empResponse || []);
      setFilteredEmployees(empResponse || []);
    } catch (error) {
      console.error("❌ 직원 데이터 가져오기 실패:", error);
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
      let searchResults = [];

      // 🔹 이름 검색
      const nameResults = await getEmployeesByName(searchTerm);
      searchResults = [...nameResults];

      // 🔹 부서 검색 (부서 목록에서 검색어와 일치하는 부서 찾기)
      const departmentMatch = departments.find((dept) =>
        dept.name.includes(searchTerm)
      );
      if (departmentMatch) {
        const deptResults = await getEmployeesByDepartment(departmentMatch.id);
        searchResults = [...searchResults, ...deptResults];
      }

      // 🔹 직급 검색 (직급 목록에서 검색어와 일치하는 직급 찾기)
      const positionMatch = positions.find((pos) =>
        pos.title.includes(searchTerm)
      );
      if (positionMatch) {
        const posResults = await getEmployeesByPosition(
          positionMatch.positionId
        );
        searchResults = [...searchResults, ...posResults];
      }

      // 🔹 부서 + 직급 검색 (부서와 직급이 모두 검색어에 포함된 경우)
      if (departmentMatch && positionMatch) {
        const combinedResults = await getEmployeesByDepartmentAndPosition(
          departmentMatch.id,
          positionMatch.positionId
        );
        searchResults = [...searchResults, ...combinedResults];
      }

      // 🔹 중복 제거
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
              <tr
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
              >
                <td>{employee.id}</td>
                <td>{employee.name}</td>
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
