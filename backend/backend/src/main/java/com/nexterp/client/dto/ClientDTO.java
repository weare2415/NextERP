package com.nexterp.client.dto;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.dto
 * FileName       : ClientDTO
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:49  paesir      최초 생성
 */


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClientDTO {

  private Long id;
  private String clientName; // 회사명
  private String clientCode; // 회사 코드
  private String clientPhone; // 회사 전화번호
  private String zipCode; // 우편번호
  private String clientAddress; // 회사 주소
  private String clientDetailedAddress; // 상세 주소
  private String clientEmail; // 회사 이메일
  private String registrationNumber; // 사업자 번호
  private String clientBank; // 거래 은행
  private String clientAccountNumber; // 거래 계좌번호
  private String clientAccountOwner; // 예금주
  private String memo; // 메모
  private Integer employeeId; // 담당자의 ID
}