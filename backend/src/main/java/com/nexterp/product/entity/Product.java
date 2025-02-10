package com.nexterp.product.entity;

import com.nexterp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false)
    private Long id; // 제품 고유 ID

    @Column(name = "product_name", nullable = false)
    private String productName; // 제품명

    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice; // 매입 원가
    /*
     * 25. 2. 6.오전 9:46  이정현 엔터티 이름 카멜케이스로 수정
     */

    @Column(name = "sale_price", nullable = false)
    private BigDecimal salePrice; // 판매 금액
    /*
     * 25. 2. 6.오전 9:46  이정현 엔터티 이름 카멜케이스로 수정
     */

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDate createdDate;
    /*
     * 25. 2. 6.오후 12:28  이정현    로컬데이트 타입으로 변경
     */

    @Column(nullable = false)
    private int stock; // 재고 수량 (남은 수량)

    @Column(nullable = false)
    private String specifications; // 제품 규격

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id")
    private Employee employee; // 담당자 사원번호 (Employee 테이블 참조)

    private String memo; // 메모

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted; // 논리적 삭제 여부


    public void updateEmployee(Employee employee) {
        this.employee = employee;
    }
    public void markAsDeleted() {
        this.isDeleted = true;
    }
    @PrePersist
    public void prePersist() {
        if (this.createdDate == null) {
            this.createdDate = LocalDate.now();
        }
    }

    public void setStock(int i) {
        this.stock = i;
    }
}