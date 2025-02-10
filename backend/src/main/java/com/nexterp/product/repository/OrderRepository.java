package com.nexterp.product.repository;

import com.nexterp.client.entity.RequestStatus;
import com.nexterp.product.entity.Order;

import com.nexterp.product.entity.OrderType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Client ID로 Order 검색
    Page<Order> findByClient_ClientCode(String clientCode, Pageable pageable);

    // Employee ID로 Order 검색
    Page<Order> findByEmployeeId(Integer employeeId, Pageable pageable);

    // Product ID로 Order 검색
    Page<Order> findByProductId(Long productId, Pageable pageable);

    Order findByTransactionId(Long transactionId);

    // PENDING 상태가 아닌 거래처만 조회
    @Query("SELECT o FROM Order o WHERE o.requestStatus = 'APPROVED'")
    Page<Order> findApprovedOrders(Pageable pageable);

    // PENDING 상태의 거래처만 조회
    @Query("SELECT o FROM Order o WHERE o.requestStatus = 'PENDING'")
    Page<Order> findPendingOrders(Pageable pageable);

    Page<Order> findByRequestStatusAndOrderTypeAndClient_ClientCode(
        RequestStatus requestStatus, OrderType orderType, String clientCode, Pageable pageable);

    // 주문 타입과 승인 상태로 주문 조회
    @Query("SELECT o FROM Order o WHERE o.requestStatus = :status AND o.orderType = :orderType")
    Page<Order> findByOrderTypeAndRequestStatus(@Param("orderType") OrderType orderType,
                                                @Param("status") RequestStatus status,
                                                Pageable pageable);

    // APPROVE 상태값에 SALE 혹은 PURCHASE 필터에 Clientcode로 검색하는 코드
    @Query("SELECT o FROM Order o WHERE o.requestStatus = 'APPROVED' AND o.orderType = :orderType AND o.client.clientCode LIKE %:clientCode%")
    Page<Order> findApprovedOrdersByTypeAndClientCode(@Param("clientCode") String clientCode, @Param("orderType") OrderType orderType, Pageable pageable);
}
