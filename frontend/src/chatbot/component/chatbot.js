import React, { useState } from "react";

// import ImageChatbot from "./ImageChatbot";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  // ✅ Spring Boot를 통해 Flask와 통신
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("❌ 오류 발생:", error);
      setResponse("⚠️ 서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div>
      <h2>💬 챗봇</h2>
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

      {/* 🎤 음성 인식 기능 (주석 처리) */}
      {/* <SpeechToText onSend={sendMessage} /> */}

      <div>
        <p>
          <strong>📝 응답:</strong>
        </p>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default Chatbot;
