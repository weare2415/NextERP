import React, {useEffect} from 'react';
import {useCustomLogin} from '../member/hook/useCustomLogin';
import BasicLayout from './BasicLayout';
import CalendarComponent from '../component/CalenderComponent';
import AnnouncementList from '../../announcement/components/AnnouncementList';
import MonthlySalesChart from '../../test/MonthlySalesChart';
import MonthlyProductSalesPieChart
	from '../../test/MonthlyProductSalesPieChart';
import QuarterProfitRateChart from '../../test/QuaterProfitRateChart';
import MonthlyCashFlowChart from '../../test/MonthlyCashFlowChart';
import OrderTreeMap from '../../test/OrderTreeMap';

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
							<div style={{display: 'flex', flexDirection: 'column'}}>
								{/*1열*/}
								<div>
									<div>
										<div style={{fontSize: '1.5rem', marginBottom: '1rem'}}>월별
											매출 현황
										</div>
										<MonthlySalesChart/></div>

									{/*2열*/}
									<div style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'flex-start',
										justifyContent: 'space-between',
										marginTop: '1rem'
									}}>
										<div>
											<div style={{
												width: '100%',
												marginRight: '1rem',
												height: '450px'
											}}>
												<div style={{
													fontSize: '1.5rem',
													marginBottom: '0.2rem'
												}}>월별 제품 판매
												</div>
												<MonthlyProductSalesPieChart/></div>
										</div>
										<div>
											<div style={{fontSize: '1.5rem'}}>캘린더</div>
											<div style={{marginTop: '1.3rem', marginRight: '1rem'}}>
												<CalendarComponent/>
											</div>
										</div>
										<div>
											<div style={{
												width: '450px',
												height: '400px',
												marginLeft: '3rem',
												background: 'gray'
											}}>챗봇
											</div>
										</div>
									</div>

									{/*3열*/}
									<div style={{
										width: '100%',
										marginRight: '1rem',
										marginTop: '-3rem'
									}}>
										<div>
											<MonthlyCashFlowChart/>
										</div>
									</div>

									{/*4열*/}
									<div style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'flex-start',
										justifyContent: 'space-between',
										marginTop:'2rem'
									}}>
										<div>
											<QuarterProfitRateChart/></div>
										<div style={{width: '1000px'}}>
											<div style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
												거래 제품 분포
											</div>
											<OrderTreeMap/>
										</div>
									</div>
								</div>
							</div>
					) : null}
				</div>
			</BasicLayout>
	);
};

export default MainPage;