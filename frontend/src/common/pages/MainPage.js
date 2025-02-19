import React, {useEffect} from 'react';
import {useCustomLogin} from '../member/hook/useCustomLogin';
import BasicLayout from './BasicLayout';

const MainPage = () => {
	const {isLogin, moveToLogin} = useCustomLogin()

	useEffect(() => {
		if (!isLogin) {
			moveToLogin();
		}
	}, [isLogin, moveToLogin]);

	return (
			<BasicLayout>
			<div>
				{isLogin ? (
						<div>
							MAIN PAGE HERE
						</div>
				) : null}
			</div>
				</BasicLayout>
	);
};

export default MainPage;