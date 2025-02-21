import React, { useEffect, useState } from 'react';
import { getOrderCount } from '../../../sales/order/api/orderApi';
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';


const CustomTreemapContent = (props) => {
	const { root, depth, x, y, width, height, index, name, size } = props;

	if (!size) return null; // 값이 없으면 렌더링하지 않음

	const minSize = root.children.reduce((min, item) => Math.min(min, item.size), Infinity);
	const maxSize = root.children.reduce((max, item) => Math.max(max, item.size), -Infinity);

	// ✅ 크기 비율에 따른 투명도 설정 (최소 0.3, 최대 1)
	const opacity = minSize === maxSize ? 1 : 0.3 + (0.7 * (size - minSize)) / (maxSize - minSize);

	return (
			<g>
				<rect x={x} y={y} width={width} height={height} fill="#3c485a" fillOpacity={opacity} stroke="#fff" />
				{width > 50 && height > 20 && (
						<text x={x + width / 2} y={y + height / 2} textAnchor="middle" fontSize="12px" fill="white">
							{name}
						</text>
				)}
			</g>
	);
};

const OrderTreeMap = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getOrderCount();

				const transformedChildren = response.map((item, index) => ({
					name: item.productName,
					size: item.totalOrders,
					id: `node-${index}`,
				}));

				setData([{ name: 'Orders', children: transformedChildren }]);
			} catch (err) {
				console.error('데이터 로딩 실패:', err);
			}
		};

		fetchData();
	}, []);

	return (
			<div>
				<ResponsiveContainer height={400}>
					<Treemap
							data={data}
							dataKey="size"
							nameKey="name"
							aspectRatio={4 / 3}
							stroke="#fff"
							content={<CustomTreemapContent />}
					>
						<Tooltip />
					</Treemap>
				</ResponsiveContainer>
			</div>
	);
};

export default OrderTreeMap;