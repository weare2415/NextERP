package com.nexterp.accounting.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.controller
 * FileName       : TransactionController
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오후 2:52  paesir      최초 생성
 */

import com.nexterp.accounting.dto.TransactionDTO;
import com.nexterp.accounting.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
  private final TransactionService transactionService;

  public TransactionController(TransactionService transactionService) {
    this.transactionService = transactionService;
  }

  // 거래 목록 조회 (페이지네이션 지원)
  @GetMapping
  public Page<TransactionDTO> getAllTransactions(
      @RequestParam(defaultValue = "0") int page,    // 기본 페이지 번호
      @RequestParam(defaultValue = "10") int size    // 기본 페이지 크기
  ) {
    Pageable pageable = PageRequest.of(page, size);
    return transactionService.getAllTransactions(pageable);
  }

  // 거래 목록 조회 (리스트)
  @GetMapping("/list")
  public List<TransactionDTO> getAllTransactionsList() {
    return transactionService.getAllTransactionsList();
  }

  // 특정 거래 조회
  @GetMapping("/{id}")
  public TransactionDTO getTransactionById(@PathVariable Long id) {
    return transactionService.getTransactionById(id);
  }

  // 특정 기간 조회
  @GetMapping("/search/date")
  public Page<TransactionDTO> getTransactionsByDateBetween(
      @RequestParam("startDate") String startDateStr,
      @RequestParam("endDate") String endDateStr,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    LocalDate startDate = LocalDate.parse(startDateStr);
    LocalDateTime startDateTime = startDate.atStartOfDay();
    LocalDate endDate = LocalDate.parse(endDateStr);
    LocalDateTime endDateTime = endDate.atStartOfDay();
    Pageable pageable = PageRequest.of(page, size);
    return transactionService.getTransactionsByDateBetween(startDateTime, endDateTime, pageable);
  }

  // 거래 생성
  @PostMapping
  public TransactionDTO createTransaction(@RequestBody TransactionDTO transactionDTO) {
    return transactionService.createTransaction(transactionDTO);
  }

  // 거래 수정
  @PutMapping("/{id}")
  public TransactionDTO updateTransaction(
      @PathVariable Long id,
      @RequestBody TransactionDTO transactionDTO
  ) {
    return transactionService.updateTransaction(id, transactionDTO);
  }

  // 거래 삭제
  @DeleteMapping("/{id}")
  public void deleteTransaction(@PathVariable Long id) {
    transactionService.deleteTransaction(id);
  }

}
