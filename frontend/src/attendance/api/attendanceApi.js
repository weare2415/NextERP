import axiosInstance from "../../common/api/mainApi";

// ✅ 모든 근태 기록 조회
export const getAllAttendances = async () => {
  try {
    const response = await axiosInstance.get("/api/attendances");
    return response.data;
  } catch (error) {
    console.error("❌ 모든 근태 기록 조회 실패:", error);
    throw error;
  }
};

// ✅ 특정 직원의 근태 기록 조회
export const getAttendanceByEmployee = async (employeeId) => {
  try {
    const response = await axiosInstance.get(
      `/api/attendances/employee/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 근태 기록 조회 실패 (ID: ${employeeId}):`, error);
    throw error;
  }
};

// ✅ 특정 날짜의 근태 기록 조회
export const getAttendanceByDate = async (date) => {
  try {
    const response = await axiosInstance.get(`/api/attendances/date/${date}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 특정 날짜 근태 기록 조회 실패 (날짜: ${date}):`, error);
    throw error;
  }
};

// ✅ 특정 상태의 근태 기록 조회
export const getAttendancesByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(
      `/api/attendances/attendance/status/${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 특정 상태 근태 기록 조회 실패 (상태: ${status}):`, error);
    throw error;
  }
};

// ✅ 근태 기록 생성 (출근)
export const saveAttendance = async (attendanceData) => {
  try {
    const response = await axiosInstance.post(
      "/api/attendances",
      attendanceData
    );
    return response.data;
  } catch (error) {
    console.error("❌ 근태 기록 저장 실패:", error);
    throw error;
  }
};

export const checkIn = async (employeeId) => {
  try {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000) // ✅ KST 변환
      .toISOString()
      .split("T")[1]
      .substring(0, 8); // HH:mm:ss 형식

    const response = await axiosInstance.post("/api/attendances", {
      employeeId: employeeId,
      date: now.toISOString().split("T")[0], // ✅ 오늘 날짜
      checkInTime: koreaTime, // ✅ 한국 시간으로 변환
      status: "PRESENT", // ✅ 출근 상태
    });

    return response.data;
  } catch (error) {
    console.error("❌ 출근 실패:", error);
    throw error;
  }
};

// ✅ 퇴근 (퇴근 시간 업데이트)
export const checkOut = async (employeeId) => {
  try {
    // ✅ 현재 시간 KST로 변환
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000) // KST 변환
      .toISOString()
      .split("T")[1]
      .substring(0, 8); // HH:mm:ss 형식

    const response = await axiosInstance.post("/api/attendances", {
      employeeId: employeeId,
      date: now.toISOString().split("T")[0], // ✅ 오늘 날짜 (UTC 기준으로 YYYY-MM-DD)
      checkOutTime: koreaTime, // ✅ 퇴근 시간 KST로 변환
    });

    return response.data;
  } catch (error) {
    console.error("❌ 퇴근 실패:", error);
    throw error;
  }
};

// ✅ 근태 기록 삭제
export const deleteAttendance = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/attendances/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 근태 기록 삭제 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ 근태 상태 업데이트 출근, 퇴근, 지각용
export const updateAttendanceStatus = async (id, newStatus) => {
  try {
    const response = await axiosInstance.put(
      `/api/attendances/${id}/status`,
      null,
      {
        params: { status: newStatus },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ 근태 상태 업데이트 실패 (ID: ${id}, 상태: ${newStatus}):`,
      error
    );
    throw error;
  }
};

// 승인 대기 중인 근태 기록 조회 (PENDING 상태)
export const getPendingAttendances = async () => {
  try {
    const response = await axiosInstance.get("/api/attendances/pending");
    return response.data;
  } catch (error) {
    console.error("❌ 승인 대기 중인 근태 기록 조회 실패:", error);
    throw error;
  }
};

//승인 완료된 근태 기록 조회 (PREPARED, APPROVED, REJECTED 상태)
export const getApprovedAttendances = async () => {
  try {
    const response = await axiosInstance.get("/api/attendances/approved");
    return response.data;
  } catch (error) {
    console.error("❌ 승인된 근태 기록 조회 실패:", error);
    throw error;
  }
};

//3. 근태 승인 처리 API (PUT /api/attendances/{id}/approve)
export const approveAttendance = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/attendances/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`❌ 근태 승인 실패 (ID: ${id}):`, error);
    throw error;
  }
};

//4. 근태 승인 거부 API (PUT /api/attendances/{id}/reject)
export const rejectAttendance = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/attendances/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error(`❌ 근태 승인 거부 실패 (ID: ${id}):`, error);
    throw error;
  }
};

//승인여부요청
export const requestApproval = async (id, status, date, reason) => {
  try {
    const response = await axiosInstance.put(
      `/api/attendances/${id}/request-approval`,
      null,
      {
        params: {
          // ✅ 요청 파라미터 방식으로 전달
          status, // ✅ 근태 유형
          date, // ✅ 신청 날짜
          reason, // ✅ 신청 사유
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `❌ 승인 요청 실패 (ID: ${id}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};
