import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../api/memberApi"; // ✅ API 요청 함수
import "./scss/ForgotPassword.scss";

const ForgotPassword = () => {
  const [name, setName] = useState(""); // ✅ 이름 입력 필드 추가
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await requestPasswordReset({ name, email }); // ✅ 객체로 전달
      console.log("서버 응답:", response); // ✅ 서버 응답 확인
      // ✅ 이름과 이메일 전달

      // ✅ 크롬 알람(경고창) 표시
      window.alert(
        response.message || "임시 비밀번호가 이메일로 전송되었습니다."
      );

      // ✅ 확인 버튼 누르면 로그인 페이지로 이동
      navigate("/member/login");
    } catch (error) {
      window.alert(error.message || "비밀번호 재설정 요청 실패.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-component">
        <div className="forgot-password-upper">
          <img src="/NextERP.png" alt="logo" className="logo" />
          <h2>비밀번호 찾기</h2>
          <p>
            등록된 직원의 이름과 이메일을 입력하면 임시 비밀번호가 발송됩니다.
          </p>
        </div>
        <form className="forgot-password-form" onSubmit={handleResetPassword}>
          <div className="input-group">
            <label>이름:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="input-group">
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="forgot-password-button">
            <button type="submit">임시 비밀번호 요청</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
