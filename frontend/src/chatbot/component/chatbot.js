import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { askChatbot } from "../api/chatbotApi";
import { getEmployeeById } from "../../HR/employee/api/employeeApi";
import "../scss/Chatbot.scss";

function Chatbot({ isEmbedded = false }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [department, setDepartment] = useState(""); 
  const [departmentId, setDepartmentId] = useState(null);
  const chatEndRef = useRef(null);

  const employeeId = useSelector((state) => state.loginSlice.id);
  const token = useSelector((state) => state.loginSlice.accessToken);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const employeeData = await getEmployeeById(employeeId);
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

  // ✅ 내부 스크롤 이동만 적용
  const scrollToBottom = () => {
    if (!chatEndRef.current) return;
    
    setTimeout(() => {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // ✅ 내부 스크롤만 이동
      });
    }, 100);
  };

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", text: msg },
    ]);

    scrollToBottom(); // ✅ 사용자 메시지 입력 후 스크롤

    const requestData = {
      message: msg,
      employeeId,
      department,
      departmentId: Number(departmentId),
    };

    try {
      const chatbotResponse = await askChatbot(requestData, token);
      if (chatbotResponse) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "chatbot", text: chatbotResponse },
        ]);
        scrollToBottom(); // ✅ 챗봇 응답 후 스크롤
      } else {
        console.error("❌ 응답 데이터가 비어 있습니다:", chatbotResponse);
      }
    } catch (error) {
      console.error("❌ 챗봇 API 오류:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]); // ✅ chatHistory가 변경될 때만 실행

  return (
    <div className={`chat-container ${isEmbedded ? "embedded" : ""}`}>
      <div className="header">
        <span>Channel✓</span>
        <button>⋮</button>
      </div>

      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "👤 나" : "🤖 챗봇"}</strong>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
}

export default Chatbot;