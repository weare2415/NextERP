import axiosInstance from "../../common/api/mainApi";

// Client Code로 주문 조회
export const fetchOrdersByClientCode = async (
  clientCode,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/client/${clientCode}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by client code:", error);
    throw error;
  }
};

// Employee ID로 주문 조회
export const fetchOrdersByEmployeeId = async (
  employeeId,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/employee/${employeeId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by employee ID:", error);
    throw error;
  }
};

// Product ID로 주문 조회
export const fetchOrdersByProductId = async (
  productId,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/api/order/product/${productId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by product ID:", error);
    throw error;
  }
};

// ✅ 승인된(Approved) 주문 조회
export const fetchApprovedOrders = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get(`/api/order/approved`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching approved orders:", error);
    throw error;
  }
};

// ✅ 보류 중인(Pending) 주문 조회
export const fetchPendingOrders = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get(`/api/order/pending`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    throw error;
  }
};

// 구매 처리 API 호출
export const processPurchase = async ({
  productId,
  quantity,
  price,
  clientCode,
  paymentAccountId,
  employee,
}) => {
  try {
    const response = await axiosInstance.post(
      "/api/order/purchase/pending",
      employee,
      {
        // ✅ employee 객체를 body에 직접 전달
        params: {
          productId: Number(productId), // ✅ Long 타입 변환
          quantity: Number(quantity), // ✅ int 타입 변환
          price: parseFloat(price), // ✅ BigDecimal 타입 변환
          clientCode: String(clientCode), // ✅ Long 타입 변환
          paymentAccountId: String(paymentAccountId), // ✅ String 변환
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing purchase:", error);
    throw error;
  }
};

// 판매 처리 API 호출
export const processSale = async ({
  productId,
  quantity,
  salePrice,
  clientCode,
  paymentAccountId,
  employee,
}) => {
  try {
    const response = await axiosInstance.post(
      "/api/order/sale/pending",
      employee,
      {
        params: {
          productId: Number(productId), // ✅ Long 타입 변환
          quantity: Number(quantity), // ✅ int 타입 변환
          salePrice: parseFloat(salePrice), // ✅ BigDecimal 타입 변환
          clientCode: String(clientCode), // ✅ Long 타입 변환
          paymentAccountId: String(paymentAccountId), // ✅ String 변환
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing sale:", error);
    throw error;
  }
};

// 구매 주문 승인
export const approvePurchaseOrder = async (transactionId) => {
  try {
    const response = await axiosInstance.put(
      `/api/order/purchase/approve/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error approving purchase order:", error);
    throw error;
  }
};

// 판매 주문 승인
export const approveSaleOrder = async (transactionId) => {
  try {
    const response = await axiosInstance.put(
      `/api/order/sale/approve/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error approving sale order:", error);
    throw error;
  }
};

// 구매 주문 반려 (거래 삭제)
export const rejectPurchaseOrder = async (transactionId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/order/purchase/reject/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting purchase order:", error);
    throw error;
  }
};

// 판매 주문 반려 (거래 삭제)
export const rejectSaleOrder = async (transactionId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/order/sale/reject/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting sale order:", error);
    throw error;
  }
};

// 구매 주문 반품
export const refundPurchaseOrder = async (transactionId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/order/purchase/refund/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error refunding purchase order:", error);
    throw error;
  }
};

// 판매 주문 반품
export const refundSaleOrder = async (transactionId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/order/sale/refund/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error refunding sale order:", error);
    throw error;
  }
};
