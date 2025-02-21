import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const CustomActiveShapePieChart = ({ data }) => {
	return (
			<PieChart width={450} height={300}>
				<Pie
						data={data}
						cx={225}
						cy={110}
						labelLine={false}
						outerRadius={115}
						fill="#8884d8"
						dataKey="value"
				>
					{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip formatter={(value) => `${value}%`} />
				<Legend />
			</PieChart>
	);
};

export default CustomActiveShapePieChart;