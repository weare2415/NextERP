package com.nexterp.accounting.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.dto
 * FileName       : MonthlyProductSalesDTO
 * Author         : paesir
 * Date           : 25. 2. 18.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 18.오후 12:57  paesir      최초 생성
 */

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyProductSalesDTO {
//  transaction Repository && Controller 에 구성
  private String month;
  private Long productId;
  private String productName;
  private int totalSales;
}
