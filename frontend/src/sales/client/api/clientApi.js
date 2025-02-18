import axiosInstance from '../../../common/api/mainApi';

// 거래처 생성
export const createClient = async (clientData) => {
  const response = await axiosInstance.post('/api/clients', clientData);
  return response.data;
};

// 전체 거래처 조회 (status가 PENDING 상태가 아닌 거래처만 조회)
export const getAllClients = async (page,size) => {
  const response = await axiosInstance.get('/api/clients',{
    params: { page, size },
  });
  return response.data;
};

// clientCode로 거래처 조회
export const getClientById = async (clientCode, page = 0, size = 10) => {
  const response = await axiosInstance.get(`/api/clients/${clientCode}`, {
    params: { page, size },
  });
  return response.data;
};

// clientName으로 거래처 조회
export const getClientByName = async (clientName,page = 0,size = 10) => {
  const response = await axiosInstance.get(`/api/clients/clientName/${clientName}`,{
    params: {page,size},
  });
  return response.data;
}

// 수정 승인 요청 (PENDING 상태의 거래처만 조회)
export const getPendingClients = async (page,size) => {
  const response = await axiosInstance.get('/api/clients/pending',{
    params: { page, size },
  });
  return response.data;
};

// ✅ 특정 employeeId를 가진 거래처 조회 (추가된 코드)
export const getClientsByEmployeeId = async (employeeId, page, size) => {
  const response = await axiosInstance.get(`/api/clients/employee/${employeeId}`,{
    params: { page, size },
  });
  return response.data;
};

// 상태별 거래처 조회
export const getClientsByStatus = async (status, page, size) => {
  const response = await axiosInstance.get(`/api/clients/status/${status}`,{
    params: { page, size },
  });
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
    { params: { approvedEmployeeId } }
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