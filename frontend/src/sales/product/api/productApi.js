import axiosInstance from "../../../common/api/mainApi";

// 모든 제품 목록 조회 (페이징 지원)
export const getAllProducts = async (page = 0, size = 10) => {
	try {
		const response = await axiosInstance.get("/product/all", {
			params: {page, size},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching product list:", error);
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
		const response = await axiosInstance.post("/product/create", productData);
		return response.data;
	} catch (error) {
		console.error("Error creating product:", error);
		throw error;
	}
};

// 제품 수정
export const updateProduct = async (id, productData) => {
	try {
		const response = await axiosInstance.put(
				`/product/update/${id}`,
				productData
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating product with ID ${id}:`, error);
		throw error;
	}
};

// 제품 삭제
export const deleteProduct = async (id) => {
	try {
		await axiosInstance.delete(`/product/delete/${id}`);
	} catch (error) {
		console.error(`Error deleting product with ID ${id}:`, error);
		throw error;
	}
};

// 제품명으로 검색 (페이징 지원)
export const searchProductsByName = async (name, page = 0, size = 10) => {
	try {
		const response = await axiosInstance.get(`/product/search/${name}`, {
			params: {page, size},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching products with name:", error);
		throw error;
	}
};
