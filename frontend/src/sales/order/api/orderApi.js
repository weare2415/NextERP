import axiosInstance from "../../../common/api/mainApi";

// 판매 주문 처리(초기 승인 요청)
export const processSaleOrder = async ({
  productId,
  quantity,
  salePrice,
  clientCode,
  paymentAccountId,
  employee,
  saleDate,
  memo,
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/order/sale/pending`,
      employee,
      {
        params: {
          productId,
          quantity,
          salePrice,
          clientCode,
          paymentAccountId,
          saleDate,
          memo,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing sale order:", error);
    throw error;
  }
};

// 구매 주문 처리 (초기 승인 요청)
export const processPurchaseOrder = async ({
  productId,
  quantity,
  purchasePrice,
  clientCode,
  paymentAccountId,
  employee,
  purchaseDate,
  memo,
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/order/purchase/pending`,
      employee,
      {
        params: {
          productId,
          quantity,
          purchasePrice,
          clientCode,
          paymentAccountId,
          purchaseDate,
          memo,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing purchase order:", error);
    throw error;
  }
};

// id로 조회
export const fetchOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw error;
  }
};

// Client Code로 주문 조회
export const fetchOrdersByClientCode = async (clientCode, page, size) => {
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
export const fetchOrdersByEmployeeId = async (employeeId, page, size) => {
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
export const fetchOrdersByProductId = async (productId, page, size) => {
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

// 승인된(Approved) 주문 조회
export const fetchApprovedOrders = async (page, size) => {
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

// 보류 중인(Pending) 주문 조회
export const fetchPendingOrders = async (page, size) => {
  try {
    const response = await axiosInstance.get(`/api/order/pending`, {
      params: { page, size },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending orders:", error);
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

// 제품 거래 카운트
export const getOrderCount = async () => {
  try{
    const response = await axiosInstance.get(`/api/order/order-counts`);
    return response.data;
  }catch(error){
    console.error("Error counting orders:", error);
    throw error;
  }
}
