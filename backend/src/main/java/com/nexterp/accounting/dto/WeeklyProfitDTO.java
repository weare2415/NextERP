package com.nexterp.accounting.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.dto
 * FileName       : WeeklyProfitDTO
 * Author         : paesir
 * Date           : 25. 2. 18.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 18.오후 7:24  paesir      최초 생성
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
public class WeeklyProfitDTO {
    String week;
    BigDecimal operatingProfit;
}
