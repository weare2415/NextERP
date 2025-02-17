package com.nexterp.product.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.service
 * FileName       : SaleService
 * Author         : paesir
 * Date           : 25. 2. 7.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 7.오후 12:41  paesir      최초 생성
 */


import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface SaleService {
  void processSale(Long productId, int quantity, BigDecimal salePrice, String clientCode, String paymentAccountId, Employee employee, RequestStatus requestStatus, LocalDate saleDate, String memo);
  void approveSale(Long transactionId);
  void rejectSale(Long transactionId);
  void refundSale(Long transactionId);
}
