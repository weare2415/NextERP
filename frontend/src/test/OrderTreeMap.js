import React, { useEffect, useState } from 'react';
import { getOrderCount } from '../sales/order/api/orderApi';
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';

const OrderTreeMap = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getOrderCount();


				const transformedData = [
					{
						name: 'Orders', // 루트 노드
						children: response.map((item, index) => ({
							name: item.productName,
							size: item.totalOrders,
							id: `node-${index}`
						})),
					},
				];

				setData(transformedData);
				console.log(transformedData);
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
							fill="#3c485a"
					>
						<Tooltip />
					</Treemap>
				</ResponsiveContainer>
			</div>
	);
};

export default OrderTreeMap;