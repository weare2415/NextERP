import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../api/memberApi"; // ✅ API 요청 함수

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
      window.alert(response.message || "임시 비밀번호가 이메일로 전송되었습니다.");

      // ✅ 확인 버튼 누르면 로그인 페이지로 이동
      navigate("/member/login");

    } catch (error) {
      window.alert(error.message || "비밀번호 재설정 요청 실패.");
    }
  };

  return (
    <div>
      <h2>비밀번호 찾기</h2>
      <p>등록된 직원의 이름과 이메일을 입력하면 임시 비밀번호가 발송됩니다.</p>
      <form onSubmit={handleResetPassword}>
        <div>
          <label>이름:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">임시 비밀번호 요청</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
