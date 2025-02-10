package com.nexterp.product.controller;

/*
 * Description    : 주문 컨트롤러 api
 * PackageName    : com.nexterp.product.controller
 * FileName       : OrderController.java
 * Author         : paesir
 * Date           : 25. 2. 9.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 9.오전 2:49  paesir      최초 생성
 */


import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.product.dto.OrderDTO;
import com.nexterp.product.service.OrderService;
import com.nexterp.product.service.PurchaseService;
import com.nexterp.product.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;
  private final PurchaseService purchaseService;
  private final SaleService saleService;

  // Client ID로 주문 조회
  @GetMapping("/client/{clientCode}")
  public ResponseEntity<Page<OrderDTO>> getOrdersByClientCode(@PathVariable String clientCode,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<OrderDTO> orders = orderService.getOrdersByClientCode(clientCode, pageable);
    return ResponseEntity.ok(orders);
  }

  // Employee ID로 주문 조회
  @GetMapping("/employee/{employeeId}")
  public ResponseEntity<Page<OrderDTO>> getOrdersByEmployeeId(@PathVariable Integer employeeId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<OrderDTO> orders = orderService.getOrdersByEmployeeId(employeeId, pageable);
    return ResponseEntity.ok(orders);
  }

  // Product ID로 주문 조회
  @GetMapping("/product/{productId}")
  public ResponseEntity<Page<OrderDTO>> getOrdersByProductId(@PathVariable Long productId,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<OrderDTO> orders = orderService.getOrdersByProductId(productId, pageable);
    return ResponseEntity.ok(orders);
  }

  // 승인된 주문 조회
  @GetMapping("/approved")
  public ResponseEntity<Page<OrderDTO>> getApprovedOrders(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(orderService.getApprovedOrders(pageable));
  }

  // 보류 중인 주문 조회
  @GetMapping("/pending")
  public ResponseEntity<Page<OrderDTO>> getPendingOrders(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(orderService.getPendingOrders(pageable));
  }

  // 구매 처리 (초기 승인 요청)
  @PostMapping("/purchase/pending")
  public ResponseEntity<String> processPurchase(@RequestParam Long productId,
                                                @RequestParam int quantity,
                                                @RequestParam BigDecimal price,
                                                @RequestParam String clientCode,
                                                @RequestParam String paymentAccountId,
                                                @RequestBody Employee employee,
                                                @RequestParam(required = false) String memo) {
    purchaseService.processPurchase(productId, quantity, price, clientCode, paymentAccountId, employee, RequestStatus.PENDING, memo);
    return ResponseEntity.ok("Purchase processed successfully.");
  }

  // 판매 처리 (초기 승인 요청)
  @PostMapping("/sale/pending")
  public ResponseEntity<String> processSale(@RequestParam Long productId,
                                            @RequestParam int quantity,
                                            @RequestParam BigDecimal salePrice,
                                            @RequestParam String clientCode,
                                            @RequestParam String paymentAccountId,
                                            @RequestBody Employee employee,
                                            @RequestParam(required = false) String memo) {
    saleService.processSale(productId, quantity, salePrice, clientCode, paymentAccountId, employee, RequestStatus.PENDING, memo);
    return ResponseEntity.ok("Sale processed successfully.");
  }

  // 판매 주문 승인 (승인된 주문 반환)
  @PutMapping("/sale/approve/{transactionId}")
  public ResponseEntity<String> approveSaleOrder(@PathVariable Long transactionId) {
    saleService.approveSale(transactionId);
    return ResponseEntity.ok("Sale approved successfully.");
  }

  // 구매 주문 승인 (승인된 주문 반환)
  @PutMapping("/purchase/approve/{transactionId}")
  public ResponseEntity<String> approvePurchaseOrder(@PathVariable Long transactionId) {
    purchaseService.approvePurchase(transactionId);
    return ResponseEntity.ok("Purchase approved successfully.");
  }

  // 판매 주문 반려 (거래 삭제)
  @DeleteMapping("/sale/reject/{transactionId}")
  public ResponseEntity<String> rejectSaleOrder(@PathVariable Long transactionId) {
    saleService.rejectSale(transactionId);
    return ResponseEntity.ok("Order rejected and deleted successfully.");
  }

  // 구매 주문 반려 (거래 삭제)
  @DeleteMapping("/purchase/reject/{transactionId}")
  public ResponseEntity<String> rejectPurchaseOrder(@PathVariable Long transactionId) {
    purchaseService.rejectPurchase(transactionId);
    return ResponseEntity.ok("Order rejected and deleted successfully.");
  }

  // 판매 제품 반품
  @DeleteMapping("/sale/refund/{transactionId}")
  public ResponseEntity<String> refundSaleOrder(@PathVariable Long transactionId) {
    saleService.refundSale(transactionId);
    return ResponseEntity.ok("Order refunded successfully.");
  }

  // 구매 제품 반품
  @DeleteMapping("/purchase/refund/{transactionId}")
  public ResponseEntity<String> refundPurchaseOrder(@PathVariable Long transactionId) {
    purchaseService.refundPurchase(transactionId);
    return ResponseEntity.ok("Order refunded successfully.");
  }

}