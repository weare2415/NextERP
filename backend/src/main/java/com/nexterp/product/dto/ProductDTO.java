package com.nexterp.product.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;               // 제품 번호 (제품 ID)
    private String productName;    // 제품명
    private BigDecimal purchasePrice;      // 구매 가격
    private BigDecimal salePrice;         // 판매 가격
    private LocalDate createdDate;      // 제품 등록 일자
    private int stock;             // 재고 (남은 수량)
    private String specifications; // 제품 규격
    private String memo;           // 메모
    private boolean isDeleted;     // 논리적 삭제 여부
    private Integer employeeId;    // 담당 직원 ID (사원 ID)
}
