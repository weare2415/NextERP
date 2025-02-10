package com.nexterp.product.entity;

public enum OrderType {
    SALE("판매"),        // 판매
    PURCHASE("구매");   // 구매

    private final String description; // 설명 필드

    OrderType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
