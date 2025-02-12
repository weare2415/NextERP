import React, { useEffect, useState } from "react";
import "../../order/components/scss/ListOrder.scss";
import { getEmployeeById } from "../../member/api/memberApi";
import { getClientById } from "../../client/api/clientApi";
import { getProductById } from "../../product/api/productApi";
import {
  fetchOrdersByClientCode,
  fetchOrdersByEmployeeId,
} from "../api/orderApi";

const ListOrder = ({ orders, activeTab }) => {
  const [employeeNames, setEmployeeNames] = useState({});
  const [clientNames, setClientNames] = useState({});
  const [productNames, setProductNames] = useState({});
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [resetSearchTerm, setResetSearchTerm] = useState(false);
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    const fetchNames = async () => {
      const employeeIds = [...new Set(orders.map((order) => order.employeeId))];
      const clientCodes = [...new Set(orders.map((order) => order.clientCode))];
      const productIds = [...new Set(orders.map((order) => order.productId))];

      const employeeData = {};
      await Promise.all(
        employeeIds.map(async (id) => {
          try {
            const employeeInfo = await getEmployeeById(id);
            employeeData[id] = employeeInfo.name;
          } catch (error) {
            console.error(`Error fetching employee with ID ${id}:`, error);
            employeeData[id] = "알 수 없음";
          }
        })
      );
      setEmployeeNames(employeeData);

      const clientData = {};
      await Promise.all(
        clientCodes.map(async (code) => {
          try {
            const clientInfo = await getClientById(code);
            clientData[code] = clientInfo.clientName;
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

    if (orders && orders.length > 0) {
      fetchNames();
    }
  }, [orders]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setSearchResults(null); // 탭을 변경할 때마다 검색 결과를 초기화
    setResetSearchTerm(true); // 검색어 초기화
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevState) => {
      if (prevState.includes(orderId)) {
        return prevState.filter((id) => id !== orderId); // 이미 선택된 주문이면 제외
      } else {
        return [...prevState, orderId]; // 새로운 주문을 선택
      }
    });
  };

  const handleSearchResults = async (results) => {
    if (results.length > 0) {
      if (results[0].clientCode) {
        try {
          const ordersByClient = await fetchOrdersByClientCode(
            results[0].clientCode
          );
          setSearchResults(ordersByClient);
        } catch (error) {
          console.error("Error fetching orders by clientCode:", error);
          setSearchResults([]);
        }
      } else if (results[0].id) {
        try {
          const ordersByEmployee = await fetchOrdersByEmployeeId(results[0].id);
          setSearchResults(ordersByEmployee);
        } catch (error) {
          console.error("Error fetching orders by employee ID:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults(results);
      }
    } else {
      setSearchResults(null);
    }
  };

  const getOrderTypeDescription = (orderType) => {
    const orderTypeMap = {
      SALE: "판매",
      PURCHASE: "구매",
    };
    return orderTypeMap[orderType] || "알 수 없음";
  };

  // 전체 주문을 필터링
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "ALL") return true;
    return order.orderType === selectedTab;
  });

  console.log("필터링된 주문:", filteredOrders);
  console.log("검색 결과 상태:", searchResults);

  const handlePrintOrder = (orderId) => {
    console.log(`주문 ID ${orderId} 출력`);
    // 여기에 출력 로직 추가 (예: PDF 생성, 프린터로 출력 등)
  };

  return (
    <div className="order-list-container">
      <div className="order-header"></div>
      <div className="order-list">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(
                        filteredOrders.map((order) => order.id)
                      );
                    } else {
                      setSelectedOrders([]);
                    }
                  }}
                  checked={
                    filteredOrders.length > 0 &&
                    selectedOrders.length === filteredOrders.length
                  }
                />
              </th>
              <th>거래 ID</th>
              <th>거래처명</th>
              <th>주문 담당자</th>
              <th>주문 제품명</th>
              <th>주문 수량</th>
              <th>
                {selectedTab === "ALL"
                  ? "주문 타입"
                  : selectedTab === "SALE"
                  ? "주문서 출력"
                  : "발주서 출력"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleCheckboxChange(order.id)}
                    />
                  </td>
                  <td>{order.transactionId}</td>
                  <td>{clientNames[order.clientCode] || "Loading..."}</td>
                  <td>{employeeNames[order.employeeId] || "Loading..."}</td>
                  <td>{productNames[order.productId] || "Loading..."}</td>
                  <td>{order.orderCount}</td>
                  <td>
                    {selectedTab === "ALL" ? (
                      getOrderTypeDescription(order.orderType)
                    ) : (
                      <button onClick={() => handlePrintOrder(order.id)}>
                        {selectedTab === "SALE" ? "주문서 출력" : "발주서 출력"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  주문 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListOrder;
