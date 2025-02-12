import axiosInstance from "../../common/api/mainApi";

// Client Code로 주문 조회
export const fetchOrdersByClientCode = async (
  clientCode,
  page = 0,
  size = 10
) => {
  const response = await axiosInstance.get(`/api/order/client/${clientCode}`, {
    params: { page, size },
  });
  return response.data;
};

// Employee ID로 주문 조회
export const fetchOrdersByEmployeeId = async (
  employeeId,
  page = 0,
  size = 10
) => {
  const response = await axiosInstance.get(
    `/api/order/employee/${employeeId}`,
    {
      params: { page, size },
    }
  );
  return response.data;
};

// Product ID로 주문 조회
export const fetchOrdersByProductId = async (
  productId,
  page = 0,
  size = 10
) => {
  const response = await axiosInstance.get(`/api/order/product/${productId}`, {
    params: { page, size },
  });
  return response.data;
};

// 승인된 주문 조회
export const fetchApprovedOrders = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(`/api/order/approved`, {
    params: { page, size },
  });
  return response.data;
};

// 보류 중인 주문 조회
export const fetchPendingOrders = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(`/api/order/pending`, {
    params: { page, size },
  });
  return response.data;
};

// 구매 주문 승인
export const approvePurchaseOrder = async (transactionId) => {
  const response = await axiosInstance.put(
    `/api/order/purchase/approve/${transactionId}`
  );
  return response.data;
};

// 판매 주문 승인
export const approveSaleOrder = async (transactionId) => {
  const response = await axiosInstance.put(
    `/api/order/sale/approve/${transactionId}`
  );
  return response.data;
};

// 구매 주문 반려
export const rejectPurchaseOrder = async (transactionId) => {
  const response = await axiosInstance.delete(
    `/api/order/purchase/reject/${transactionId}`
  );
  return response.data;
};

// 판매 주문 반려
export const rejectSaleOrder = async (transactionId) => {
  const response = await axiosInstance.delete(
    `/api/order/sale/reject/${transactionId}`
  );
  return response.data;
};

// 구매 처리
export const processPurchaseOrder = async ({
  productId,
  quantity,
  price,
  clientCode,
  paymentAccountId,
  employee,
  memo,
}) => {
  const response = await axiosInstance.post("/api/order/purchase/pending", {
    productId,
    quantity,
    price,
    clientCode,
    paymentAccountId,
    employee,
    memo,
  });
  return response.data;
};

// 판매 처리
export const processSaleOrder = async ({
  productId,
  quantity,
  salePrice,
  clientCode,
  paymentAccountId,
  employee,
  memo,
}) => {
  const response = await axiosInstance.post(
    "/api/order/sale/pending",
    employee,
    {
      params: {
        productId,
        quantity,
        salePrice,
        clientCode,
        paymentAccountId,
        memo,
      },
    }
  );
  return response.data;
};

// 구매 제품 반품
export const refundPurchaseOrder = async (transactionId) => {
  const response = await axiosInstance.delete(
    `/api/order/purchase/refund/${transactionId}`
  );
  return response.data;
};

// 판매 제품 반품
export const refundSaleOrder = async (transactionId) => {
  const response = await axiosInstance.delete(
    `/api/order/sale/refund/${transactionId}`
  );
  return response.data;
};
