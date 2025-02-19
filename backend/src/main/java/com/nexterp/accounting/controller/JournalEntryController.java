package com.nexterp.accounting.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.controller
 * FileName       : JournalEntryController
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오후 12:50  paesir      최초 생성
 */

import com.nexterp.accounting.dto.JournalEntryDTO;
import com.nexterp.accounting.dto.MonthlyProfitDTO;
import com.nexterp.accounting.dto.MonthlyCashFlowDTO;
import com.nexterp.accounting.dto.WeeklyProfitDTO;
import com.nexterp.accounting.repository.JournalEntryRepository;
import com.nexterp.accounting.service.JournalEntryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/journal-entries")
public class JournalEntryController {
  private final JournalEntryService journalEntryService;
  private final JournalEntryRepository journalEntryRepository;
  public JournalEntryController(JournalEntryService journalEntryService,
                                JournalEntryRepository journalEntryRepository) {
    this.journalEntryService = journalEntryService;
    this.journalEntryRepository = journalEntryRepository;
  }

  @GetMapping
  public Page<JournalEntryDTO> getAllJournalEntries(Pageable pageable) {
    return journalEntryService.getAllJournalEntries(pageable);
  }

  @GetMapping("/date-range")
  public Page<JournalEntryDTO> getJournalEntriesByDateRange(
      @RequestParam LocalDate startDate,
      @RequestParam LocalDate endDate,
      Pageable pageable
      ){
    return journalEntryService.getJournalEntriesByDateRange(startDate, endDate, pageable);
  }

  @PostMapping
  public JournalEntryDTO createJournalEntry(@RequestBody JournalEntryDTO journalEntryDTO) {
    return journalEntryService.createJournalEntry(journalEntryDTO);
  }

  @PutMapping("/{id}")
  public JournalEntryDTO updateJournalEntry(@PathVariable Long id, @RequestBody JournalEntryDTO journalEntryDTO) {
    return journalEntryService.updateJournalEntry(id, journalEntryDTO);
  }

  @DeleteMapping("/{id}")
  public void deleteJournalEntry(@PathVariable Long id) {
    journalEntryService.deleteJournalEntry(id);
  }

  @GetMapping("/cashflow/monthly")
  public ResponseEntity<List<MonthlyCashFlowDTO>> getMonthlyCashFlow() {
    List<MonthlyCashFlowDTO> cashFlowData = journalEntryRepository.getMonthlyCashFlow();
    return ResponseEntity.ok(cashFlowData);
  }

  @GetMapping("/profit/weekly")
  public ResponseEntity<List<WeeklyProfitDTO>> getWeeklyProfit() {
    List<WeeklyProfitDTO> profitData = journalEntryRepository.getWeeklyProfit();
    return ResponseEntity.ok(profitData);
  }

  @GetMapping("profit/monthly")
  public ResponseEntity<List<MonthlyProfitDTO>> getMonthlyProfit() {
    List<MonthlyProfitDTO> data = journalEntryRepository.getMonthlyProfit();
    return ResponseEntity.ok(data);
  }
}
