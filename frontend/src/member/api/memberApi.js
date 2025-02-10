import axiosInstance, { API_SERVER_HOST } from "../../common/api/mainApi";
import axios from "axios";

const host = `${API_SERVER_HOST}/api/member`;

// ✅ 로그인 API
export const loginPost = async (loginParam) => {
	const header = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };

	const form = new URLSearchParams();
	form.append("id", loginParam.id);
	form.append("password", loginParam.password);

	console.log("전송할 데이터:", form.toString());

	try {
		const res = await axios.post(`${host}/login`, form, header);
		console.log("응답 데이터:", res.data);
		return res.data;
	} catch (error) {
		console.error("API 호출 실패:", error.response || error.message);
		throw error.response?.data || error;
	}
};

// ✅ 특정 ID로 직원 정보 가져오기
export const getEmployeeById = async (id) => {
	try {
		const res = await axiosInstance.get(`${API_SERVER_HOST}/api/employees/${id}`);
		console.log(res.data);
		return res.data;
	} catch (error) {
		console.error("Error fetching employee data:", error);
		throw error;
	}
};

export const changePassword = async ({ id, newPassword }) => {
	try {
	  const response = await axiosInstance.post(
		`${host}/change-password`,
		{ id, newPassword },
	  );
	  return response.data;
	} catch (error) {
	  console.error("비밀번호 변경 API 호출 실패:", error.response || error.message);
	  throw error.response?.data || error;
	}
  };

  export const requestPasswordReset = async ({ name, email }) => {
    console.log("요청 데이터:", { name, email }); // ✅ 디버깅용 콘솔 로그

    try {
        const response = await axiosInstance.post(
            `${host}/forgot-password`,
            { name, email }, // ✅ JSON 데이터 전송
            {
                headers: {
                    "Content-Type": "application/json", // ✅ JSON 형식 명시
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("비밀번호 재설정 요청 실패:", error.response || error.message);
        throw error.response?.data || error;
    }
};

export const getEmployeeByName = async (name) => {
	try {
		const res = await axiosInstance.get(`${API_SERVER_HOST}/api/employees/name/${name}`);
		console.log(res.data);
		return res.data;
	} catch (error) {
		console.error("Error fetching employee data:", error);
		throw error;
	}
};