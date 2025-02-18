import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const CustomActiveShapePieChart = ({ data }) => {
	return (
			<PieChart width={400} height={400}>
				<Pie
						data={data}
						cx={200}
						cy={150}
						labelLine={false}
						outerRadius={150}
						fill="#8884d8"
						dataKey="value"
				>
					{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
					<br/>
					<br/>
				</Pie>
				<Tooltip formatter={(value) => `${value}%`} />
				<Legend />
			</PieChart>
	);
};

export default CustomActiveShapePieChart;