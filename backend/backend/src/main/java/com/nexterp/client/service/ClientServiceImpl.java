package com.nexterp.client.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.service
 * FileName       : ClientServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:43  paesir      최초 생성
 */

import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.client.dto.ClientDTO;
import com.nexterp.client.entity.Client;
import com.nexterp.client.entity.RequestStatus;
import com.nexterp.client.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
  private final ClientRepository clientRepository;
  private final EmployeeRepository employeeRepository;

  @Override
  public ClientDTO createClient(ClientDTO clientDTO) {
    // 담당자(Employee) 조회
    Employee employee = employeeRepository.findById(clientDTO.getEmployeeId())
            .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 Employee ID입니다."));

    // 클라이언트 코드 중복 검사
    if (clientRepository.existsByClientCode(clientDTO.getClientCode())) {
      throw new IllegalArgumentException("이미 존재하는 클라이언트 코드입니다: " + clientDTO.getClientCode());
    }

    // Client 엔터티 생성
    Client client = Client.builder()
            .clientName(clientDTO.getClientName())
            .clientCode(clientDTO.getClientCode())
            .clientPhone(clientDTO.getClientPhone())
            .zipCode(clientDTO.getZipCode())
            .clientAddress(clientDTO.getClientAddress())
            .clientDetailedAddress(clientDTO.getClientDetailedAddress())
            .clientEmail(clientDTO.getClientEmail())
            .registrationNumber(clientDTO.getRegistrationNumber())
            .clientBank(clientDTO.getClientBank())
            .clientAccountNumber(clientDTO.getClientAccountNumber())
            .clientAccountOwner(clientDTO.getClientAccountOwner())
            .memo(clientDTO.getMemo())
            .employee(employee) // Employee 엔터티 연결
            .createdDate(LocalDate.now())
            .status(RequestStatus.PREPARED)
            .build();

    // 저장 후 엔터티를 DTO로 변환하여 반환
    return convertToDTO(clientRepository.save(client));
  }

  // PENDING 상태가 아닌 거래처만 조회
  @Override
  public Page<ClientDTO> getAllClients(Pageable pageable) {
    Page<Client> clients = clientRepository.findAllActiveClients(pageable);
    return clients.map(this::convertToDTO);}

  // PENDING 상태의 거래처만 조회
  @Override
  public Page<ClientDTO> getPendingClients(Pageable pageable) {
    Page<Client> clients = clientRepository.findPendingClients(pageable);
    return clients.map(this::convertToDTO);}

  // employeeId값으로 거래처 조회
  @Override
  public Page<ClientDTO> getClientsByEmployeeId(Integer employeeId, Pageable pageable) {
    Page<Client> clients = clientRepository.findByEmployeeId(employeeId, pageable);
    return clients.map(this::convertToDTO);}

  @Override
  public Page<ClientDTO> getClientsByStatus(RequestStatus status, Pageable pageable) {
    Page<Client> clients = clientRepository.findByStatus(status, pageable);
    return clients.map(this::convertToDTO);}

  // clientCode로 조회
  @Override
  public Page<ClientDTO> getClientByClientCode(String clientCode, Pageable pageable) {
    Page<Client> clients = clientRepository.findByClientCodeLike(clientCode, pageable);
    return clients.map(this::convertToDTO);}

  // clientName으로 조회
  @Override
  public Page<ClientDTO> getClientByClientName(String clientName, Pageable pageable) {
    Page<Client> clients = clientRepository.findByClientName(clientName, pageable);
    return clients.map(this::convertToDTO);
  }

  @Override
  public ClientDTO requestUpdateClient(String clientCode, ClientDTO clientDTO) {
    Client existingClient = clientRepository.findByClientCode(clientCode)
            .orElseThrow(() -> new RuntimeException("거래처를 찾을 수 없습니다."));

    // clientCode 생성 (중복 방지)
    String modifiedClientCode = existingClient.getClientCode() + "M";

    // Client 엔터티 생성 (수정 요청 데이터)
    Client tempClient = Client.builder()
            .clientName(clientDTO.getClientName())
            .clientCode(modifiedClientCode) // 회사 코드는 변경 불가
            .clientPhone(clientDTO.getClientPhone())
            .zipCode(clientDTO.getZipCode())
            .clientAddress(clientDTO.getClientAddress())
            .clientDetailedAddress(clientDTO.getClientDetailedAddress())
            .clientEmail(clientDTO.getClientEmail())
            .registrationNumber(clientDTO.getRegistrationNumber())
            .clientBank(clientDTO.getClientBank())
            .clientAccountNumber(clientDTO.getClientAccountNumber())
            .clientAccountOwner(clientDTO.getClientAccountOwner())
            .memo(clientDTO.getMemo())
            .employee(existingClient.getEmployee()) // 기존 Employee 유지
            .parent(existingClient) // 부모 Client 설정
            .status(RequestStatus.PENDING) // 상태를 PENDING으로 설정
            .createdDate(LocalDate.now())
            .build();

    // 저장 후 DTO 반환
    return convertToDTO(clientRepository.save(tempClient));
  }

  @Override
  public ClientDTO approveClient(String clientCode, Integer approvedEmployeeId) {
    Client clientCodeName = clientRepository.findByClientCode(clientCode)
            .orElseThrow(() -> new RuntimeException("승인 요청 데이터를 찾을 수 없습니다."));

    if (!RequestStatus.PENDING.equals(clientCodeName.getStatus())) {
      throw new IllegalStateException("승인 가능한 상태가 아닙니다.");
    }

    Client parentClient = clientCodeName.getParent();
    if (parentClient == null) {
      throw new IllegalStateException("부모 데이터가 없습니다.");
    }

    String cleanedMemo = removeAutoGeneratedHistory(clientCodeName.getMemo());

    // 승인 데이터 반영
    parentClient.setClientName(clientCodeName.getClientName());
    parentClient.setClientPhone(clientCodeName.getClientPhone());
    parentClient.setZipCode(clientCodeName.getZipCode());
    parentClient.setClientAddress(clientCodeName.getClientAddress());
    parentClient.setClientDetailedAddress(clientCodeName.getClientDetailedAddress());
    parentClient.setClientEmail(clientCodeName.getClientEmail());
    parentClient.setRegistrationNumber(clientCodeName.getRegistrationNumber());
    parentClient.setClientBank(clientCodeName.getClientBank());
    parentClient.setClientAccountNumber(clientCodeName.getClientAccountNumber());
    parentClient.setClientAccountOwner(clientCodeName.getClientAccountOwner());
    parentClient.setMemo(cleanedMemo);  // [자동 생성] 제거 후 순수 메모만 저장
    parentClient.setStatus(RequestStatus.APPROVED); // 승인 상태로 변경
    parentClient.setApprovedByEmployeeId(approvedEmployeeId); // 승인한 관리자 ID 저장

    clientRepository.save(parentClient); // 부모 데이터 저장
    clientRepository.delete(clientCodeName); // 임시 데이터 삭제

    return convertToDTO(parentClient);
  }

  @Override
  public void rejectClient(String clientCode, Integer approvedEmployeeId) {
    Client pendingClient = clientRepository.findByClientCode(clientCode)
            .orElseThrow(() -> new RuntimeException("반려 요청 데이터를 찾을 수 없습니다."));

    if (!RequestStatus.PENDING.equals(pendingClient.getStatus())) {
      throw new IllegalStateException("반려 가능한 상태가 아닙니다.");
    }

    Client parentClient = pendingClient.getParent();
    if (parentClient == null) {
      throw new IllegalStateException("부모 데이터가 없습니다.");
    }

    // 기존 데이터는 그대로 두고, 승인 요청 데이터만 삭제
    parentClient.setStatus(RequestStatus.REJECTED); // 반려 상태로 변경
    parentClient.setApprovedByEmployeeId(approvedEmployeeId); // 반려한 관리자 ID 저장

    clientRepository.save(parentClient); // 부모 데이터 저장
    clientRepository.delete(pendingClient); // 임시 데이터 삭제
  }

  @Override
  public void deleteClient(String clientCode) {
    Client client = clientRepository.findByClientCode(clientCode)
            .orElseThrow(() -> new RuntimeException("삭제할 거래처를 찾을 수 없습니다."));
    clientRepository.delete(client);
  }

  // 엔터티를 DTO로 변환
  private ClientDTO convertToDTO(Client client) {
    return ClientDTO.builder()
            .id(client.getId())
            .clientName(client.getClientName())
            .clientCode(client.getClientCode())
            .clientPhone(client.getClientPhone())
            .zipCode(client.getZipCode())
            .clientAddress(client.getClientAddress())
            .clientDetailedAddress(client.getClientDetailedAddress())
            .clientEmail(client.getClientEmail())
            .registrationNumber(client.getRegistrationNumber())
            .clientBank(client.getClientBank())
            .clientAccountNumber(client.getClientAccountNumber())
            .clientAccountOwner(client.getClientAccountOwner())
            .memo(client.getMemo())
            .employeeId(client.getEmployee().getId()) // Employee의 ID 반환
            .build();
  }

  // ✅ 자동 생성된 변경 이력을 제거하는 메서드
  private String removeAutoGeneratedHistory(String memo) {
    if (memo == null) return "";
    return memo.split("\\[자동 생성된 변경 이력\\]")[0].trim();
  }
}
