package com.nexterp.product.dto;

import com.nexterp.product.entity.OrderType;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;

@Data
@Setter
@Builder
public class OrderDTO {
    private Long id;
    private Long transactionId;
    private Integer employeeId;
    private String clientCode;
    private Long productId;
    private int orderCount;
    private OrderType orderType;
    private String memo;
}
