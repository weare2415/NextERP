import axiosInstance from "../../common/api/mainApi";

const API_BASE_URL = "/api/chatbot"; // ✅ 기본 API 경로 설정

/**
 * 챗봇과 대화 요청 (Spring Boot → Flask)
 * @param {string} message - 사용자 입력 메시지
 * @returns {Promise<string>} - 챗봇 응답 메시지
 */
export const askChatbot = async (message) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/ask`, {
      message,
    });
    return response.data.response;
  } catch (error) {
    console.error("❌ 챗봇 API 오류:", error);
    return "⚠️ 서버와 연결할 수 없습니다.";
  }
};
