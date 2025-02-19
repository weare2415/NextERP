package com.nexterp.common.security.filter;

import com.google.gson.Gson;
import com.nexterp.common.util.CustomJWTException;
import com.nexterp.common.util.JWTUtil;
import com.nexterp.member.dto.MemberDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

  private final JWTUtil jwtUtil;

  public JWTCheckFilter(JWTUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    log.info("Executing JWTCheckFilter...");

    String authHeader = request.getHeader("Authorization");
    String refreshToken = request.getHeader("Refresh-Token");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      log.warn("Missing or invalid Authorization header");
      respondWithUnauthorized(response, "MISSING_AUTHORIZATION_HEADER");
      return;
    }

    String accessToken = authHeader.substring(7);

    try {
      // 1. Access Token 유효성 확인
      Map<String, Object> claims = jwtUtil.validateToken(accessToken);
      log.info("Valid access token. Claims: {}", claims);

      // Access Token이 유효하다면 SecurityContext 갱신
      setAuthentication(claims);
      filterChain.doFilter(request, response);

    } catch (CustomJWTException e) {
      // 2. Access Token 만료 시 Refresh Token 사용
      if ("Expired".equals(e.getMessage())) {
        log.warn("Access token expired. Attempting to refresh...");

        if (refreshToken == null || refreshToken.isEmpty()) {
          log.error("Missing Refresh Token.");
          respondWithUnauthorized(response, "MISSING_REFRESH_TOKEN");
          return;
        }

        try {
          // Refresh Token 검증 및 새 Access Token 발급
          Map<String, Object> refreshClaims = jwtUtil.validateToken(refreshToken);
          log.info("Valid refresh token. Claims: {}", refreshClaims);

          String newAccessToken = jwtUtil.generateToken(refreshClaims, 60); // 60분 유효
          log.info("New access token generated.");

          // 헤더에 새 Access Token 추가
          response.setHeader("Authorization", "Bearer " + newAccessToken);

          // SecurityContext 갱신
          setAuthentication(refreshClaims);

          filterChain.doFilter(request, response);

        } catch (CustomJWTException refreshEx) {
          log.error("Refresh token validation failed:", refreshEx);
          respondWithUnauthorized(response, "INVALID_REFRESH_TOKEN");
        }
      } else {
        log.error("JWT validation failed:", e);
        respondWithUnauthorized(response, "INVALID_ACCESS_TOKEN");
      }
    }
  }

  private void setAuthentication(Map<String, Object> claims) {
    String id = claims.get("id").toString();
    String name = claims.get("name").toString();
    String role = claims.get("role").toString();
    Boolean isInitialPassword = (Boolean) claims.get("isInitialPassword");

    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

    MemberDTO memberDTO = new MemberDTO(id, "password", authorities, name, role, isInitialPassword);
    log.info("Authenticated Member: " + memberDTO);

    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(memberDTO, null, memberDTO.getAuthorities());

    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
      return true; // Preflight 요청 제외
    }

    String path = request.getRequestURI();
    log.info("Checking URI for filtering: {}", path);

    // 필터를 적용하지 않을 경로 지정
    // 필터를 적용하지 않을 경로 지정
    List<String> excludedPaths = List.of("/api/member/login", "/api/member/refresh","/api/member/change-password", "/api/member/forgot-password");

    // `/api/employees/{id}` 경로 제외 (정규식 적용)
    if (path.matches("^/api/employees/\\d+$")) {  //  사원 ID가 숫자인 경우만 필터 제외
      return true;
    }
    return excludedPaths.stream().anyMatch(path::startsWith);
  }

  private void respondWithUnauthorized(HttpServletResponse response, String errorMessage) throws IOException {
    Gson gson = new Gson();
    String errorResponse = gson.toJson(Map.of("error", errorMessage));
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    try (PrintWriter writer = response.getWriter()) {
      writer.println(errorResponse);
      writer.flush();
    }
  }
}