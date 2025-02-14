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
