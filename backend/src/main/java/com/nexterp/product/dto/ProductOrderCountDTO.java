package com.nexterp.product.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.product.dto
 * FileName       : ProductOrderCountDTO
 * Author         : paesir
 * Date           : 25. 2. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 2. 21.오전 11:51  paesir      최초 생성
 */

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductOrderCountDTO {
    private String productName;
    private Long totalOrders;
}
