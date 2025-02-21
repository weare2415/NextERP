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
				<ResponsiveContainer width="100%" height={300}>
					<ComposedChart data={data.slice(-10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<XAxis dataKey="month" />
						<YAxis yAxisId="left"
						       tickFormatter={(value) => (Math.floor(value / 1000)).toLocaleString()} />
						<YAxis yAxisId="right" orientation="right" />
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