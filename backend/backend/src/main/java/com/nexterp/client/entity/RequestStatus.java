package com.nexterp.client.entity;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.entity
 * FileName       : RequestStatus
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:40  paesir      최초 생성
 */


public enum RequestStatus {
  PREPARED("준비됨"),   // 기본값
  PENDING("승인 대기"), // 승인 대기
  APPROVED("승인"),     // 승인
  REJECTED("반려"),     // 반려
  REFUNDED("반품");

  private final String displayName;

  RequestStatus(String displayName) {
    this.displayName = displayName;
  }
  public String getDisplayName() {
    return displayName;
  }
}
