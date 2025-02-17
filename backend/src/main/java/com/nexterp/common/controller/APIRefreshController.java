package com.nexterp.common.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.common.controller
 * FileName       : APIRefreshController
 * Author         : paesir
 * Date           : 25. 1. 17.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 17.오후 6:25  paesir      최초 생성
 */


import com.nexterp.common.util.CustomJWTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import com.nexterp.common.util.JWTUtil;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class APIRefreshController {

  @PostMapping("/api/member/refresh")
  public Map<String, Object> refresh(
          @RequestHeader(value = "Authorization", required = false) String authHeader,
          @RequestHeader(value = "Refresh-Token", required = false) String refreshToken) {

    log.info("Refresh token: " + refreshToken);
    log.info("accessToken : "+ authHeader.substring(authHeader.indexOf("Bearer")+7));

    if(refreshToken == null) {
      throw new CustomJWTException("NULL_REFRESH");
    }

    if(authHeader == null || authHeader.length() < 7) {
      throw new CustomJWTException("INVALID_STRING");
    }

    String accessToken = authHeader.substring(7);

    //Access 토큰이 만료되지 않았다면
    if(!checkExpiredToken(accessToken)) {
      return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }

    //Refresh토큰 검증
    Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

    log.info("refresh ... claims: " + claims);

    String newAccessToken = JWTUtil.generateToken(claims, 60);

    String newRefreshToken =  checkTime((Integer) claims.get("exp")) ? JWTUtil.generateToken(claims, 60*24) : refreshToken;

    return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
  }


  //시간이 1시간 미만으로 남았다면
  private boolean checkTime(Integer exp) {

    //JWT exp를 날짜로 변환
    java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));

    //현재 시간과의 차이 계산 - 밀리세컨즈
    long gap   = expDate.getTime() - System.currentTimeMillis();

    //분단위 계산
    long leftMin = gap / (1000 * 60);

    //1시간도 안남았는지..
    return leftMin < 60;
  }

  private boolean checkExpiredToken(String token) {

    try{
      JWTUtil.validateToken(token);
    }catch(CustomJWTException ex) {
      if(ex.getMessage().equals("Expired")){
        return true;
      }
    }
    return false;
  }

}
