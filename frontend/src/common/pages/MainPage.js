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
								<div>
									<div style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "flex-start",
										marginLeft: '1rem',
										height:'450px'
									}}>
										<div style={{width:'100%', marginRight: '1rem', marginTop:'-2rem'}}>
											{/*<div style={{fontSize: '2rem'}}>영업이익</div>*/}
											<div>
											<MonthlyCashFlowChart />
											</div>
										</div>
									</div>
									<div>
										<div>
											<div>
												<div style={{fontSize: '2rem', marginBottom:'0.2rem'}}>제품 월별 매출 현황</div>
												<MonthlyProductSalesPieChart/></div>
										</div>
									</div>
									<div style={{display: 'flex', justifyContent: 'center', marginTop:'1rem'}}>
										<div style={{width:'100%'}}>
											<div style={{fontSize: '2rem', marginBottom:'1rem' }}>월별 매출 현황</div>
											<MonthlySalesChart/></div>

{/*										<div style={{width:'100%'}}>
											<div style={{fontSize: '2rem', marginBottom:'1rem'}}>분기별 매출 및 영업이익</div>
											<QuarterProfitRateChart/></div>*/}

										<div>
										<div style={{fontSize: '2rem'}}>캘린더</div>
										<div style={{marginTop: '1.3rem', marginRight: '1rem'}}>
											<CalendarComponent/>
										</div>
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