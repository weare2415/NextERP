import axiosInstance from "../../common/api/mainApi";

// Client Code로 주문 조회
export const fetchOrdersByClientCode = async (clientCode) => {
  try {
    const response = await axiosInstance.get(`/api/order/client/${clientCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by client Code:", error);
    throw error;
  }
};

// Employee ID로 주문 조회
export const fetchOrdersByEmployeeId = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/api/order/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by employee ID:", error);
    throw error;
  }
};

// Product ID로 주문 조회
export const fetchOrdersByProductId = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/order/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by product ID:", error);
    throw error;
  }
};

// ✅ 승인된(Approved) 주문 조회
export const fetchApprovedOrders = async () => {
  try {
    const response = await axiosInstance.get(`/api/order/approved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approved orders:", error);
    throw error;
  }
};

// ✅ 승인 요청 중(Pending) 주문 조회
export const fetchPendingOrders = async () => {
  try {
    const response = await axiosInstance.get(`/api/order/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    throw error;
  }
};

// ✅ 거래처명(clientCode) + 주문 타입(orderType) 기반 검색
export const fetchApprovedOrdersByClientAndType = async (clientCode, orderType) => {
  try {
    const response = await axiosInstance.get(`/api/order/search`, {
      params: { clientCode, orderType }, // 요청 파라미터로 clientCode와 orderType 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching approved orders by client and type:", error);
    throw error;
  }
};

// 거래or판매 요청 '승인'
export const approveOrder = async (transactionId) => {
  try {
    // PUT 요청: /api/purchase/approve/{id}
    const response = await axiosInstance.put(`/api/order/approve/${transactionId}`);
    return response.data; // 승인된 OrderDTO 객체 반환
  } catch (error) {
    console.error("Error approving order:", error);
    throw error;
  }
};

// 거래or판매 요청 '반려'
export const rejectOrder = async (transactionId) => {
  try {
    // DELETE 요청: /api/purchase/reject/{id}
    const response = await axiosInstance.delete(`/api/order/reject/${transactionId}`);
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("Error rejecting order:", error);
    throw error;
  }
};