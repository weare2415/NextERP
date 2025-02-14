import React, { useEffect, useState } from "react";
import BasicLayout from "../../../common/pages/BasicLayout";
import { fetchApprovedOrders } from "../api/orderApi";
import { getAllTransactionsList } from "../../../accounting/api/transactionApi"; // ✅ 새로운 API 사용
import ListApprovedOrder from "../components/ListApprovedOrder";
import Pagination from "../../../common/component/Pagination";
import { getClientById } from "../../client/api/clientApi";
import { getProductById } from "../../product/api/productApi";
import SearchApprovedOrder from "../components/SearchApprovedOrder";

const ApprovedOrderPage = () => {
	const [orders, setOrders] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [mergedOrders, setMergedOrders] = useState([]);
	const [clientNames, setClientNames] = useState({});
	const [productNames, setProductNames] = useState({});
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [isSearching, setIsSearching] = useState(false);

	// 트랜잭션 전체 리스트 가져오기 (한 번만 실행)
	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = async () => {
		try {
			const response = await getAllTransactionsList();
			setTransactions(response);
		} catch (error) {
			console.log(error);
		}
	};

	// 주문 데이터 가져오기
	useEffect(() => {
		if (!isSearching) {
			fetchOrders(page);
		}
	}, [page]);

	const fetchOrders = async (page) => {
		try {
			const response = await fetchApprovedOrders(page, size);
			setOrders(response.content);
			setTotalPages(response.totalPages);
		} catch (error) {
			console.log(error);
		}
	};

	// 주문과 트랜잭션 매핑
	useEffect(() => {
		if (orders.length > 0 && transactions.length > 0) {
			const merged = orders.map((order) => {
				const transaction = transactions.find((t) => t.id === order.transactionId);
				return {
					...order,
					transactionDetails: transaction || null,
				};
			});
			setMergedOrders(merged);
		}
	}, [orders, transactions]);

	// 거래처 및 제품명 가져오기
	useEffect(() => {
		if (mergedOrders.length === 0) return;

		const fetchNames = async () => {
			const clientCodes = [...new Set(mergedOrders.map((order) => order.clientCode))].filter(Boolean);
			const productIds = [...new Set(mergedOrders.map((order) => order.productId))].filter(Boolean);

			const clientData = {};
			await Promise.all(
					clientCodes.map(async (code) => {
						try {
							const clientInfo = await getClientById(code);
							if (clientInfo?.content?.length > 0) {
								clientData[code] = clientInfo.content[0].clientName;
							} else {
								clientData[code] = "알 수 없음";
							}
						} catch (error) {
							console.error(`Error fetching client with Code ${code}:`, error);
							clientData[code] = "알 수 없음";
						}
					})
			);
			setClientNames(clientData);

			const productData = {};
			await Promise.all(
					productIds.map(async (id) => {
						try {
							const productInfo = await getProductById(id);
							productData[id] = productInfo.productName;
						} catch (error) {
							console.error(`Error fetching product with ID ${id}:`, error);
							productData[id] = "알 수 없음";
						}
					})
			);
			setProductNames(productData);
		};

		fetchNames();
	}, [mergedOrders]);

	// 검색 결과 업데이트 (검색 시 페이지 0으로 초기화)
	const handleSearchResults = (searchResults, totalPages, currentPage = 0) => {
		setOrders(searchResults);
		setTotalPages(totalPages);
		setPage(currentPage);
		setIsSearching(true);
	};

	// 페이지 변경 핸들러
	const handlePageChange = (newPage) => {
		setPage(newPage);
		if (isSearching) {
			fetchOrders(newPage);
		} else {
			fetchOrders(newPage);
		}
	};

	return (
			<BasicLayout>
				<div className="order-page-container">
					<div className="page-header">
						<h1>주문 내역</h1>
						<SearchApprovedOrder onSearchResults={handleSearchResults} />
					</div>
					<div className="list-orders">
						<ListApprovedOrder mergedOrders={mergedOrders} clientNames={clientNames} productNames={productNames} />
						{totalPages > 1 && (
								<Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
						)}
					</div>
				</div>
			</BasicLayout>
	);
};

export default ApprovedOrderPage;