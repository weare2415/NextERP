// 1. 전체 직원 급여 정보 조회
import axiosInstance from '../../../common/api/mainApi';

export const fetchAllEmployeeSalaries = async (page, size) => {
	try {
		const response = await axiosInstance.get("/api/employee-salaries", {
			params: {page, size},
		});
		return response.data;
	} catch (error) {
		console.error("직원 급여 정보를 불러오는 중 오류 발생:", error);
		throw error;
	}
};

// 2. 특정 직원 급여 정보 조회
export const fetchEmployeeSalaryById = async (employeeId) => {
	try {
		const response = await axiosInstance.get(`/api/employee-salaries/${employeeId}`);
		return response.data;
	} catch (error) {
		console.error("직원 급여 상세 정보를 불러오는 중 오류 발생:", error);
		throw error;
	}
};

// 3. 새로운 직원 급여 정보 생성
export const createEmployeeSalary = async (salaryData) => {
	try {
		const response = await axiosInstance.post("/api/employee-salaries", salaryData);
		return response.data;
	} catch (error) {
		console.error("직원 급여 정보를 생성하는 중 오류 발생:", error);
		throw error;
	}
};

// 4. 특정 직원 급여 정보 삭제
export const deleteEmployeeSalary = async (id) => {
	try {
		const response = await axiosInstance.delete(`/api/employee-salaries/${id}`);
		return response.data;
	} catch (error) {
		console.error("직원 급여 정보를 삭제하는 중 오류 발생:", error);
		throw error;
	}
};

// 5. 특정 직원의 보너스 내역 조회
export const fetchBonusLogsByEmployeeId = async (employeeId) => {
	try {
		const response = await axiosInstance.get(`/api/bonus-logs/employee/${employeeId}`);
		return response.data;
	} catch (error) {
		console.error("직원 보너스 내역 조회 오류:", error);
		throw error;
	}
};

// 6. 전체 보너스 내역 조회
export const fetchAllBonusLogs = async () => {
	try {
		const response = await axiosInstance.get("/api/bonus-logs");
		return response.data;
	} catch (error) {
		console.error("전체 보너스 내역 조회 오류:", error);
		throw error;
	}
};

// 7. 급여 지급
export const createSalary = async (salaryData) => {
	try {
		const response = await axiosInstance.post("/api/salaries", salaryData);
		return response.data;
	} catch (error) {
		console.error("급여 지급 오류:", error);
		throw error;
	}
};

// 8. 특정 직원의 지급된 급여 내역 조회
export const fetchSalariesByEmployeeId = async (employeeId) => {
	try {
		const response = await axiosInstance.get(`/api/salaries/employee/${employeeId}`);
		return response.data;
	} catch (error) {
		console.error("직원 급여 내역 조회 오류:", error);
		throw error;
	}
};

// 9. 전체 지급된 급여 내역 조회
export const fetchAllSalaries = async () => {
	try {
		const response = await axiosInstance.get("/api/salaries");
		return response.data;
	} catch (error) {
		console.error("전체 급여 내역 조회 오류:", error);
		throw error;
	}
};

// 10. 특정 지급된 급여 내역 삭제
export const deleteSalaryById = async (salaryId) => {
	try {
		const response = await axiosInstance.delete(`/api/salaries/${salaryId}`);
		return response.data;
	} catch (error) {
		console.error("급여 삭제 오류:", error);
		throw error;
	}
};