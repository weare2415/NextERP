import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { changePassword } from "../api/memberApi";

const ChangePassword = () => {
  const navigate = useNavigate();

  // ✅ Redux에서 로그인한 사용자 정보 가져오기
  const id = useSelector((state) => state.loginSlice.id) || ""; 
  const name = useSelector((state) => state.loginSlice.name) || "";

  useEffect(() => {
    if (!id) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
    }
  }, [id, navigate]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // ✅ 비밀번호 길이 오류
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // ✅ 비밀번호 불일치 오류

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await changePassword({ id, newPassword });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/member/login");

    } catch (error) {
      alert(error.message || "비밀번호 변경 실패.");
    }
  };

  return (
    <div>
      <h2>비밀번호 변경</h2>
      <p>{name} 님, 새 비밀번호를 입력하세요.</p>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>새 비밀번호:</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError(e.target.value.length >= 8 ? "" : "비밀번호는 8자리 이상이어야 합니다."); // ✅ 즉시 검사
            }} 
            required 
          />
          {/* ✅ 비밀번호 길이 오류 메시지 표시 */}
          {passwordError && (
            <p style={{ color: "red", fontSize: "14px" }}>{passwordError}</p>
          )}
        </div>
        <div>
          <label>비밀번호 재입력:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(e.target.value === newPassword ? "" : "비밀번호가 일치하지 않습니다."); // ✅ 즉시 검사
            }} 
            required 
          />
          {/* ✅ 비밀번호 불일치 오류 메시지 표시 */}
          {confirmPasswordError && (
            <p style={{ color: "red", fontSize: "14px" }}>{confirmPasswordError}</p>
          )}
        </div>
        <button type="submit" disabled={passwordError || confirmPasswordError}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
