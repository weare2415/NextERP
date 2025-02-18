import axiosInstance from "../../../common/api/mainApi";

//  모든 근태 기록 조회
export const getAllAttendances = async (page = 0, size = 10) => {
  try {
    console.log(`📢 모든 근태 기록 요청: page=${page}, size=${size}`);
    const response = await axiosInstance.get("/api/attendances", {
      params: { page, size },
    });
    console.log("📌 서버 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 모든 근태 기록 조회 실패:", error);
    throw error;
  }
};

// 특정 직원의 근태 기록 조회
export const getAttendanceByEmployee = async (
  employeeId,
  page = 0,
  size = 10
) => {
  try {
    console.log(
      `📢 직원 근태 기록 요청: ID=${employeeId}, page=${page}, size=${size}`
    );
    const response = await axiosInstance.get(
      `/api/attendances/employee/${employeeId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 근태 기록 조회 실패 (ID: ${employeeId}):`, error);
    throw error;
  }
};

//  특정 날짜의 근태 기록 조회
export const getAttendanceByDate = async (date, page = 0, size = 10) => {
  try {
    console.log(
      `📢 특정 날짜 근태 기록 요청: 날짜=${date}, page=${page}, size=${size}`
    );
    const response = await axiosInstance.get(`/api/attendances/date/${date}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ 특정 날짜 근태 기록 조회 실패 (날짜: ${date}):`, error);
    throw error;
  }
};

// 특정 상태의 근태 기록 조회
export const getAttendancesByStatus = async (status, page = 0, size = 10) => {
  try {
    console.log(
      `📢 특정 상태 근태 기록 요청: 상태=${status}, page=${page}, size=${size}`
    );
    const response = await axiosInstance.get(
      `/api/attendances/attendance/status/${status}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 특정 상태 근태 기록 조회 실패 (상태: ${status}):`, error);
    throw error;
  }
};

//휴가 병가 조회
export const getVacationAndSickAttendance = async (
  employeeId,
  page = 0,
  size = 5
) => {
  try {
    console.log(
      `📢 휴가 & 병가 근태 기록 요청: 사원ID=${employeeId}, page=${page}, size=${size}`
    );

    // ✅ 로그인한 사원의 데이터만 가져오기 위해 employeeId 추가
    const [vacationRes, sickRes] = await Promise.all([
      axiosInstance.get(`/api/attendances/attendance/status/휴가`, {
        params: { employeeId, page, size }, // ✅ employeeId 추가
      }),
      axiosInstance.get(`/api/attendances/attendance/status/병가`, {
        params: { employeeId, page, size }, // ✅ employeeId 추가
      }),
    ]);

    // ✅ 응답 로그 확인
    console.log("✅ 휴가 응답 데이터:", vacationRes.data);
    console.log("✅ 병가 응답 데이터:", sickRes.data);

    // ✅ 사원 ID가 일치하는 데이터만 필터링
    const filteredVacation = vacationRes.data.content.filter(
      (record) => record.employeeId === Number(employeeId)
    );
    const filteredSick = sickRes.data.content.filter(
      (record) => record.employeeId === Number(employeeId)
    );

    console.log("📌 필터링된 휴가 데이터:", filteredVacation);
    console.log("📌 필터링된 병가 데이터:", filteredSick);

    return {
      content: [...filteredVacation, ...filteredSick],
      totalPages: Math.max(
        vacationRes.data.totalPages,
        sickRes.data.totalPages
      ),
    };
  } catch (error) {
    console.error(`❌ [${employeeId}] 휴가 & 병가 근태 기록 조회 실패:`, error);
    throw error;
  }
};

// 자택 근무
export const getRemoteWorkAttendance = async (
  employeeId,
  page = 0,
  size = 5
) => {
  try {
    console.log(
      `📢 [${employeeId}] 재택근무 근태 기록 요청: page=${page}, size=${size}`
    );

    // ✅ 로그인한 사원의 ID를 API에 전달하여 해당 사원의 데이터만 조회
    const response = await axiosInstance.get(
      `/api/attendances/attendance/status/재택근무`,
      {
        params: { employeeId, page, size }, // ✅ employeeId 추가
      }
    );

    console.log("✅ API 응답 데이터 (재택근무):", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ [${employeeId}] 재택근무 기록 조회 실패:`, error);
    throw error;
  }
};

// 근태 기록 생성 (출근)
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

//출근 (post 부분)
export const checkIn = async (employeeId) => {
  try {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000) //
      .toISOString()
      .split("T")[1]
      .substring(0, 8); // HH:mm:ss 형식

    const response = await axiosInstance.post("/api/attendances", {
      employeeId: employeeId,
      date: now.toISOString().split("T")[0], //
      checkInTime: koreaTime, //
      status: "PRESENT", // 출근 상태
    });

    return response.data;
  } catch (error) {
    console.error("❌ 출근 실패:", error);
    throw error;
  }
};

// 출근, 퇴근, 지각 조회(MyAttendanceList)
export const getAttendancesPresentLateOffWork = async (page = 0, size = 10) => {
  try {
    console.log(`📢 출근/지각/퇴근 근태 기록 요청: page=${page}, size=${size}`);
    const response = await axiosInstance.get(
      "/api/attendances/present-late-offwork",
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ 출근/지각/퇴근 근태 기록 조회 실패:", error);
    throw error;
  }
};

// 퇴근 (퇴근 시간 업데이트)
export const checkOut = async (employeeId) => {
  try {
    // 현재 시간 KST로 변환
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000) // KST 변환
      .toISOString()
      .split("T")[1]
      .substring(0, 8); // HH:mm:ss 형식

    const response = await axiosInstance.post("/api/attendances", {
      employeeId: employeeId,
      date: now.toISOString().split("T")[0], //  오늘 날짜 (UTC 기준으로 YYYY-MM-DD)
      checkOutTime: koreaTime, //  퇴근 시간 KST로 변환
    });

    return response.data;
  } catch (error) {
    console.error("❌ 퇴근 실패:", error);
    throw error;
  }
};

// 근태 기록 삭제
export const deleteAttendance = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/attendances/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 근태 기록 삭제 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// 근태 상태 업데이트 출근, 퇴근, 지각용
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

// 승인 대기 중인 근태 기록 조회
export const getPendingAttendances = async (page = 0, size = 10) => {
  try {
    console.log(`📢 승인 대기 근태 기록 요청: page=${page}, size=${size}`);
    const response = await axiosInstance.get("/api/attendances/pending", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("❌ 승인 대기 근태 기록 조회 실패:", error);
    throw error;
  }
};

//승인 완료된 근태 기록 조회 (PREPARED, APPROVED, REJECTED 상태)
export const getApprovedAttendances = async (page = 0, size = 10) => {
  try {
    console.log(`📢 승인된 근태 기록 요청: page=${page}, size=${size}`);
    const response = await axiosInstance.get("/api/attendances/approved", {
      params: { page, size },
    });
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
