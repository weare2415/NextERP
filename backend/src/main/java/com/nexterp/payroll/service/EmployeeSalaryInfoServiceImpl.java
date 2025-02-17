package com.nexterp.payroll.service;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.payroll.service
 * FileName       : EmployeeSalaryInfoServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 21.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 21.오후 5:55  paesir      최초 생성
 */

import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.payroll.dto.EmployeeSalaryInfoDTO;
import com.nexterp.payroll.entity.EmployeeSalaryInfo;
import com.nexterp.payroll.repository.EmployeeSalaryInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeSalaryInfoServiceImpl implements EmployeeSalaryInfoService {
    private final EmployeeSalaryInfoRepository salaryInfoRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeeSalaryInfoDTO saveSalaryInfo(EmployeeSalaryInfoDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid employee ID: " + dto.getEmployeeId()));

        // 기존 활성화 된 급여 정보가 있는지 확인
        EmployeeSalaryInfo currentSalaryInfo = salaryInfoRepository.findActiveSalaryInfo_(employee.getId());
        if (currentSalaryInfo != null) {
            // 기존 데이터의 종료일을 새 effectiveDate 전날로 업데이트
            currentSalaryInfo.setEndDate(dto.getEffectiveDate().minusDays(1));
            salaryInfoRepository.save(currentSalaryInfo);
            // 변경사항을 DB에 반영 (flush 호출)
            salaryInfoRepository.flush();
        }

        // 새로운 급여 정보 생성
        EmployeeSalaryInfo newEntity = new EmployeeSalaryInfo();
        newEntity.setEmployee(employee);
        newEntity.setBaseSalary(dto.getBaseSalary());
        newEntity.setDeductions(dto.getDeductions());
        newEntity.setEffectiveDate(dto.getEffectiveDate());
        newEntity.setEndDate(null); // 새 레코드가 활성 상태라면 null이어야 함

        EmployeeSalaryInfo savedEntity = salaryInfoRepository.save(newEntity);
        return entityToDTO(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmployeeSalaryInfoDTO> findByEmployeeId(Integer employeeId) {
        Optional<EmployeeSalaryInfo> salaryInfo = salaryInfoRepository.findActiveSalaryInfo(employeeId);
        if (salaryInfo.isEmpty()) {
            System.out.println("❌ 급여 정보 없음 - 직원 ID: " + employeeId);
        } else {
            System.out.println("✅ 급여 정보 찾음 - 직원 ID: " + employeeId);
        }
        return salaryInfo.map(this::entityToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeSalaryInfoDTO> findAllSalaryInfo(Pageable pageable) {
        return salaryInfoRepository.findActiveSalaryInfos(pageable).map(this::entityToDTO);
    }

    @Override
    public Page<EmployeeSalaryInfoDTO> findSalaryInfoHistoryByEmployeeId(Integer employeeId, Pageable pageable) {
        return salaryInfoRepository.findByEmployee_IdAndEndDateIsNotNull(employeeId,pageable).map(this::entityToDTO);
    }

    @Override
    public void deleteSalaryInfo(Long id) {
        salaryInfoRepository.deleteById(id);
    }

    private EmployeeSalaryInfoDTO entityToDTO(EmployeeSalaryInfo entity) {
        return new EmployeeSalaryInfoDTO(
                entity.getId(),
                entity.getEmployee().getId(),
                entity.getBaseSalary(),
                entity.getDeductions(),
                entity.getEffectiveDate(),
                entity.getEndDate()
        );
    }
}
