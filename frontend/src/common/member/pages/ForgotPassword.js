import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../api/memberApi";
import "../../member/pages/scss/ForgotPassword.scss";

const ForgotPassword = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await requestPasswordReset({ name, email });
      window.alert(
        response.message || "임시 비밀번호가 이메일로 전송되었습니다."
      );
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
