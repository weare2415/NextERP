import React, { useEffect, useState } from "react";
import { getMonthlyProductsSales } from "../../../accounting/api/transactionApi";
import CustomActiveShapePieChart from "./CustomActiveShapePieChart";
import "./MonthlyProductSalesPieChart.scss";

const MonthlyProductSalesPieChart = () => {
  const [monthlySales, setMonthlySales] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getMonthlyProductsSales().then((res) => {
      setMonthlySales(res);
      if (Object.keys(res).length > 0) {
        setSelectedMonth(Object.keys(res)[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedMonth && monthlySales[selectedMonth]) {
      const totalSales = monthlySales[selectedMonth].reduce(
        (sum, item) => sum + item.totalSales,
        0
      );
      const data = monthlySales[selectedMonth].map((item) => ({
        name: item.productName,
        value: Number(((item.totalSales / totalSales) * 100).toFixed(2)), // 비율 계산
      }));
      setChartData(data);
    }
  }, [selectedMonth, monthlySales]);

  return (
    <div className="chart-container">
      <div className="select-container">
        <select
          onChange={(e) => setSelectedMonth(e.target.value)}
          value={selectedMonth}
        >
          {Object.keys(monthlySales).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="pie-chart-wrapper">
        <div className="recharts-legend">
          <CustomActiveShapePieChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyProductSalesPieChart;
