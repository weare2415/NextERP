import React from "react";
import { PieChart, Pie, Cell } from "recharts";

// 📌 게이지 차트 색상 설정 (영업이익률 범위별 색상)
const colorData = [
	{ value: 20, color: "#1bde69" },
	{ value: 20, color: "#6aeb83" },
	{ value: 20, color: "#ede65a" },
	{ value: 20, color: "#f5e907" },
	{ value: 10, color: "#cc6c6f" },
	{ value: 10, color: "#ab090e" }
];

const GaugeChart = ({ avgProfitRate }) => {
	const width = 300; // 차트 크기
	const totalValue = colorData.reduce((acc, cur) => acc + cur.value, 0);

	// 📌 현재 영업이익률이 속한 색상 구간 찾기
	const activeSectorIndex = colorData
			.map((cur, index, arr) => {
				const curMax = [...arr]
						.splice(0, index + 1)
						.reduce((a, b) => ({ value: a.value + b.value })).value;
				return avgProfitRate > curMax - cur.value && avgProfitRate <= curMax;
			})
			.findIndex((cur) => cur);

	// 📌 PieChart의 각도 및 위치 설정
	const pieProps = {
		startAngle: 180,
		endAngle: 0,
		cx: width / 2,
		cy: width / 2
	};

	const pieRadius = {
		innerRadius: "70%",
		outerRadius: "90%"
	};

	// 📌 화살표(포인터) 위치 계산
	const getPointerPosition = (profitRate) => {
		const angle = ((profitRate / 100) * 180) - 90; // 0~100%를 180도(반원)로 변환
		const radius = 80; // 원 반지름
		const radian = (angle * Math.PI) / 180;
		return {
			x: width / 2 + radius * Math.cos(radian), // X 좌표
			y: width / 2 + radius * Math.sin(radian)  // Y 좌표
		};
	};

	const pointerPos = getPointerPosition(avgProfitRate);

	return (
			<div style={{ textAlign: "center", position: "relative", width: "100%", height: "250px" }}>
				<PieChart width={width} height={width / 2 + 30}>
					{/* 왼쪽 최저값 (0%) */}
					<text x={80} y={190} textAnchor="middle" fontSize="14px">0%</text>
					{/* 오른쪽 최고값 (100%) */}
					<text x={220} y={190} textAnchor="middle" fontSize="14px">100%</text>

					{/* 게이지 바 (반원) */}
					<Pie
							activeIndex={activeSectorIndex}
							innerRadius={pieRadius.innerRadius}
							outerRadius={pieRadius.outerRadius}
							data={colorData}
							fill="#8884d8"
							{...pieProps}
					>
						{colorData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={colorData[index].color} />
						))}
					</Pie>
				</PieChart>

				{/* 📌 화살표 (SVG 직접 추가) */}
				<svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
					<polygon
							points="0,-10 10,0 0,10 -10,0"
							fill="red"
							transform={`translate(${pointerPos.x}, ${pointerPos.y}) rotate(${avgProfitRate * 1.8 - 90})`}
					/>
					{/* 현재 영업이익률 표시 */}
					<text x={pointerPos.x} y={pointerPos.y - 10} textAnchor="middle" fontSize="14px" fontWeight="bold">
						{avgProfitRate.toFixed(1)}%
					</text>
				</svg>
			</div>
	);
};

export default GaugeChart;