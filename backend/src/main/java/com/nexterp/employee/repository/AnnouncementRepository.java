package com.nexterp.employee.repository;

import com.nexterp.employee.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository  extends JpaRepository<Announcement, Integer> {

    // ✅ 특정 부서의 공지를 조회 (올바른 필드명 사용)
    List<Announcement> findByDepartment_DepartmentId(Integer departmentId);

    // ✅ 특정 직위의 공지를 조회 (올바른 필드명 사용)
    List<Announcement> findByPosition_PositionId(Integer positionId);
}
