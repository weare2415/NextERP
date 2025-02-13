import React, {useEffect, useState} from 'react';
import BasicLayout from '../../../common/pages/BasicLayout';
import {fetchApprovedOrders} from '../api/orderApi';
import ListApprovedOrder from '../components/ListApprovedOrder';
import Pagination from '../../../common/component/Pagination';

const ApprovedOrderPage = () => {
	const [orders, setOrders] = useState([]);
	const [searchResults, setSearchResults] = useState(null);
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		fetchOrder(page)
	},[page])

	const fetchOrder = async (page) => {
		try{
			const response = await fetchApprovedOrders(page,size);
			setOrders(response.content);
			setTotalPages(response.totalPages);
			// console.log(response.content);
		}catch(error){
			console.log(error);
		}
	}

	return (
			<BasicLayout>
				<div className="order-page-container">
					<div className="page-header">
						<h1>주문 내역</h1>
						<div>검색창</div>
						<div>날짜 선택해서 해당 기간의 주문 조회</div>
					</div>
					<div className="list-orders">
						<ListApprovedOrder
							orders={orders} />
						{!searchResults && totalPages > 1 && (
								<Pagination
										currentPage={page}
										totalPages={totalPages}
										onPageChange={setPage}
								/>
								)}
					</div>
				</div>
			</BasicLayout>
	);
};

export default ApprovedOrderPage;