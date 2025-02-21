import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { askChatbot } from "../api/chatbotApi";
import { getEmployeeById } from "../../HR/employee/api/employeeApi";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState(null);

  const employeeId = useSelector((state) => state.loginSlice.id);
  const token = useSelector((state) => state.loginSlice.accessToken);

  console.log("🔍 [React] Redux에서 가져온 토큰:", token);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const employeeData = await getEmployeeById(employeeId);
        console.log("가져온 직원 정보:", employeeData);

        if (employeeData) {
          setDepartment(employeeData.departmentName || "기본부서");
          setDepartmentId(employeeData.departmentId || 3);
        }
      } catch (error) {
        console.error("❌ 부서 정보 조회 실패:", error);
      }
    };

    if (employeeId) {
      fetchDepartment();
    }
  }, [employeeId]);

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    const requestData = {
      message: msg,
      employeeId: employeeId,
      department: department,
      departmentId: Number(departmentId),
    };

    console.log("🔄 보내는 데이터:", requestData);

    try {
      const chatbotResponse = await askChatbot(requestData, token);
      console.log("🔵 챗봇 응답:", chatbotResponse);
      console.log(
        "📢 chatbotResponse 구조:",
        JSON.stringify(chatbotResponse, null, 2)
      );

      // ✅ chatbotResponse를 그대로 사용하도록 수정
      if (chatbotResponse) {
        setResponse(chatbotResponse); // response 필드 없이 바로 저장
      } else {
        console.error("❌ 응답 데이터가 비어 있습니다:", chatbotResponse);
      }
    } catch (error) {
      console.error("❌ 챗봇 API 오류:", error);
    }
  };

  useEffect(() => {
    console.log("📢 UI 업데이트됨! 현재 response:", response);
  }, [response]);

  return (
    <div>
      <h2>💬 챗봇</h2>
      <p>
        👤 로그인한 직원 ID: {employeeId} {department && `- ${department}`}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
        }}
      >
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">보내기</button>
      </form>
      <div>
        <p>
          <strong>📝 응답:</strong>
        </p>
        <pre>{response || "⚠️ 응답을 불러오는 중..."}</pre>
      </div>
    </div>
  );
}

export default Chatbot;
