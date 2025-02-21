import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import {useEffect, useState} from 'react';
import {
	getMonthlyProfit,
	getMonthlySales
} from '../accounting/api/transactionApi';
import QuarterSalesPieChart from './QuaterSalesPieChart';
import QuarterProfitGaugeChart from './QuaterProfitGaugeChart';

const QuarterProfitRateChart = () => {
	const [salesData, setSalesData] = useState([]);
	const [profitData, setProfitData] = useState([]);
	const [quarterData, setQuarterData] = useState({ totalSales: 0, avgProfitRate: 0, lastQuarter: "N/A" });
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const sales = await getMonthlySales();
				const profit = await getMonthlyProfit();

				setSalesData(sales);
				setProfitData(profit);
			} catch (error) {
				console.error("데이터 로드 실패:", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (salesData.length > 0 && profitData.length > 0) {
			const quarterInfo = getLastQuarterData(salesData, profitData);
			setQuarterData(quarterInfo);
			setChartData(quarterInfo.chartData);
		}
	}, [salesData, profitData]);

	// 📌 직전 분기의 매출액과 영업이익률 계산 및 차트 데이터 생성
	const getLastQuarterData = (sales, profit) => {
		if (sales.length < 3 || profit.length < 3) return { totalSales: 0, avgProfitRate: 0, lastQuarter: "N/A", chartData: [] };

		const now = new Date();
		const currentMonth = now.getMonth() + 1;
		let targetQuarter, lastQuarterNumber;

		if (currentMonth >= 1 && currentMonth <= 3) {
			targetQuarter = [10, 11, 12]; // Q4 → Q1
			lastQuarterNumber = "4";
		} else if (currentMonth >= 4 && currentMonth <= 6) {
			targetQuarter = [1, 2, 3]; // Q1 → Q2
			lastQuarterNumber = "1";
		} else if (currentMonth >= 7 && currentMonth <= 9) {
			targetQuarter = [4, 5, 6]; // Q2 → Q3
			lastQuarterNumber = "2";
		} else {
			targetQuarter = [7, 8, 9]; // Q3 → Q4
			lastQuarterNumber = "3";
		}

		// 📌 직전 분기 데이터 필터링 및 변환
		const lastQuarterData = sales.filter(item => {
			const month = parseInt(item.month.split('-')[1]);
			return targetQuarter.includes(month);
		}).map((item) => {
			const matchingProfit = profit.find(p => p.month === item.month);
			const salesAmount = item.totalAmount || 0;
			const profitAmount = matchingProfit ? matchingProfit.operatingProfit || 0 : 0;
			const profitRate = salesAmount > 0 ? ((profitAmount / salesAmount) * 100).toFixed(2) : 0;

			return {
				month: item.month,
				sales: salesAmount,
				profit: profitAmount,
				profitRate: parseFloat(profitRate)
			};
		});

		const totalSales = lastQuarterData.reduce((sum, item) => sum + item.sales, 0);
		const avgProfitRate = totalSales > 0
				? lastQuarterData.reduce((sum, item) => sum + item.profitRate, 0) / lastQuarterData.length
				: 0;

		return { totalSales, avgProfitRate, lastQuarter: lastQuarterNumber, chartData: lastQuarterData };
	};

	return (
			<div className="quarter-summary">
				<h3>{quarterData.lastQuarter} 분기 매출액</h3>
				<p>{quarterData.totalSales.toLocaleString()} 원</p>
				<QuarterSalesPieChart chartData={chartData} />

				<h3>{quarterData.lastQuarter} 분기 영업이익률</h3>
				<p>{quarterData.avgProfitRate.toFixed(2)}%</p>
				<QuarterProfitGaugeChart avgProfitRate={quarterData.avgProfitRate} />


			</div>
	);
};

export default QuarterProfitRateChart;