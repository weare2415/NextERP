import React, {useState} from 'react';
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const ListApprovedOrder = ({orders}) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const employeeName = useEmployeeNames(orders,"employeeId");

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevState) => {
      if (prevState.includes(orderId)) {
        return prevState.filter((id) => id !== orderId); // 이미 선택된 주문이면 제외
      } else {
        return [...prevState, orderId]; // 새로운 주문을 선택
      }
    });
  };

  return (
			<div className="order-list-container">
        <div className="order-list-header">

        </div>
        <div className="order-list">
          <table className="order-list-table">
            <thead>
            <tr>
              <th>
                <input
                type="checkbox"
                onChange={(e) => {
                  if(e.target.checked) {
                    setSelectedOrders(
                        orders.map(order => order.id)
                    );}else {
                    setSelectedOrders([]);
                  }
                }}
                checked={orders.length > 0 &&
                selectedOrders.length === orders.length}
                />
              </th>
              <th>거래 ID</th>
              <th>거래처명</th>
              <th>주문 담당자</th>
              <th>제품명</th>
              <th>주문 수량</th>
              <th>
                주문 타입
                {/*{orders.orderType === "PURCHASE" ? "주문서 출력" : "발주서 출력"}*/}
              </th>
            </tr>
            </thead>
            <tbody>
            {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                    />
                  </td>
                  <td>{order.transactionId}</td>
                  <td>{order.clientCode}</td>
                  <td>{employeeName[order.employeeId]}</td>
                  <td>{order.productId}</td>
                  <td>{order.orderCount}</td>
                  <td>{order.orderType}</td>

                </tr>))
            }
            </tbody>
          </table>
        </div>
        
			</div>
	);
};

export default ListApprovedOrder;