import axiosInstance from "../../common/api/mainApi";

/**
 * 챗봇과 대화 요청 (Spring Boot → Flask)
 * @param {Object} requestData - 사용자 입력 메시지 + 직원 ID + 부서 정보
 * @param {string} token - Redux에서 가져온 JWT 토큰
 * @returns {Promise<string>} - 챗봇 응답 메시지
 */
export const askChatbot = async (
  { message, employeeId, department },
  token
) => {
  try {
    // 토큰이 없을 경우 처리
    if (!token) {
      console.error("❌ [React] 토큰이 없습니다.");
      return "⚠️ 인증이 필요합니다.";
    }

    // Bearer 접두사 추가 확인
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    // 요청 헤더에 Authorization 추가
    const headers = {
      "Content-Type": "application/json",
      Authorization: authHeader, // 🛑 토큰 추가
    };

    console.log("🔍 [React] 요청 데이터:", { message, employeeId, department });
    console.log("🔍 [React] 요청 헤더:", headers);

    // API 요청 보내기
    const response = await axiosInstance.post(
      "/api/chatbot/ask",
      { message, employeeId, department },
      { headers }
    );

    // 정상 응답 반환
    return response.data.response;
  } catch (error) {
    // 토큰 만료로 인한 401 오류 처리
    if (error.response && error.response.status === 401) {
      console.error("❌ [React] 토큰이 만료되었습니다. 새로 고침 중...");

      // 갱신된 토큰을 받아오는 로직을 추가 (필요시 구현)
      const newToken = await refreshAccessToken(); // 여기서 새로운 토큰을 받아오는 함수를 호출

      // 새로운 토큰으로 다시 요청 보내기
      if (newToken) {
        const authHeader = newToken.startsWith("Bearer ")
          ? newToken
          : `Bearer ${newToken}`;

        const headers = {
          "Content-Type": "application/json",
          Authorization: authHeader,
        };

        // API 요청 보내기 (새 토큰)
        const retryResponse = await axiosInstance.post(
          "/api/chatbot/ask",
          { message, employeeId, department },
          { headers }
        );
        return retryResponse.data.response;
      } else {
        return "⚠️ 토큰 갱신 실패";
      }
    }

    // 그 외 오류 처리
    console.error("❌ [React] 챗봇 API 오류:", error);
    return "⚠️ 서버와 연결할 수 없습니다.";
  }
};

// 토큰 갱신 함수 (예시)
const refreshAccessToken = async () => {
  try {
    // 토큰 갱신 로직 (예: 서버에서 새로운 토큰 요청)
    const response = await axiosInstance.post(
      "/api/refresh-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data && response.data.newToken) {
      return response.data.newToken; // 갱신된 새로운 토큰 반환
    } else {
      console.error("❌ [React] 새로운 토큰을 받아오는 데 실패했습니다.");
      return null;
    }
  } catch (error) {
    console.error("❌ [React] 토큰 갱신 실패:", error);
    return null;
  }
};
