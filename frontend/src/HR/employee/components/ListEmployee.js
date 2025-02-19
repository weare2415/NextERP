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
  const [employees, setEmployees] = useState([]); // 직원 목록
  const [departments, setDepartments] = useState([]); // 부서 목록
  const [positions, setPositions] = useState([]); // 직급 목록
  const [selectedEmployee, setSelectedEmployee] = useState(null); // 선택된 직원 상세정보
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (백엔드는 0부터 시작)
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const pageSize = 10; // 한 페이지당 직원 수

  // ✅ 직원 데이터 가져오기 (백엔드 페이징 적용)
  const fetchEmployees = async (page = 0) => {
    try {
      const response = await getAllActiveEmployees(page, pageSize);
      setEmployees(response.content || []); // 직원 데이터 설정
      setTotalPages(response.totalPages || 1); // 총 페이지 수 설정
    } catch (error) {
      console.error("❌ 직원 목록 불러오기 실패:", error);
      setEmployees([]);
      setTotalPages(1);
    }
  };

  // 부서 및 직급 데이터 가져오기
  const fetchDepartmentsAndPositions = async () => {
    try {
      const deptResponse = await getDepartments();
      setDepartments(deptResponse || []);
      console.log("부서 데이터:", deptResponse); // 부서 데이터 콘솔

      const posResponse = await getPositions();
      setPositions(posResponse || []);
      console.log("직급 데이터:", posResponse); // 직급 데이터 콘솔
    } catch (error) {
      console.error("❌ 부서 및 직급 데이터 가져오기 실패:", error);
      setDepartments([]);
      setPositions([]);
    }
  };

  // ✅ 부서 이름 가져오기 함수
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "알 수 없음";
  };

  // 직급 이름 가져오기 함수
  const getPositionTitle = (positionId) => {
    const position = positions.find((pos) => pos.id === positionId);
    console.log("직급 조회:", position); // 직급 조회 콘솔
    return position ? position.title : "알 수 없음";
  };

  const handleSearch = async (searchTerm, searchCategory, page = 0) => {
    if (!searchTerm.trim()) {
      fetchEmployees(0); // 검색어 없으면 전체 조회
      return;
    }

    try {
      let response;

      switch (searchCategory) {
        case "name":
          response = await getEmployeesByName(searchTerm, page, pageSize);
          break;

        case "department": {
          const department = departments.find(
            (dept) => dept.name.toLowerCase() === searchTerm.toLowerCase()
          );
          console.log("부서 검색:", department); // 부서 검색 콘솔

          if (!department) {
            console.warn("❌ 해당 부서를 찾을 수 없습니다:", searchTerm);
            setEmployees([]);
            setTotalPages(1);
            return;
          }

          response = await getEmployeesByDepartment(
            department.id,
            page,
            pageSize
          );
          break;
        }

        case "position": {
          const trimmedSearchTerm = searchTerm.trim().toLowerCase();
          const position = positions.find(
            (pos) => pos.title.toLowerCase() === trimmedSearchTerm
          );
          console.log("직급 검색:", position); // 직급 검색 콘솔

          if (!position) {
            console.warn("❌ 해당 직급을 찾을 수 없습니다:", searchTerm);
            setEmployees([]);
            setTotalPages(1);
            return;
          }

          // 직급 ID를 position.positionId로 수정
          response = await getEmployeesByPosition(
            position.positionId,
            page,
            pageSize
          );
          break;
        }

        default:
          response = await getEmployeesByName(searchTerm, page, pageSize);
      }

      setEmployees(response.content || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page); // 페이지 업데이트
    } catch (error) {
      console.error("❌ 검색 실패:", error);
      setEmployees([]);
      setTotalPages(1);
    }
  };

  // ✅ `EmployeePage`에서 검색 실행 시 이 함수 호출 가능하도록 설정
  useImperativeHandle(ref, () => ({
    handleCreateSuccess: () => fetchEmployees(currentPage),
    handleDeleteSuccess: () => fetchEmployees(currentPage),
    handleUpdateSuccess: () => fetchEmployees(currentPage),
    handleSearch,
  }));

  useEffect(() => {
    fetchDepartmentsAndPositions();
    fetchEmployees(currentPage);
  }, []);

  // ✅ 페이지 변경 시 직원 데이터 다시 불러오기
  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  return (
    <div>
      <div className="employee-list-container">
        {employees.length === 0 ? (
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
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td
                    className="employee-name-btn"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    {employee.name}
                  </td>
                  <td>{employee.birthDate}</td>
                  <td>{employee.gender ? "여성" : "남성"}</td>
                  <td>{employee.phone || "-"}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address || "-"}</td>
                  <td>{getDepartmentName(employee.departmentId)}</td>{" "}
                  <td>{employee.positionTitle || "알 수 없음"}</td>
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
            onUpdateSuccess={() => fetchEmployees(currentPage)}
            onDeleteSuccess={() => fetchEmployees(currentPage)}
          />
        )}
      </div>

      {/* ✅ Pagination 적용 (백엔드 데이터 기반) */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
});

export default ListEmployee;
