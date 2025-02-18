package com.nexterp.product.service;

import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.repository.*;
import com.nexterp.accounting.service.AccountService;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.product.dto.OrderDTO;
import com.nexterp.product.entity.Order;
import com.nexterp.product.entity.Product;
import com.nexterp.product.repository.OrderRepository;
import com.nexterp.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Log4j2
@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final VATRepository vatRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final AccountService accountService;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Transaction transaction = transactionRepository.findById(orderDTO.getTransactionId())
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        Product product = productRepository.findById(orderDTO.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        Client client = clientRepository.findByClientCode(orderDTO.getClientCode())
            .orElseThrow(() -> new RuntimeException("Client not found"));
        Employee employee = employeeRepository.findById(orderDTO.getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        Order order = toEntity(orderDTO, transaction, product, client, employee);

        return convertToDTO(orderRepository.save(order));
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    // Client Code 기준 주문 목록 조회
    @Override
    public Page<OrderDTO> getOrdersByClientCode(String clientCode, Pageable pageable) {
        Page<Order> orders = orderRepository.findByClient_ClientCode(clientCode, pageable);
        return orders.map(this::convertToDTO);
    }

    // Employee ID 기준 주문 목록 조회
    @Override
    public Page<OrderDTO> getOrdersByEmployeeId(Integer employeeId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByEmployeeId(employeeId, pageable);
        return orders.map(this::convertToDTO);
    }

    // Product ID 기준 주문 목록 조회
    @Override
    public Page<OrderDTO> getOrdersByProductId(Long productId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByProductId(productId, pageable);
        return orders.map(this::convertToDTO);
    }

    // 승인된 주문 목록 조회
    @Override
    public Page<OrderDTO> getApprovedOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findApprovedOrders(pageable);
        return orders.map(this::convertToDTO);
    }

    // 보류 중(Pending) 주문 목록 조회
    @Override
    public Page<OrderDTO> getPendingOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findPendingOrders(pageable);
        return orders.map(this::convertToDTO);
    }

    // Entity를 DTO로 변환
    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
            .id(order.getId())
            .transactionId(order.getTransaction().getId())
            .employeeId(order.getEmployee().getId())
            .clientCode(order.getClient().getClientCode())
            .productId(order.getProduct().getId())
            .orderCount(order.getOrderCount())
            .orderType(order.getOrderType())
            .memo(order.getMemo())
            .build();
    }

    // DTO를 Entity로 변환
    private Order toEntity(OrderDTO orderDTO, Transaction transaction, Product product, Client client, Employee employee) {
        return Order.builder()
            .transaction(transaction)
            .orderType(orderDTO.getOrderType())
            .product(product)
            .orderCount(orderDTO.getOrderCount())
            .client(client)
            .employee(employee)
            .memo(orderDTO.getMemo())
            .requestStatus(RequestStatus.PENDING)
            .build();
    }
}