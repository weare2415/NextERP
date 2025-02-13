import axiosInstance from "../../common/api/mainApi";

// ✅ 모든 공지사항 조회
export const getAllAnnouncements = async () => {
  try {
    const response = await axiosInstance.get("/api/announcements");
    return response.data;
  } catch (error) {
    console.error("❌ 공지사항 조회 실패:", error);
    throw error;
  }
};

// ✅ 특정 공지사항 조회 (ID 기준)
export const getAnnouncementById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 공지사항 ID ${id} 조회 실패:`, error);
    throw error;
  }
};

// ✅ 특정 부서에 대한 공지사항 조회
export const getAnnouncementsByDepartment = async (departmentId) => {
  try {
    const response = await axiosInstance.get(
      `/api/announcements/department/${departmentId}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 부서 ID ${departmentId} 공지사항 조회 실패:`, error);
    throw error;
  }
};

// ✅ 특정 직위에 대한 공지사항 조회
export const getAnnouncementsByPosition = async (positionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/announcements/position/${positionId}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 직위 ID ${positionId} 공지사항 조회 실패:`, error);
    throw error;
  }
};

// ✅ 공지사항 생성
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axiosInstance.post(
      "/api/announcements",
      announcementData
    );
    return response.data;
  } catch (error) {
    console.error("❌ 공지사항 생성 실패:", error);
    throw error;
  }
};
// ✅ 공지사항 수정 (업데이트)
export const updateAnnouncement = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/api/announcements/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 공지사항 ID ${id} 수정 실패:`, error);
    throw error;
  }
};

// ✅ 공지사항 삭제
export const deleteAnnouncement = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 공지사항 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};
