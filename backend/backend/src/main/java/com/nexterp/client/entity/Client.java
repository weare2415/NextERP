package com.nexterp.client.entity;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.entity
 * FileName       : Client
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:39  paesir      최초 생성
 */


import com.nexterp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "client")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 100, nullable = false)
  private String clientName; // 회사명

  @Column(name = "client_code", length = 50, nullable = false, unique = true)
  private String clientCode; // 회사 코드

  @Column(length = 15)
  private String clientPhone; // 회사 전화번호

  @ManyToOne
  @JoinColumn(name = "employee_id", nullable = false)
  private Employee employee; // 담당자

  @Column(length = 10)
  private String zipCode; // 우편번호

  @Column(length = 200)
  private String clientAddress; // 회사 주소

  @Column(length = 100)
  private String clientDetailedAddress; // 상세 주소

  @Column(length = 50)
  private String clientEmail; // 회사 이메일

  @Column(length = 20)
  private String registrationNumber; // 사업자 번호

  @Column(length = 20)
  private String clientBank; // 거래 은행

  @Column(length = 50)
  private String clientAccountNumber; // 거래 계좌번호

  @Column(length = 20)
  private String clientAccountOwner; // 예금주

  private String memo; // 메모

  @Column(nullable = false, columnDefinition = "DATETIME")
  private LocalDate createdDate; // 생성일

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RequestStatus status = RequestStatus.PREPARED; // 기본 상태: 준비됨

  @Column
  private Integer approvedByEmployeeId; // 승인한 관리자 ID

  @ManyToOne
  @JoinColumn(name = "parent_id")
  private Client parent; // 수정 요청 시 부모 Client 참조


}