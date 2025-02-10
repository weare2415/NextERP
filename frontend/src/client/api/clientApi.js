import axiosInstance from '../../common/api/mainApi';

// 거래처 생성
export const createClient = async (clientData) => {
  const response = await axiosInstance.post('/api/clients', clientData);
  return response.data;
};

// clientCode로 거래처 조회
export const getClientById = async (clientCode) => {
  const response = await axiosInstance.get(`/api/clients/${clientCode}`);
  return response.data;
};

// 전체 거래처 조회 (status가 PENDING 상태가 아닌 거래처만 조회)
export const getAllClients = async () => {
  const response = await axiosInstance.get('/api/clients');
  return response.data;
};

// 수정 승인 요청 (PENDING 상태의 거래처만 조회)
export const getPendingClients = async () => {
  const response = await axiosInstance.get('/api/clients/pending');
  return response.data;
};

// ✅ 특정 employeeId를 가진 거래처 조회 (추가된 코드)
export const getClientsByEmployeeId = async (employeeId) => {
  const response = await axiosInstance.get(`/api/clients/employee/${employeeId}`);
  return response.data;
};

// 상태별 거래처 조회
export const getClientsByStatus = async (status) => {
  const response = await axiosInstance.get(`/api/clients/status/${status}`);
  return response.data;
};

// 거래처 수정 요청
export const requestUpdateClient = async (clientCode, updatedData) => {
  const response = await axiosInstance.put(
    `/api/clients/${clientCode}/request-update`,
    updatedData
  );
  return response.data;
};

// 거래처 '승인'
export const approveClient = async (clientCode, approvedEmployeeId) => {
  const response = await axiosInstance.put(
    `/api/clients/${clientCode}/approve`,
    null,
    { params: { approvedEmployeeId } } // 쿼리 파라미터 전송
  );
  return response.data;
};

// 거래처 '반려'
export const rejectClient = async (clientCode, approvedEmployeeId) => {
  await axiosInstance.put(
    `/api/clients/${clientCode}/reject`,
    null,
    { params: { approvedEmployeeId } } // 쿼리 파라미터 전송
  );
};

// 거래처 삭제
export const deleteClient = async (clientCode) => {
  await axiosInstance.delete(`/api/clients/${clientCode}`);
};