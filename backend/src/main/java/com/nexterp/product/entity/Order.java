package com.nexterp.product.entity;

import com.nexterp.accounting.entity.Transaction;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.employee.entity.Employee;
import com.nexterp.client.entity.Client;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders") // 테이블명
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 주문 ID

    @OneToOne
    @MapsId
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee; // 담당 직원 ID

    @ManyToOne
    @JoinColumn(name = "client_code", referencedColumnName = "client_code", nullable = false) // 외래키 설정
    private Client client; // 거래처 Code

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 제품 ID

    @Column(nullable = false)
    private int orderCount; // 주문 수량

    @Column
    private String memo;    // 주문했을 때 메모

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType; // 주문 타입

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus requestStatus = RequestStatus.PENDING;    // 승인 요청 상태 값

    public void setRequestStatus(RequestStatus requestStatus) {
        this.requestStatus = requestStatus;
    }
}
