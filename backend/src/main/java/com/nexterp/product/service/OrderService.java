package com.nexterp.product.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : OrderService
 * Author         : paesir
 * Date           : 25. 2. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 7.오전 11:11  paesir      최초 생성
 */


import com.nexterp.accounting.entity.Transaction;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.product.dto.OrderDTO;
import com.nexterp.product.entity.OrderType;
import com.nexterp.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface OrderService {
  OrderDTO createOrder(OrderDTO orderDTO);

  OrderDTO getOrderById(Long orderId);

  Page<OrderDTO> getOrdersByClientCode(String clientCode, Pageable pageable);

  Page<OrderDTO> getOrdersByEmployeeId(Integer employeeId, Pageable pageable);

  Page<OrderDTO> getOrdersByProductId(Long productId, Pageable pageable);

  Page<OrderDTO> getApprovedOrders(Pageable pageable);

  Page<OrderDTO> getPendingOrders(Pageable pageable);
}
