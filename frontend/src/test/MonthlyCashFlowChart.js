import React, { useEffect, useState } from 'react';
import {
	getMonthlyCashFlows,
	getWeeklyProfit
} from '../accounting/api/transactionApi';
import {
	CartesianGrid,
	Legend,
	Line,
	Tooltip,
	XAxis,
	YAxis,
	ResponsiveContainer,
	ComposedChart,
	Scatter,
	ZAxis
} from 'recharts';
import {
	getMonthFromWeek,
} from '../common/hooks/getMonthFromWeek';

const MonthlyCashFlowChart = () => {
	const [cashFlowData, setCashFlowData] = useState([]);
	const [profitData, setProfitData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getMonthlyCashFlows();
				setCashFlowData(response);

				const profitResponse = await getWeeklyProfit();
				setProfitData(profitResponse);
			} catch (err) {
				console.error("데이터 로딩 실패:", err);
			}
		};
		fetchData();
	}, []);

	const transformedCashFlowData = profitData.map(({ week }) => {
		const [year, weekNum] = week.split('-');
		const month = getMonthFromWeek(year, weekNum); // 주차를 기반으로 해당 월 찾기
		const correspondingCashFlow = cashFlowData.find(c => c.month === month)?.cashFlow || 0;
		return {
			week,
			cashFlow: correspondingCashFlow
		};
	});

	const filteredProfitData = profitData.filter(d => {
		const weekYear = d.week.split('-')[0];
		const weekNumber = parseInt(d.week.split('-')[1]);

		// 주차(YYYY-WW) -> 월(YYYY-MM) 변환
		const weekMonth = getMonthFromWeek(weekYear, weekNumber);
		return cashFlowData.slice(1).some(c => c.month === weekMonth);
	});

	return (
			<div style={{ width: '100%', height: 500 }}>
				<ResponsiveContainer width="100%" height={400}>
					<ComposedChart data={transformedCashFlowData}>
						<defs>
							<radialGradient id="scatterGradient" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
								<stop offset="100%" stopColor="#8884d8" stopOpacity={0.1} />
							</radialGradient>
						</defs>

						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="week" />
						<YAxis
								yAxisId="left"
								label={{ value: "현금 흐름", angle: -90, position: "insideLeft" }}
								domain={["auto", "auto"]}
						/>
						<YAxis
								yAxisId="right"
								orientation="right"
								label={{ value: "영업 이익", angle: -90, position: "insideRight" }}
								domain={["auto", "auto"]}
						/>
						<ZAxis type="number" dataKey="operatingProfit" range={[5000,20000]} />
						<Tooltip formatter={(value) => value.toLocaleString()}/>
						<Legend />
						{/* 현금 흐름 (Line) */}
						<Line
								yAxisId="left"
								type="monotone"
								dataKey="cashFlow"
								stroke="#82ca9d"
								name="현금 흐름"
								dot={{ stroke: '#82ca9d', strokeWidth: 2 }}
						/>
						{/* 영업 이익 (Scatter) */}
						<Scatter
								yAxisId="right"
								name="영업 이익"
								data={filteredProfitData}
								fill="url(#scatterGradient)"
								dataKey="operatingProfit"
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
	);
};

export default MonthlyCashFlowChart;