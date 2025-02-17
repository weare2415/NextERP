package com.nexterp.product.service;

/*
 * Description    : 구매 서비스 구현
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : PurchaseService
 * Author         : paesir
 * Date           : 25. 2. 9.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 9.오전 2:32  paesir      최초 생성
 */


import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface PurchaseService {
  void processPurchase(Long productId, int quantity, BigDecimal purchasePrice, String clientCode, String paymentAccountId, Employee employee, RequestStatus requestStatus, LocalDate purchaseDate, String memo);
  void approvePurchase(Long transactionId);
  void rejectPurchase(Long transactionId);
  void refundPurchase(Long transactionId);
}
