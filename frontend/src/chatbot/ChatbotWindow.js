// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { askChatbot } from "../chatbot/api/chatbotApi";

// function ChatbotWindow() {
//   const [message, setMessage] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Redux 상태 확인
//   const employeeId = useSelector((state) => state.loginSlice.id);
//   const token = useSelector((state) => state.loginSlice.accessToken);

//   // ✅ Redux 값이 없는 경우 sessionStorage에서 가져오기 (새 창 유지)
//   useEffect(() => {
//     if (!employeeId) {
//       sessionStorage.setItem("employeeId", employeeId);
//     }
//     if (!token) {
//       sessionStorage.setItem("token", token);
//     }
//   }, [employeeId, token]);

//   const sendMessage = async (msg) => {
//     if (!msg.trim()) return;

//     setChatHistory((prev) => [...prev, { sender: "user", text: msg }]);
//     setMessage("");
//     setLoading(true);

//     const requestData = {
//       message: msg,
//       employeeId: sessionStorage.getItem("employeeId") || employeeId, // ✅ Redux 없으면 sessionStorage 사용
//     };

//     try {
//       const chatbotResponse = await askChatbot(
//         requestData,
//         sessionStorage.getItem("token") || token
//       );
//       if (chatbotResponse) {
//         setChatHistory((prev) => [
//           ...prev,
//           { sender: "bot", text: chatbotResponse },
//         ]);
//       } else {
//         setChatHistory((prev) => [
//           ...prev,
//           { sender: "bot", text: "⚠️ 응답을 불러오는 중 오류 발생!" },
//         ]);
//       }
//     } catch (error) {
//       console.error("❌ 챗봇 API 오류:", error);
//       setChatHistory((prev) => [
//         ...prev,
//         { sender: "bot", text: "🚨 서버 오류 발생!" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <h2>💬 챗봇 (새 창)</h2>
//       <div className="chat-box">
//         {chatHistory.map((chat, index) => (
//           <div key={index} className={`chat-message ${chat.sender}`}>
//             {chat.text}
//           </div>
//         ))}
//         {loading && <div className="chat-message bot">🔄 조회 중...</div>}
//       </div>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           sendMessage(message);
//         }}
//         className="chat-input-form"
//       >
//         <input
//           type="text"
//           placeholder="질문을 입력하세요..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="chat-input"
//         />
//         <button type="submit" className="chat-send-btn">
//           보내기
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ChatbotWindow;
