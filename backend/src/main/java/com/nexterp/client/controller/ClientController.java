package com.nexterp.client.controller;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.controller
 * FileName       : ClientController
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:55  paesir      최초 생성
 */


import com.nexterp.client.dto.ClientDTO;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

  private final ClientService clientService;

  // 거래처 생성
  @PostMapping
  public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO) {
    ClientDTO createdClient = clientService.createClient(clientDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
  }

  // clientCode로 거래처 조회
  @GetMapping("/{clientCode}")
  public ResponseEntity<ClientDTO> getClientByClientCode(@PathVariable String clientCode) {
    ClientDTO clientDTO = clientService.getClientByClientCode(clientCode);
    return ResponseEntity.ok(clientDTO);
  }

  // PENDING 상태가 아닌 거래처만 조회
  @GetMapping
  public ResponseEntity<List<ClientDTO>> getAllClients() {
    List<ClientDTO> clients = clientService.getAllClients();
    return ResponseEntity.ok(clients);
  }

  // 수정 요청 상태의 거래처만 조회(PENDING 상태의 거래처만 조회)
  @GetMapping("/pending")
  public ResponseEntity<List<ClientDTO>> getPendingClients() {
    List<ClientDTO> pendingClients = clientService.getPendingClients();
    return ResponseEntity.ok(pendingClients);
  }

  // ✅ 특정 employeeId를 가진 거래처 목록 조회 (새로운 메서드 추가)
  @GetMapping("/employee/{employeeId}")
  public ResponseEntity<List<ClientDTO>> getClientsByEmployeeId(@PathVariable Integer employeeId) {
    List<ClientDTO> clients = clientService.getClientsByEmployeeId(employeeId);
    return ResponseEntity.ok(clients);
  }

  // 상태별 거래처 조회
  @GetMapping("/status/{status}")
  public ResponseEntity<List<ClientDTO>> getClientsByStatus(@PathVariable RequestStatus status) {
    List<ClientDTO> clients = clientService.getClientsByStatus(status);
    return ResponseEntity.ok(clients);
  }

  // 거래처 수정 요청
  @PutMapping("/{clientCode}/request-update")
  public ResponseEntity<ClientDTO> requestUpdateClient(
      @PathVariable String clientCode,
      @RequestBody ClientDTO clientDTO) {
    ClientDTO updatedClient = clientService.requestUpdateClient(clientCode, clientDTO);
    return ResponseEntity.ok(updatedClient);
  }

  // 거래처 승인
  @PutMapping("/{clientCode}/approve")
  public ResponseEntity<ClientDTO> approveClient(
      @PathVariable String clientCode,
      @RequestParam Integer approvedEmployeeId) {
    ClientDTO approvedClient = clientService.approveClient(clientCode, approvedEmployeeId);
    return ResponseEntity.ok(approvedClient);
  }

  // 거래처 반려
  @PutMapping("/{clientCode}/reject")
  public ResponseEntity<Void> rejectClient(
          @PathVariable String clientCode,
          @RequestParam Integer approvedEmployeeId) {
    clientService.rejectClient(clientCode, approvedEmployeeId);
    return ResponseEntity.noContent().build();
  }

  // 거래처 삭제
  @DeleteMapping("/{clientCode}")
  public ResponseEntity<Void> deleteClient(@PathVariable String clientCode) {
    clientService.deleteClient(clientCode);
    return ResponseEntity.noContent().build();
  }
}
