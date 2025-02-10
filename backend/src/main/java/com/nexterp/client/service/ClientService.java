package com.nexterp.client.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.sales.service
 * FileName       : ClientService
 * Author         : paesir
 * Date           : 25. 1. 28.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 28.오전 1:41  paesir      최초 생성
 */


import com.nexterp.client.dto.ClientDTO;
import com.nexterp.client.entity.RequestStatus;

import java.util.List;

public interface ClientService {
    ClientDTO createClient(ClientDTO clientDTO);
    ClientDTO getClientByClientCode(String clientCode); // ID로 조회
    List<ClientDTO> getAllClients(); // 전체 조회
    List<ClientDTO> getPendingClients();
    List<ClientDTO> getClientsByEmployeeId(Integer employeeId);
    List<ClientDTO> getClientsByStatus(RequestStatus status);
    ClientDTO requestUpdateClient(String clientCode, ClientDTO clientDTO);
    ClientDTO approveClient(String clientCode, Integer approvedEmployeeId);
    void rejectClient(String clientCode, Integer approvedEmployeeId);
    void deleteClient(String clientCode);
}
