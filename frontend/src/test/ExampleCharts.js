import React, {useEffect, useState} from "react";
import {
	AreaChart,
	LineChart,
	Area,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	ResponsiveContainer, Bar, ComposedChart
} from "recharts";
import {getMonthlySales} from '../accounting/api/transactionApi';
import MonthlyProductSalesPieChart from './MonthlyProductSalesPieChart';
import MonthlyCashFlowChart from './MonthlyCashFlowChart';
import QuarterProfitRateChart from './QuaterProfitRateChart';

const lineChartData = [
	{name: "Jan", uv: 4000, pv: 2400, amt: 2400},
	{name: "Feb", uv: 3000, pv: 1398, amt: 2210},
	{name: "Mar", uv: 2000, pv: 9800, amt: 2290},
	{name: "Apr", uv: 2780, pv: 3908, amt: 2000},
	{name: "May", uv: 1890, pv: 4800, amt: 2181},
	{name: "Jun", uv: 2390, pv: 3800, amt: 2500},
	{name: "Jul", uv: 3490, pv: 4300, amt: 2100},
];

const LineChartExample = () => (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart data={lineChartData}>
				<CartesianGrid strokeDasharray="3 3"/>
				<XAxis dataKey="name"/>
				<YAxis/>
				<Tooltip/>
				<Legend/>
				<Line type="monotone" dataKey="uv" stroke="#8884d8"/>
			</LineChart>
		</ResponsiveContainer>
);

const AreaChartExample = () => (
		<ResponsiveContainer width="100%" height={400}>
			<AreaChart data={lineChartData}
			           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
					</linearGradient>
					<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
						<stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
					</linearGradient>
				</defs>
				<XAxis dataKey="name"/>
				<YAxis/>
				<CartesianGrid strokeDasharray="3 3"/>
				<Tooltip/>
				<Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1}
				      fill="url(#colorUv)"/>
				<Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1}
				      fill="url(#colorPv)"/>
			</AreaChart>
		</ResponsiveContainer>
);

const ExampleCharts = () => {

	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try{
				const sampleData = await getMonthlySales();
				setData(sampleData);
			}catch(error){
				console.log(error);
			}
		}
		fetchData();
	},[])

	return (
			<div>
				<div>
					<h1>월별 판매량 및 매출액</h1>
					{/*월별 판매량 및 매출액*/}
					<ResponsiveContainer width="100%" height={400}>
						<ComposedChart data={data.slice(-10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis yAxisId="left" label={{ value: "매출 (원)", angle: -90, position: "insideLeft" }}
							       tickFormatter={(value) => value.toLocaleString()}/>
							<YAxis yAxisId="right" orientation="right" label={{ value: "판매량 (개)", angle: -90, position: "insideRight" }} />
							<Tooltip formatter={(value) => value.toLocaleString()}/>
							<Legend />
							<Bar yAxisId="right" dataKey="totalQuantity" fill="#8884d8" barSize={30} name="판매 수량" />
							<Line yAxisId="left" dataKey="totalAmount" stroke="#ff7300" strokeWidth={2} name="매출" />
						</ComposedChart>
					</ResponsiveContainer>
				</div>
				<div>-----------------------------------------------------</div>
				<div>
					<h1>월 제품별 판매수량 비율</h1>
					<MonthlyProductSalesPieChart />
				</div>
				<div>-----------------------------------------------------</div>
				<div>
					<h1>현금 흐름 및 영업이익 추이</h1>
					<MonthlyCashFlowChart />
				</div>
				<div>-----------------------------------------------------</div>

				<div>
					<h1>분기별 영업이익률 계산</h1>
					<QuarterProfitRateChart />
				</div>


			</div>
	)
};

export default ExampleCharts;