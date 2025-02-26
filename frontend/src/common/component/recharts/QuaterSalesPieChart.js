import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 색상 배열 (각 월에 대한 색상 지정)
const COLORS = ["#8884d8", "#82ca9d", "#FF5733"];

const renderCustomizedLabel = ({ percent }) => `${(percent * 100).toFixed(1)}%`;

const QuarterSalesPieChart = ({ chartData }) => {
  return (
    <ResponsiveContainer height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel} // 📌 라벨을 월(month) + 금액으로 표시
          outerRadius={140}
          innerRadius={100}
          fill="#8884d8"
          dataKey="sales"
          nameKey="month" // 📌 각 데이터의 `month` 필드를 라벨로 사용
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          wrapperStyle={{ zIndex: 4 }}
          formatter={(value) => value.toLocaleString()}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default QuarterSalesPieChart;
