import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeById } from "../../../HR/employee/api/employeeApi"; // ✅ 사원 ID 검증 API 호출
import "../pages/scss/VerifyEmployeeId.scss"; // ✅ 스타일 파일 추가 가능

const VerifyEmployeeId = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ 사원 ID 검증
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); // 기존 에러 초기화

    if (!employeeId) {
      setError("사원 ID를 입력하세요.");
      return;
    }

    try {
      const employeeData = await getEmployeeById(employeeId); // API 호출
      console.log("사원 인증 성공:", employeeData);

      //  성공 메시지 알람 표시 후 페이지 이동
      window.alert("인증이 완료되었습니다! 비밀번호 찾기 페이지로 이동합니다.");

      // ✅ 인증 성공 시 비밀번호 찾기 페이지로 이동 (사원 ID 전달)
      navigate("/member/forgot-password", { state: { employeeId } });
    } catch (error) {
      setError("❌ 사원 ID가 존재하지 않거나, 잘못된 ID입니다.");
    }
  };

  return (
    <div className="page-container">
      <div className="verify-employee-container">
        {/* ✅ 로고 클릭 시 로그인 페이지 이동 기능 추가 */}
        <img
          src="/NextERP.png"
          alt="NEXT ERP"
          className="next-logo"
          onClick={() => navigate("/member/login")} // ✅ 로고 클릭 시 이동
          style={{ cursor: "pointer" }} // ✅ 마우스 커서를 클릭 가능하게 변경
        />
        <h1 className="verify-title">사원 인증</h1>
        <p className="verify-description">
          비밀번호 찾기를 위해 사원 ID를 입력하고 인증을 진행하세요.
        </p>

        <form className="verify-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="employeeId">사원 ID:</label>
            <input
              id="employeeId"
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="사원 ID를 입력하세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="verify-button">
            인증하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmployeeId;
