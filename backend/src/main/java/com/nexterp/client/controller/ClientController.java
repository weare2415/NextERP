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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

  // PENDING 상태가 아닌 거래처만 조회
  @GetMapping
  public ResponseEntity<Page<ClientDTO>> getAllClients(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size
  ) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ClientDTO> clients = clientService.getAllClients(pageable);
    return ResponseEntity.ok(clients);
  }

  // clientName으로 거래처 조회
  @GetMapping("/clientName/{clientName}")
  public ResponseEntity<Page<ClientDTO>> getClientByName(@PathVariable String clientName,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ClientDTO> clients = clientService.getClientByClientName(clientName, pageable);
    return ResponseEntity.ok(clients);
  }

  // clientCode로 거래처 조회
  @GetMapping("/{clientCode}")
  public ResponseEntity<Page<ClientDTO>> getClientByClientCode(@PathVariable String clientCode,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ClientDTO> clientDTO = clientService.getClientByClientCode(clientCode, pageable);
    return ResponseEntity.ok(clientDTO);
  }

  // 수정 요청 상태의 거래처만 조회(PENDING 상태의 거래처만 조회)
  @GetMapping("/pending")
  public ResponseEntity<Page<ClientDTO>> getPendingClients(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ClientDTO> pendingClients = clientService.getPendingClients(pageable);
    return ResponseEntity.ok(pendingClients);
  }

  // employeeId로 거래처 목록 조회
  @GetMapping("/employee/{employeeId}")
  public ResponseEntity<Page<ClientDTO>> getClientsByEmployeeId(@PathVariable Integer employeeId,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ClientDTO> clients = clientService.getClientsByEmployeeId(employeeId, pageable);
    return ResponseEntity.ok(clients);
  }

  // 상태별 거래처 조회
  @GetMapping("/status/{status}")
  public ResponseEntity<Page<ClientDTO>> getClientsByStatus(@PathVariable RequestStatus status,
                                                            @RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ClientDTO> clients = clientService.getClientsByStatus(status, pageable);
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
