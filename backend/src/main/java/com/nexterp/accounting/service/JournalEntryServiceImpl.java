package com.nexterp.accounting.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.service
 * FileName       : JournalEntryServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오후 12:47  paesir      최초 생성
 */


import com.nexterp.accounting.dto.JournalEntryDTO;
import com.nexterp.accounting.entity.Account;
import com.nexterp.accounting.entity.JournalEntry;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.repository.AccountRepository;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class JournalEntryServiceImpl implements JournalEntryService {

  private final JournalEntryRepository journalEntryRepository;
  private final AccountRepository accountRepository;
  private final AccountService accountService;
  private final TransactionRepository transactionRepository;

  @Override
  public Page<JournalEntryDTO> getAllJournalEntries(Pageable pageable) {
    return journalEntryRepository.findAll(pageable).map(this::entityToDto);
  }

  @Override
  public Page<JournalEntryDTO> getJournalEntriesByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
    return journalEntryRepository.findByDateBetween(startDate, endDate, pageable).map(this::entityToDto);
  }

  @Override
  public JournalEntryDTO createJournalEntry(JournalEntryDTO journalEntryDTO) {
    JournalEntry journalEntry = dtoToEntity(journalEntryDTO);

    // amount 설정
    if (journalEntry.getDebit().compareTo(BigDecimal.ZERO) > 0) {
      journalEntry.setAmount(journalEntry.getDebit());
    } else if (journalEntry.getCredit().compareTo(BigDecimal.ZERO) > 0) {
      journalEntry.setAmount(journalEntry.getCredit().negate());
    } else {
      throw new IllegalArgumentException("Both debit and credit cannot be zero.");
    }

    JournalEntry savedJournalEntry = journalEntryRepository.save(journalEntry);

    // DTO로 변환하며 amount 설정
    JournalEntryDTO resultDto = entityToDto(savedJournalEntry);
    resultDto.setAmount(savedJournalEntry.getAmount());

    return entityToDto(savedJournalEntry);
  }

  @Override
  public JournalEntryDTO updateJournalEntry(Long id, JournalEntryDTO journalEntryDTO) {
    JournalEntry existingEntry = journalEntryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Journal Entry not found: " + id));

    Account account = accountRepository.findById(journalEntryDTO.getAccountCode())
        .orElseThrow(() -> new IllegalArgumentException("Invalid account code: " + journalEntryDTO.getAccountCode()));

    existingEntry.setDate(journalEntryDTO.getDate());
    existingEntry.setAccount(account);
    existingEntry.setDebit(journalEntryDTO.getDebit());
    existingEntry.setCredit(journalEntryDTO.getCredit());
    existingEntry.setDescription(journalEntryDTO.getDescription());

    JournalEntry updatedEntry = journalEntryRepository.save(existingEntry);
    return entityToDto(updatedEntry);
  }

  @Override
  public void deleteJournalEntry(Long id) {
    JournalEntry entry = journalEntryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Journal Entry not found: " + id));

    // 잔액 복구 (삭제 시)
    if (entry.getDebit().compareTo(BigDecimal.ZERO) > 0) {
      accountService.updateBalance(entry.getAccount().getCode(), entry.getDebit().negate());
    } else if (entry.getCredit().compareTo(BigDecimal.ZERO) > 0) {
      accountService.updateBalance(entry.getAccount().getCode(), entry.getCredit());
    }

    journalEntryRepository.delete(entry);
  }

  private JournalEntryDTO entityToDto(JournalEntry journalEntry) {
    return JournalEntryDTO.builder()
        .id(journalEntry.getId())
        .date(journalEntry.getDate())
        .accountCode(journalEntry.getAccount().getCode())
        .accountName(journalEntry.getAccount().getName())
        .debit(journalEntry.getDebit())
        .credit(journalEntry.getCredit())
        .description(journalEntry.getDescription())
        .amount(journalEntry.getAmount())
        .transactionId(journalEntry.getTransaction().getId())  // ✅ 트랜잭션 ID 포함
        .build();
  }

  private JournalEntry dtoToEntity(JournalEntryDTO journalEntryDTO) {
    Account account = accountRepository.findById(journalEntryDTO.getAccountCode())
        .orElseThrow(() -> new IllegalArgumentException("Invalid account code: " + journalEntryDTO.getAccountCode()));

    JournalEntry journalEntry = new JournalEntry();
    journalEntry.setId(journalEntryDTO.getId());
    journalEntry.setDate(journalEntryDTO.getDate());
    journalEntry.setAccount(account);
    journalEntry.setDebit(journalEntryDTO.getDebit());
    journalEntry.setCredit(journalEntryDTO.getCredit());
    journalEntry.setDescription(journalEntryDTO.getDescription());

    if (journalEntryDTO.getTransactionId() != null) {
      Transaction transaction = transactionRepository.findById(journalEntryDTO.getTransactionId())
          .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + journalEntryDTO.getTransactionId()));
      journalEntry.setTransaction(transaction);
    }

    // amount 설정
    if (journalEntryDTO.getDebit().compareTo(BigDecimal.ZERO) > 0) {
      journalEntry.setAmount(journalEntryDTO.getDebit());
    } else if (journalEntryDTO.getCredit().compareTo(BigDecimal.ZERO) > 0) {
      journalEntry.setAmount(journalEntryDTO.getCredit().negate());
    } else {
      throw new IllegalArgumentException("Both debit and credit cannot be zero.");
    }

    return journalEntry;
  }
}