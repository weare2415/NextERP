import { useState } from "react";
import {useCustomLogin} from '../hook/useCustomLogin';
import "./scss/LoginPage.css"
import {Link} from 'react-router-dom';

const initState = {
	id: "",
	name: "",
	role: "",
};

const LoginComponent = () => {
	const [loginParam, setLoginParam] = useState({ ...initState });

	const { doLogin, moveToPath } = useCustomLogin();

	const handleChange = (e) => {
		loginParam[e.target.name] = e.target.value;

		setLoginParam({ ...loginParam });
	};

	const handleClickLogin = () => {

		doLogin(loginParam).then((data) => {
			console.log(data);

			if (data.error) {
				alert("이메일과 패스워드를 다시 확인하세요");
			} else {
				alert("로그인 성공");
				moveToPath("/");
			}
		});
	};
	return (
			<div className="login-page">
				<div className="login-component">
					<div className="login-upper">
						<img src="/NextERP.png" alt="logo" className="logo" />
					</div>
					<div className="login-form">
						<div className="id-input">
							<div> 사원번호 </div>
							<input name="id" type="text" value={loginParam.id} onChange={handleChange} placeholder="사원번호를 입력하세요"/>
						</div>
						<div className="password-input">
							<div> 비밀번호 </div>
							<input name="password" type="password" value={loginParam.password} onChange={handleChange} placeholder="비밀번호를 입력하세요"/>
						</div>
					</div>
					 {/* ✅ "비밀번호 찾기" 링크 추가 */}
					 <div className="forgot-password">
        <Link to="/member/forgot-password">forgot password?</Link>
      </div>
					<div className="login-button">
						<button onClick={handleClickLogin}> 로그인 </button>
					</div>
				</div>
			</div>
	);
};

export default LoginComponent;
