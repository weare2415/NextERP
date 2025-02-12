package com.nexterp.employee;

/*
 * Description    :
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.employee
 * FileName       : EmployeeDataInitializer
 * Author         : paesir
 * Date           : 25. 1. 17.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 17.오후 4:20  paesir      최초 생성
 */

import com.nexterp.employee.dto.EmployeeDTO;
import com.nexterp.employee.entity.Department;
import com.nexterp.employee.entity.Position;
import com.nexterp.employee.repository.DepartmentRepository;
import com.nexterp.employee.repository.PositionRepository;
import com.nexterp.employee.service.EmployeeService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Configuration
public class EmployeeDataInitializer {
  /*@Bean
  public ApplicationRunner initializeDepartments(DepartmentRepository departmentRepository) {
    return args -> {
      createDepartmentIfNotExists(departmentRepository, "영업팀", "sales@company.com");
      createDepartmentIfNotExists(departmentRepository, "회계팀", "accounting@company.com");
      createDepartmentIfNotExists(departmentRepository, "인사팀", "hr@company.com");
    };
  }

  private void createDepartmentIfNotExists(DepartmentRepository departmentRepository, String name, String contactEmail) {
    if (departmentRepository.findAll().stream().noneMatch(dept -> dept.getName().equals(name))) {
      Department department = new Department();
      department.setName(name);
      department.setContactEmail(contactEmail);
      departmentRepository.save(department);
    }
  }

  @Bean
  public ApplicationRunner initializePositions(PositionRepository positionRepository) {
    return args -> {
      createPositionIfNotExists(positionRepository, "인턴", "User");
      createPositionIfNotExists(positionRepository, "사원", "User");
      createPositionIfNotExists(positionRepository, "대리", "Manager");
      createPositionIfNotExists(positionRepository, "과장", "Manager");
      createPositionIfNotExists(positionRepository, "차장", "Admin");
      createPositionIfNotExists(positionRepository, "부장", "Admin");
      createPositionIfNotExists(positionRepository, "이사", "Supervisor");
      createPositionIfNotExists(positionRepository, "사장", "Supervisor");
    };
  }

  private void createPositionIfNotExists(PositionRepository positionRepository, String title, String role) {
    if (positionRepository.findAll().stream().noneMatch(position -> position.getTitle().equals(title))) {
      Position position = new Position();
      position.setTitle(title);
      position.setRole(role);
      positionRepository.save(position);
    }
  }

  @Bean
  public ApplicationRunner initializeAdminEmployees(EmployeeService employeeService) {
    return args -> {

      // ✅ 여러 명의 직원 리스트 생성
      List<EmployeeDTO> employees = Arrays.asList(
          new EmployeeDTO(80001234, "관리자", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              3, "인사팀", 8, "사장", LocalDate.now(), null, false,
              null, null, new HashMap<>()),

          new EmployeeDTO(10000001, "영업팀 사원", LocalDate.of(1990, 1, 1), false,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              1, "영업팀", 2, "사원", LocalDate.now(), null, false,
              null, null, new HashMap<>()),

          new EmployeeDTO(10000002, "영업팀 대리", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              1, "영업팀", 3, "대리", LocalDate.now(), null, false,
              null, null, new HashMap<>()),

          new EmployeeDTO(10000003, "영업팀 부장", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              1, "영업팀", 6, "부장", LocalDate.now(), null, false,
              null, null, new HashMap<>()),

          new EmployeeDTO(20000001, "회계팀 인턴", LocalDate.of(1990, 1, 1), false,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              2, "회계팀", 1, "인턴", LocalDate.now(), null, false,
              null, null, new HashMap<>()),

          new EmployeeDTO(20000002, "회계팀 과장", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              2, "회계팀", 4, "과장", LocalDate.now(), null, false,
              null, null, new HashMap<>()),

          new EmployeeDTO(30000003, "인사팀 부장", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              3, "인사팀", 6, "부장", LocalDate.now(), null, false,
              null, null, new HashMap<>()),
          new EmployeeDTO(10001234, "황수림", LocalDate.of(1990, 1, 1), false,
              "010-0000-0000", "akdlgosvhs@gmail.com".trim(), "서울 강남",
              1, null, 7, null,  LocalDate.now(), null, false,
              null, null, new HashMap<>()),
          new EmployeeDTO(10007777, "박남수", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              1, null, 7, null,  LocalDate.now(), null, false,
              null, null, new HashMap<>()),
          new EmployeeDTO(20001234, "이정현", LocalDate.of(1990, 1, 1), true,
              "010-7491-7490", "jay6423@gmail.com".trim(), "서울 강남",
              2, null, 7, null,  LocalDate.now(), null, false,
              null, null, new HashMap<>()),
          new EmployeeDTO(30001234, "정우성", LocalDate.of(1990, 1, 1), true,
              "010-0000-0000", "useongj490@gmail.com".trim(), "서울 강남",
              3, null, 7, null,  LocalDate.now(), null, false,
              null, null, new HashMap<>()));


      // ✅ 2. 직원 리스트를 반복하며 저장
      employees.forEach(employeeDTO -> {
        if (!employeeService.existById(employeeDTO.getId())) {
          employeeService.saveEmployee(employeeDTO);
          System.out.println("✅ 직원 추가: " + employeeDTO.getName());
        } else {
          System.out.println("⚠️ 직원 이미 존재: " + employeeDTO.getName());
        }
      });
    };
  }*/
}
