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

export const getUnreadMessages = async (userId) => {
  try {
    const response = await axiosInstance.get(`/messages/unread/${userId}`);
    return response.data || {};
  } catch (error) {
    console.error(
      `❌ 안 읽은 메시지 가져오기 오류 (userId: ${userId}):`,
      error
    );
    return {};
  }
};

// ✅ 특정 채팅방 메시지 읽음 처리
export const markMessagesAsRead = async (userId, chatRoomId) => {
  try {
    await axiosInstance.post(`/messages/read/${userId}/${chatRoomId}`);
  } catch (error) {
    console.error(
      `❌ 메시지 읽음 처리 오류 (userId: ${userId}, chatRoomId: ${chatRoomId}):`,
      error
    );
  }
};

// ✅ 채팅방 나가기 API
export const leaveChatRoom = async (chatRoomId) => {
  try {
    const response = await axiosInstance.post(`/chatrooms/leave/${chatRoomId}`);
    console.log(`✅ 채팅방 ${chatRoomId} 나가기 완료`);

    return response.data; // API가 boolean을 반환하는 경우
  } catch (error) {
    console.error(`❌ 채팅방 나가기 오류 (chatRoomId: ${chatRoomId}):`, error);
    return true;
  }
};

// ✅ 🔥 활성화된 (isActive = true) 채팅방 가져오기 API 추가
export const getActiveChatRooms = async (userId) => {
  try {
    const response = await axiosInstance.get(`/chatrooms/active/${userId}`);
    console.log(
      `📌 활성화된 채팅방 목록 불러오기 완료 (userId: ${userId})`,
      response.data
    );

    return response.data; // 활성화된 채팅방 리스트 반환
  } catch (error) {
    console.error(
      `❌ 활성화된 채팅방 가져오기 오류 (userId: ${userId}):`,
      error
    );
    return [];
  }
};
