import axiosInstance from '../../common/api/mainApi';

// 제품 목록 조회
export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/product/all');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product list:', error);
    throw error;
  }
};

// 특정 제품 조회
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/product/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// 제품 생성
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/product/create', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// 제품 수정
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/product/update/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// 제품 삭제 (논리적 삭제)
export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(`/product/delete/${id}`);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

// 구매 처리 API 호출
export const processPurchase = async ({ productId, quantity, price, clientCode, paymentAccountId, employee }) => {
  try {
    const response = await axiosInstance.post('/api/purchase/pending/purchase', employee, { // ✅ employee 객체를 body에 직접 전달
      params: {
        productId: Number(productId),  // ✅ Long 타입 변환
        quantity: Number(quantity),    // ✅ int 타입 변환
        price: parseFloat(price),      // ✅ BigDecimal 타입 변환
        clientCode: String(clientCode),    // ✅ Long 타입 변환
        paymentAccountId: String(paymentAccountId) // ✅ String 변환
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error processing purchase:", error);
    throw error;
  }
};


// 판매 처리 API 호출
export const processSale = async ({ productId, quantity, salePrice, clientCode, paymentAccountId, employee }) => {
  try {
    const response = await axiosInstance.post('/api/purchase/pending/sale', employee, { // ✅ employee 객체를 body에 직접 전달
      params: {
        productId: Number(productId), // ✅ Long 타입 변환
        quantity: Number(quantity),   // ✅ int 타입 변환
        salePrice: parseFloat(salePrice), // ✅ BigDecimal 타입 변환
        clientCode: String(clientCode),   // ✅ Long 타입 변환
        paymentAccountId: String(paymentAccountId) // ✅ String 변환
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error processing sale:", error);
    throw error;
  }
};


// 제품명으로 검색
export const searchProductsByName = async (productName) => {
  try {
    const response = await axiosInstance.get(`/product/search/${productName}`)
    console.log(productName)
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products with name ${productName}:`, error);
    throw error;
  }
};
