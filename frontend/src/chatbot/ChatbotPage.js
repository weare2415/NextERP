import React, { useState } from "react";
import { askChatbot } from "../chatbot/api/chatbotApi"; // ✅ API 호출 파일 가져오기

function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  // ✅ 챗봇 응답 요청 함수
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    const chatbotResponse = await askChatbot(msg);
    setResponse(chatbotResponse);
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
