package com.nexterp.accounting.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.dto
 * FileName       : MonthlyCashFlowAndProfit
 * Author         : paesir
 * Date           : 25. 2. 19.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 19.오전 11:54  paesir      최초 생성
 */


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyProfitDTO {
  //  journalEntry repository && controller 에 구성
  private String month;
  private BigDecimal operatingProfit;
}

