import axiosInstance from '../../common/api/mainApi';

export const getAllTransactions = async (page, size) => {
		const response = await axiosInstance.get(`/transactions`, {
			params: { page, size },
		});
		return response.data;
}

export const getAllTransactionsList = async () => {
	const response = await axiosInstance.get(`/transactions/list`);
	return response.data;
}

export const getTransactionByDateBetween = async (startDate, endDate, page = 0, size = 10) => {
	const response = await axiosInstance.get(`/transactions/search/date`, {
		params: {startDate, endDate, page, size },
	});
	return response.data;
}

//월별 매출 및 판매수량
export const getMonthlySales = async () => {
	const response = await axiosInstance.get(`/transactions/sales/monthly`);
	// console.log(response);
	return response.data;
}

// 월 제품별 판매수량 비율
export const getMonthlyProductsSales = async () => {
	const response = await axiosInstance.get(`/transactions/sales/product/monthly`);
	return response.data;
}

// 월별 현금흐름
export const getMonthlyCashFlows = async () => {
	const response = await axiosInstance.get(`/journal-entries/cashflow/monthly`);
	// console.log(response);
	return response.data;
}

// 주별 영업이익
export const getWeeklyProfit = async () => {
	const response = await axiosInstance.get(`/journal-entries/profit/weekly`);
	return response.data;
}
