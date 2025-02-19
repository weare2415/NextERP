package com.nexterp.employee.repository;

import com.nexterp.employee.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {

    // ✅ 전체 공지사항 조회 (페이징 지원)
    Page<Announcement> findAll(Pageable pageable);

    // ✅ 특정 부서의 공지사항 조회 (페이징 지원)
    Page<Announcement> findByDepartment_DepartmentId(Integer departmentId, Pageable pageable);

    // ✅ 특정 직위의 공지사항 조회 (페이징 지원)
    Page<Announcement> findByPosition_PositionId(Integer positionId, Pageable pageable);
}
