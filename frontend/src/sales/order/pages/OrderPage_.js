import React, { useEffect, useState } from "react";
import { fetchApprovedOrders } from "../api/orderApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import "./scss/OrderPage.scss";
import ListApprovedOrder from "../components/ListApprovedOrder";
import SearchApprovedOrder from "../components/SearchApprovedOrder";
import Pagination from '../../../common/component/Pagination';

const OrderPage_ = () => {
	const [orders, setOrders] = useState([]);
	const [searchResults, setSearchResults] = useState(null);
	const [activeTab, setActiveTab] = useState("전체");
	const [resetSearchTerm, setResetSearchTerm] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [size] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	// 초기 데이터 로딩
	useEffect(() => {
		fetchApprovedOrder(page);
	}, [page]);

	// 전체 거래처 목록을 가져오는 함수
	const fetchApprovedOrder = async (page) => {
		try {
			const data = await fetchApprovedOrders(page, size);
			setOrders(data.content);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.error("Error fetching clients:", error);
		}
	};

	const handleSearchResults = (results) => {
		setSearchResults(results);
	};

	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setResetSearchTerm(true);
		setSearchResults(null);
		setDropdownOpen(false);
	};

	return (
			<BasicLayout>
				<div className="order-page-container">
					<div className="page-header">
						<h1>주문 내역 조회</h1>
						<div className="header-controls">
							<SearchApprovedOrder
									onSearchResults={handleSearchResults}
									resetSearchTerm={resetSearchTerm}
									setResetSearchTerm={setResetSearchTerm}
									selectedTab={activeTab}
									className="order-search"
							/>
							<div className="dropdown">
								<button
										className="dropdown-button"
										onClick={() => setDropdownOpen(!dropdownOpen)}
								>
									{activeTab}
								</button>
								{dropdownOpen && (
										<ul className="dropdown-menu">
											<li onClick={() => handleTabClick("전체")}>전체</li>
											<li onClick={() => handleTabClick("판매")}>판매</li>
											<li onClick={() => handleTabClick("구매")}>구매</li>
										</ul>
								)}
							</div>
						</div>
					</div>
					<ListApprovedOrder
							orders={searchResults || orders}
							activeTab={activeTab}
							className="list-order"
					/>
					{!searchResults && totalPages > 1 && (
							<Pagination
									currentPage={page}
									totalPages={totalPages}
									onPageChange={setPage}
							/>
					)}
				</div>
			</BasicLayout>
	);
};

export default OrderPage_;
