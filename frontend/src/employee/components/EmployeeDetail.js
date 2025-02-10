import React, { useState, useEffect } from "react";
import { updateEmployee, deleteEmployee, getDepartments, getPositions, getEmployeeById } from "../api/employeeApi"; // ✅ API 추가
import "../scss/EmployeeDetail.scss";

const EmployeeDetail = ({ employee, onClose, onDeleteSuccess, onUpdateSuccess }) => {
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isTerminated, setIsTerminated] = useState(employee.isTerminated); // ✅ 퇴사 여부 상태 추가

  // ✅ 직원 데이터 다시 불러오기 (퇴사 여부 포함)
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const updatedEmployee = await getEmployeeById(employee.id);
        setEditedEmployee(updatedEmployee);
      } catch (error) {
        console.error("❌ 직원 정보 조회 실패:", error);
      }
    };

    fetchEmployeeData();
  }, [employee.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptData = await getDepartments();
        const posData = await getPositions();
        setDepartments(deptData);
        setPositions(posData);
      } catch (error) {
        console.error("❌ 부서 & 직급 목록 조회 실패:", error);
      }
    };
    fetchData();
  }, []);

   // ✅ 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "positionId" || name === "departmentId") {
      newValue = parseInt(value, 10);
    }

    setEditedEmployee((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  // ✅ 직원 정보 업데이트 (수정 버튼 클릭 시 실행)
  const handleUpdate = async () => {
    if (isTerminated) {
      alert("❌ 퇴사한 직원은 수정할 수 없습니다.");
      return;
    }

    // ✅ 퇴사일이 설정된 경우 확인 메시지 표시
    if (editedEmployee.terminationDate) {
      const confirmTerminate = window.confirm("퇴사 처리하시겠습니까?");
      if (!confirmTerminate) {
        return; // 사용자가 취소하면 업데이트 중단
      }
    }

    try {
      const updated = await updateEmployee(employee.id, editedEmployee);

      if (updated) {
        alert("✅ 직원 정보가 수정되었습니다.");
        setEditedEmployee(updated);
        onUpdateSuccess();
        setTimeout(() => onClose(), 200);
      } else {
        alert("❌ 직원 정보 수정이 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 직원 수정 실패:", error);
      alert("❌ 직원 정보 수정에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>직원 상세 정보</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {isTerminated && <p className="terminated-message">🚨 퇴사한 직원입니다.</p>} {/* ✅ 퇴사 메시지 추가 */}

          <div className="form-grid">
            <div className="form-group">
              <label>사원 번호</label>
              <input type="text" value={editedEmployee.id} readOnly />
            </div>

            <div className="form-group">
              <label>이름</label>
              <input type="text" name="name" value={editedEmployee.name} onChange={handleChange} disabled={isTerminated} />
            </div>

            <div className="form-group">
              <label>생년월일</label>
              <input type="date" name="birthDate" value={editedEmployee.birthDate} onChange={handleChange} disabled={isTerminated} />
            </div>

            <div className="form-group">
              <label>전화번호</label>
              <input type="text" name="phone" value={editedEmployee.phone || ""} onChange={handleChange} disabled={isTerminated} />
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input type="email" name="email" value={editedEmployee.email} onChange={handleChange} disabled={isTerminated} />
            </div>

            <div className="form-group">
              <label>주소</label>
              <input type="text" name="address" value={editedEmployee.address || ""} onChange={handleChange} disabled={isTerminated} />
            </div>

            <div className="form-group">
              <label>부서</label>
              <select name="departmentId" value={editedEmployee.departmentId} onChange={handleChange} disabled={isTerminated}>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>직급</label>
              <select name="positionId" value={editedEmployee.positionId || ""} onChange={handleChange} disabled={isTerminated}>
                <option value="">직급 선택</option>
                {positions.map((pos) => (
                  <option key={pos.positionId} value={pos.positionId}>
                    {pos.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>입사일</label>
              <input type="date" name="hireDate" value={editedEmployee.hireDate} onChange={handleChange} disabled={isTerminated} />
            </div>

            <div className="form-group">
              <label>퇴사일</label>
              <input type="date" name="terminationDate" value={editedEmployee.terminationDate || ""} onChange={handleChange} disabled={isTerminated} />
            </div>
          </div>
        </div>

        <div className="button-container">
          {!isTerminated && <button className="update-button" onClick={handleUpdate}>수정</button>} {/* ✅ 퇴사한 직원은 수정 불가 */}
          <button className="close-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
