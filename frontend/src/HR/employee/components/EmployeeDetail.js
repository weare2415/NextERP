import React, { useState, useEffect } from "react";
import { 
  updateEmployee, 
  requestUpdateEmployee, 
  getDepartments, 
  getPositions, 
  getEmployeeById 
} from "../api/employeeApi"; // ✅ API 추가
import "../scss/EmployeeDetail.scss";

const EmployeeDetail = ({ employee, onClose, onUpdateSuccess }) => {
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isTerminated, setIsTerminated] = useState(employee.isTerminated); // ✅ 퇴사 여부 상태 추가
  const [status, setStatus] = useState(employee.status || "PREPARED"); // ✅ 승인 상태 추가

  // ✅ 직원 데이터 다시 불러오기 (퇴사 여부, 승인 상태 포함)
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const updatedEmployee = await getEmployeeById(employee.id);
        setEditedEmployee(updatedEmployee);
        setStatus(updatedEmployee.status || "PREPARED"); // ✅ undefined 방지
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

  // ✅ 직원 정보 수정 요청 (PENDING 상태로 변경)
  const handleUpdateRequest = async () => {
    if (isTerminated) {
      alert("❌ 퇴사한 직원은 수정할 수 없습니다.");
      return;
    }

    try {
      const updated = await requestUpdateEmployee(employee.id, editedEmployee);

      if (updated) {
        alert("✅ 수정 요청이 완료되었습니다. 관리자 승인을 기다려주세요.");
        setStatus("PENDING"); // ✅ 상태를 PENDING으로 변경
        onUpdateSuccess();
        setTimeout(() => onClose(), 200);
      } else {
        alert("❌ 수정 요청이 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 수정 요청 실패:", error);
      alert("❌ 수정 요청에 실패했습니다.");
    }
  };

  // ✅ 실제 수정 (승인된 경우만 가능)
  const handleUpdate = async () => {
    if (status !== "APPROVED") {
      alert("❌ 수정은 승인 후에만 가능합니다.");
      return;
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
          {isTerminated && <p className="terminated-message">🚨 퇴사한 직원입니다.</p>}
        

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
          {!isTerminated && status !== "PENDING" && (
            <button className="update-button" onClick={handleUpdateRequest}>수정 요청</button>
          )}
          {!isTerminated && status === "APPROVED" && (
            <button className="update-button" onClick={handleUpdate}>최종 수정</button>
          )}
          <button className="close-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
