import React, {useEffect, useState} from 'react';
import {getMonthlySales} from '../accounting/api/transactionApi';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend, Line, ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

const MonthlySalesChart = () => {
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
	);
};

export default MonthlySalesChart;