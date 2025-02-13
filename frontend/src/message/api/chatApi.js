import axiosInstance from "../../common/api/mainApi";

// ✅ 특정 사용자의 채팅방 목록 가져오기 (백엔드 변경 반영)
export const getRoomList = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chatrooms`);
    console.log("📌 전체 채팅방 응답 데이터:", response.data);

    // 모든 채팅방을 반환하고 필터링은 프론트엔드에서 처리
    return response.data;
  } catch (error) {
    console.error("❌ 채팅방 목록 가져오기 오류:", error);
    return [];
  }
};

// ✅ 새로운 채팅방 생성 API (백엔드 구조 변경 반영)
export const createChatRoom = async (senderId, receiverId) => {
  try {
    const response = await axiosInstance.post("/chatrooms/create", {
      senderId,
      receiverId,
    });
    return response.data;
  } catch (error) {
    console.error("채팅방 생성 오류:", error);
    return null;
  }
};

// ✅ 특정 채팅방의 기존 메시지 가져오기
export const getMessages = async (chatRoomId) => {
  try {
    const response = await axiosInstance.get(`/messages/${chatRoomId}`);
    return response.data || [];
  } catch (error) {
    console.error(`채팅방(${chatRoomId}) 메시지 가져오기 오류:`, error);
    return [];
  }
};

// ✅ 메시지 전송 API (백엔드 변경 반영)
export const sendMessage = async (
  chatRoomId,
  senderId,
  receiverId,
  messageText
) => {
  try {
    const response = await axiosInstance.post("/messages/send", {
      chatRoomId,
      senderId,
      receiverId, // ✅ 받는 사람 ID 추가
      messageText,
    });
    return response.data;
  } catch (error) {
    console.error("메시지 전송 오류:", error);
    return null;
  }
};
// ✅ 특정 채팅방 정보 가져오기
export const getChatRoomById = async (chatRoomId) => {
  try {
    const response = await axiosInstance.get(`/chatrooms/${chatRoomId}`);
    return response.data;
  } catch (error) {
    console.error(`채팅방(${chatRoomId}) 정보 가져오기 오류:`, error);
    return null;
  }
};
