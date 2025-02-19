import React, { useEffect, useState } from "react";

const SpeechToText = ({ onSend }) => {
    const [isListening, setIsListening] = useState(false);
    const [statusMessage, setStatusMessage] = useState("음성 인식을 위해 마이크를 사용해주세요.");
    const [isBrowserSupported, setIsBrowserSupported] = useState(true);
    let timeoutId = null;

    useEffect(() => {
      // 브라우저에서 SpeechRecognition을 지원하는지 확인
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        setIsBrowserSupported(false);
      }
    }, []);
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "ko-KR"; // 한국어 설정
    recognition.interimResults = false;
    recognition.continuous = false;
  
    recognition.onstart = () => {
      setStatusMessage("🎤 음성 인식 중...");
    };
  
    recognition.onresult = async (event) => {
      clearTimeout(timeoutId);
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setStatusMessage("음성 인식을 분석하는 중...");
  
      // ✅ ERP 영업팀 API 호출하여 음성 인식된 질문을 챗봇으로 전달
      try {
        const response = await fetch("http://localhost:8080/api/chatbot/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: transcript }), // 전달할 질문
        });
  
        const data = await response.json();
        onSend(data.response); // 챗봇 응답을 부모 컴포넌트(예: Chatbot)로 전달
      } catch (error) {
        console.error("음성 API 오류:", error);
        setStatusMessage("❌ 오류 발생! 다시 시도하세요.");
      }
    };
  
    recognition.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setIsListening(false);
      setStatusMessage("❌ 음성 인식 실패, 다시 시도하세요.");
    };
  
    const handleSpeechRecognition = () => {
      if (isListening) {
        recognition.stop();
        clearTimeout(timeoutId);
        setStatusMessage("음성 인식 중지됨");
      } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
        recognition.start();
        timeoutId = setTimeout(() => {
          recognition.stop();
          setStatusMessage("⏳ 입력 시간 초과");
        }, 10000); // 10초 동안 입력 없으면 자동 중지
      })
      .catch(() => {
        alert("음성 인식을 위해 마이크를 사용해주세요.");
      });
  }
  setIsListening(!isListening);
};

if (!isBrowserSupported) {
  return (
    <div>
      <p>이 브라우저는 음성 인식을 지원하지 않습니다. 다른 브라우저를 사용해 주세요.</p>
    </div>
  );
}

    return (
      <div className="flex flex-col items-center">
        <button
          onClick={handleSpeechRecognition}
          className={`px-4 py-2 rounded-lg text-white ${isListening ? "bg-red-500" : "bg-blue-500"} transition`}
        >
          {isListening ? "음성 인식 중지" : "음성 인식 시작"}
        </button>
        <p className="mt-2 text-lg font-medium">{statusMessage}</p>
      </div>
    );
  };
  
  export default SpeechToText;