import React, { useState } from "react";
import SpeechToText from "./component/SpeechToText";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    const res = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="sales-chatbot">
      <div className="chatbot-header">
        <h2>영업팀 챗봇 도우미</h2>
        <SpeechToText onSend={sendMessage} />
      </div>
      
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

      <SpeechToText onSend={sendMessage} />

      <div>
        <p>
          <strong>응답:</strong>
        </p>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default Chatbot;
