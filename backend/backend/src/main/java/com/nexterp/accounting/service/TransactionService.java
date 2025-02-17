package com.nexterp.accounting.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.service
 * FileName       : TransactionService
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오후 2:44  paesir      최초 생성
 */


import com.nexterp.accounting.dto.TransactionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
  Page<TransactionDTO> getAllTransactions(Pageable pageable);
  List<TransactionDTO> getAllTransactionsList();
  TransactionDTO getTransactionById(Long id);
  Page<TransactionDTO> getTransactionsByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
  TransactionDTO createTransaction(TransactionDTO transactionDTO);
  TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO);
  void deleteTransaction(Long id);
}
