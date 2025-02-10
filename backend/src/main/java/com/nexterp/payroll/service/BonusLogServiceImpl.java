package com.nexterp.payroll.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.service
 * FileName       : BonusLogServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 6:00  paesir      최초 생성
 */

import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.payroll.dto.BonusLogDTO;
import com.nexterp.payroll.entity.BonusLog;
import com.nexterp.payroll.repository.BonusLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BonusLogServiceImpl implements BonusLogService {
  private final BonusLogRepository repository;
  private final EmployeeRepository employeeRepository;

  @Override
  @Transactional
  public BonusLogDTO save(BonusLogDTO dto) {
    Employee employee = employeeRepository.findById(dto.getEmployeeId())
        .orElseThrow(() -> new IllegalArgumentException("Invalid employee ID: " + dto.getEmployeeId()));

    BonusLog entity = new BonusLog();
    entity.setEmployee(employee);
    entity.setBonusAmount(dto.getBonusAmount());
    entity.setGrantedAt(dto.getGrantedAt());
    entity.setDescription(dto.getDescription());

    BonusLog savedEntity = repository.save(entity);
    return entityToDTO(savedEntity);
  }

  @Override
  @Transactional(readOnly = true)
  public List<BonusLogDTO> findByEmployeeId(Integer employeeId) {
    return repository.findByEmployeeId(employeeId).stream().map(this::entityToDTO).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<BonusLogDTO> findAll() {
    return repository.findAll().stream().map(this::entityToDTO).toList();
  }

  @Override
  @Transactional
  public void deleteById(Long id) {
    repository.deleteById(id);
  }

  private BonusLogDTO entityToDTO(BonusLog entity) {
    return new BonusLogDTO(
        entity.getId(),
        entity.getEmployee().getId(),
        entity.getBonusAmount(),
        entity.getGrantedAt(),
        entity.getDescription()
    );
  }

}
