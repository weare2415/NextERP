import axiosInstance from "../../../common/api/mainApi";

// ✅ 특정 직원 정보 조회 API 추가
export const getEmployeeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 조회 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ 특정 부서에 속한 직원 목록 조회 (백엔드 `/api/employees/department/{departmentId}`와 매핑)
export const getEmployeesByDepartment = async (departmentId) => {
  try {
    const response = await axiosInstance.get(
        `/api/employees/department/${departmentId}`
    );
    return response.data;
  } catch (error) {
    console.error(
        `❌ 부서별 직원 조회 실패 (Department ID: ${departmentId}):`,
        error
    );
    return [];
  }
};

// ✅ 특정 직급에 속한 직원 목록 조회 (백엔드 `/api/employees/position/{positionId}`와 매핑)
export const getEmployeesByPosition = async (positionId) => {
  try {
    const response = await axiosInstance.get(
        `/api/employees/position/${positionId}`
    );
    return response.data;
  } catch (error) {
    console.error(
        `❌ 직급별 직원 조회 실패 (Position ID: ${positionId}):`,
        error
    );
    return [];
  }
};

// ✅ 특정 부서 + 특정 직급에 속한 직원 목록 조회 (백엔드 `/api/employees/department/{departmentId}/position/{positionId}`와 매핑)
export const getEmployeesByDepartmentAndPosition = async (
    departmentId,
    positionId
) => {
  try {
    const response = await axiosInstance.get(
        `/api/employees/department/${departmentId}/position/${positionId}`
    );
    return response.data;
  } catch (error) {
    console.error(
        `❌ 부서 및 직급별 직원 조회 실패 (Department ID: ${departmentId}, Position ID: ${positionId}):`,
        error
    );
    return [];
  }
};

// ✅ 직원 생성 API
export const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post("/api/employees", employeeData);
  return response.data;
};

// ✅ 직원 목록 조회 API
export const getEmployees = async () => {
  const response = await axiosInstance.get("/api/employees");
  return response.data;
};

// ✅ 직원 이름으로 검색 API
export const getEmployeesByName = async (name) => {
  const response = await axiosInstance.get(`/api/employees/name/${name}`);
  return response.data;
};

// ✅ 모든 직원 조회 API
export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.get("/api/employees");
    return response.data || [];
  } catch (error) {
    console.error("❌ 직원 목록 조회 실패:", error);
    return [];
  }
};

// ✅ 부서 목록 조회 API
export const getDepartments = async () => {
  try {
    const response = await axiosInstance.get("/api/departments");
    return response.data;
  } catch (error) {
    console.error("❌ 부서 목록 조회 실패:", error);
    return [];
  }
};

// ✅ 직급 목록 조회 API
export const getPositions = async () => {
  try {
    const response = await axiosInstance.get("/api/positions");
    return response.data;
  } catch (error) {
    console.error("❌ 직급 목록 조회 실패:", error);
    return [];
  }
};

// ✅ 직원 정보 수정 요청 (PENDING 상태로 변경)
export const requestUpdateEmployee = async (id, employeeData) => {
  try {
    const response = await axiosInstance.post(
        `/api/employees/${id}/request-update`,
        employeeData
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 정보 수정 요청 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ 승인된 직원 정보 수정 (APPROVED 상태에a서만 가능)
export const updateEmployee = async (id, employeeData) => {
  try {
    // 먼저 직원 상태를 조회하여 APPROVED 상태인지 확인
    const employee = await getEmployeeById(id);

    if (employee.status !== "APPROVED") {
      throw new Error("❌ 직원 정보는 승인 후에만 수정할 수 있습니다.");
    }

    // 승인된 경우 업데이트 진행
    const response = await axiosInstance.put(
        `/api/employees/${id}`,
        employeeData
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 수정 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ 직원 승인 API
export const approveEmployee = async (id, approvedByEmployeeId) => {
  try {
    const response = await axiosInstance.put(
        `/api/employees/${id}/approve?approvedByEmployeeId=${approvedByEmployeeId}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 승인 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ 직원 반려 API
export const rejectEmployee = async (id, approvedByEmployeeId) => {
  try {
    await axiosInstance.put(
        `/api/employees/${id}/reject?approvedByEmployeeId=${approvedByEmployeeId}`
    );
  } catch (error) {
    console.error(`❌ 직원 반려 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// // ✅ 직원 삭제 API
// export const deleteEmployee = async (id) => {
//   try {
//     await axiosInstance.delete(`/api/employees/${id}`);
//   } catch (error) {
//     console.error(`❌ 직원 삭제 실패 (ID: ${id}):`, error);
//     throw error;
//   }
// };

// ✅ ID 중복 확인 API
export const checkEmployeeIdExists = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/employees/exists/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ ID 중복 체크 실패:", error);
    return false;
  }
};

// ✅ 즉시 퇴사 처리 API
export const terminateEmployee = async (id) => {
  try {
    const response = await axiosInstance.post(`/api/employees/terminate/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ 퇴사 처리 요청 실패:", error);
    throw error;
  }
};

export const getPendingEmployees = async () => {
  try {
    const response = await axiosInstance.get("/api/employees/pending");
    console.log("📌 API 응답 데이터:", response.data); // 👉 응답 데이터 확인
    return response.data;
  } catch (error) {
    console.error("❌ PENDING 상태 직원 조회 실패:", error);
    return [];
  }
};

// ✅ 특정 직원의 승인 요청 목록 조회
export const getEmployeesByEmployeeId = async (employeeId) => {
  try {
    const response = await axiosInstance.get(
        `/api/employees/${employeeId}/requests`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ 승인 요청 목록 조회 실패 (ID: ${employeeId}):`, error);
    return [];
  }
};

// ✅ 특정 승인 상태의 직원 목록 조회
export const getEmployeesByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(`/api/employees/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 승인 상태별 직원 조회 실패 (Status: ${status}):`, error);
    return [];
  }
};

// ✅ PENDING 상태가 아닌 직원 목록 조회 (PREPARED, APPROVED, REJECTED)
export const getAllActiveEmployees = async () => {
  try {
    const response = await axiosInstance.get("/api/employees/active");
    return response.data;
  } catch (error) {
    console.error("❌ 활동 중인 직원 조회 실패:", error);
    return [];
  }
};
