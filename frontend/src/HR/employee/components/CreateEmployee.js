import React, { useState } from "react";
import { createEmployee, checkEmployeeIdExists } from "../api/employeeApi";
import "../scss/CreateEmployee.scss";

const departments = [
  { id: 1, name: "영업팀" },
  { id: 2, name: "회계팀" },
  { id: 3, name: "인사팀" },
];

const positions = [
  { id: 1, title: "인턴" },
  { id: 2, title: "사원" },
  { id: 3, title: "대리" },
  { id: 4, title: "과장" },
  { id: 5, title: "차장" },
  { id: 6, title: "부장" },
  { id: 7, title: "이사" },
  { id: 8, title: "사장" },
];

const CreateEmployee = ({ onClose, onSuccess }) => {
  const [employeeData, setEmployeeData] = useState({
    id: "",
    name: "",
    birthDate: "",
    gender: false,
    phone: "",
    email: "",
    address: "",
    departmentId: "",
    positionId: "",
    hireDate: "",
    terminationDate: null,
  });

  const [idError, setIdError] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  const handleIdChange = async (e) => {
    const id = e.target.value;
    setEmployeeData({ ...employeeData, id });

    if (id.length === 8) {
      // ✅ 8자리 체크
      const exists = await checkEmployeeIdExists(id);
      if (exists) {
        setIdError("❌ 이미 존재하는 ID입니다.");
        setIsIdAvailable(false);
      } else {
        setIdError("✅ 사용 가능한 ID입니다.");
        setIsIdAvailable(true);
      }
    } else {
      setIdError("❗ 8자리 ID를 입력하세요.");
      setIsIdAvailable(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdAvailable) {
      alert("❌ 중복되었거나 형식이 맞지 않는 ID입니다.");
      return;
    }

    try {
      const newEmployee = await createEmployee(employeeData);
      alert("✅ 직원이 성공적으로 등록되었습니다.");
      onSuccess(newEmployee);
      onClose();
    } catch (error) {
      alert("❌ 직원 등록에 실패했습니다.");
      console.error("❌ 직원 등록 실패:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="create-employee-form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header">
          <h2>신규 직원 등록</h2>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>사원 번호 (8자리 숫자)</label>
            <input
              type="text"
              name="id"
              placeholder="8자리 숫자 입력"
              value={employeeData.id}
              onChange={handleIdChange}
              required
            />
            {idError && (
              <p
                className={`id-check-message ${
                  isIdAvailable ? "success" : "error"
                }`}
              >
                {idError}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="name"
              placeholder="이름"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>생년월일</label>
            <input
              type="date"
              name="birthDate"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>성별</label>
            <select name="gender" onChange={handleChange}>
              <option value={false}>남자</option>
              <option value={true}>여자</option>
            </select>
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              type="text"
              name="phone"
              placeholder="전화번호"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>주소</label>
            <input
              type="text"
              name="address"
              placeholder="주소"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>부서</label>
            <select name="departmentId" onChange={handleChange} required>
              <option value="">부서 선택</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>직급</label>
            <select name="positionId" onChange={handleChange} required>
              <option value="">직급 선택</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>입사일</label>
            <input
              type="date"
              name="hireDate"
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={!isIdAvailable}>
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
