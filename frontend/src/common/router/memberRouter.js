import {lazy, Suspense} from 'react';
const Loading = <div>Loading...</div>
const Login = lazy(() => import("../../member/pages/LoginPage"));
const Logout = lazy(() => import("../../member/pages/LogoutPage"));
const ChangePassword = lazy(() => import("../../member/pages/ChangePassword")); // ✅ 추가됨
const ForgotPassword = lazy(() => import("../../member/pages/ForgotPassword"));


const memberRouter = () => {
	return [
		{
			path: "login",
			element: (
					<Suspense fallback={Loading}>
						<Login />
					</Suspense>
			),
		},
		{
			path: "logout",
			element: (
					<Suspense fallback={Loading}>
						<Logout />
					</Suspense>
			)
		}, {
			path: "change-password", // ✅ 추가된 경로
			element: (
			  <Suspense fallback={Loading}>
				<ChangePassword />
			  </Suspense>
			),
		},
		{
			path: "forgot-password", // ✅ 비밀번호 찾기 페이지 추가
			element: (
			  <Suspense fallback={Loading}>
				<ForgotPassword />
			  </Suspense>
			),
		}
		
	];
};

export default memberRouter;
