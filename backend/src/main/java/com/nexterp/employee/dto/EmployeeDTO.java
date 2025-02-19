package com.nexterp.employee.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class EmployeeDTO {
    private Integer id; // 사원 번호
    private String name; // 이름
    private LocalDate birthDate; // 생년월일
    private Boolean gender; // 성별
    private String phone; // 전화번호
    private String email; // 이메일
    private String address; // 주소
    private Integer departmentId; // 부서 ID
    private String departmentName;
    private Integer positionId; // 직위 ID
    private String positionTitle;
    private LocalDate hireDate; // 입사일
    private LocalDate terminationDate; // 퇴사일
    private Boolean isTerminated; // 논리적 퇴사 여부
    private Integer approvedByEmployeeId; // 담당자의 ID
    private Integer parentEmployeeId; // ✅ 부모 직원 ID 추가

    private Map<String, Map<String, String>> changedFields; // ✅ 변경된 필드 정보 추가



    @Override
    public String toString() {
        return "EmployeeDTO{" +
                "departmentId=" + departmentId +
                ", departmentName='" + departmentName + '\'' +
                ", positionId=" + positionId +
                ", positionTitle='" + positionTitle + '\'' +
                '}';
    }
}
