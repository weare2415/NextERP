import axiosInstance from "../../../common/api/mainApi";
// ✅ 특정 직원 정보 조회 API 추가 (🚀 오류 해결)
export const getEmployeeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ 직원 조회 실패 (ID: ${id}):`, error);
    throw error;
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
    return response.data || []; // ✅ 응답이 없을 경우 빈 배열 반환
  } catch (error) {
    console.error("직원 목록 조회 실패:", error);
    return []; // ✅ 에러 발생 시 빈 배열 반환
  }
};

// ✅ 부서 목록 조회 API
export const getDepartments = async () => {
  try {
    const response = await axiosInstance.get("/api/departments"); // API 경로 확인
    return response.data;
  } catch (error) {
    console.error("부서 목록 조회 실패:", error);
    return [];
  }
};

// ✅ 직급 목록 조회 API
export const getPositions = async () => {
  try {
    const response = await axiosInstance.get("/api/positions");
    return response.data;
  } catch (error) {
    console.error("직급 목록 조회 실패:", error);
    return [];
  }
};

// ✅ 직원 정보 수정 API
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axiosInstance.put(`/api/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`직원 수정 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ 직원 삭제 API
export const deleteEmployee = async (id) => {
  try {
    await axiosInstance.delete(`/api/employees/${id}`);
  } catch (error) {
    console.error(`직원 삭제 실패 (ID: ${id}):`, error);
    throw error;
  }
};

// ✅ ID 중복 확인 API
export const checkEmployeeIdExists = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/employees/exists/${id}`);
    return response.data; // true(중복), false(사용 가능)
  } catch (error) {
    console.error("❌ ID 중복 체크 실패:", error);
    return false; // 에러 발생 시 기본적으로 사용 가능하도록 처리
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
