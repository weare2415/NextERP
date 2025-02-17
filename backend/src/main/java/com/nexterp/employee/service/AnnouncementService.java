package com.nexterp.employee.service;

import com.nexterp.employee.dto.AnnouncementDTO;
import com.nexterp.employee.entity.Announcement;
import com.nexterp.employee.entity.Department;
import com.nexterp.employee.entity.Employee;
import com.nexterp.employee.entity.Position;
import com.nexterp.employee.repository.AnnouncementRepository;
import com.nexterp.employee.repository.DepartmentRepository;
import com.nexterp.employee.repository.EmployeeRepository;
import com.nexterp.employee.repository.PositionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final EmployeeRepository employeeRepository;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository, EmployeeRepository employeeRepository, PositionRepository positionRepository, DepartmentRepository departmentRepository) {
        this.announcementRepository = announcementRepository;
        this.employeeRepository = employeeRepository;
        this.positionRepository = positionRepository;
        this.departmentRepository = departmentRepository;
    }

    // DTO 변환 메서드
    private AnnouncementDTO convertToDTO(Announcement announcement) {
        return new AnnouncementDTO(
                announcement.getAnnouncementId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getAuthor().getId(),
                announcement.getAuthor().getName(),
                announcement.getDepartment() != null ? announcement.getDepartment().getDepartmentId() : null, // 부서 ID
                announcement.getPosition() != null ? announcement.getPosition().getPositionId() : null, // 직위 ID
                announcement.getCreatedAt(),
                announcement.getUpdatedAt()
        );
    }

    // ✅ 공지사항 업데이트 (추가)
    @Transactional
    public AnnouncementDTO updateAnnouncement(Integer id, AnnouncementDTO announcementDTO) {
        // 기존 공지사항 조회
        Announcement existingAnnouncement = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공지사항 ID: " + id));

        // 작성자 확인
        Employee author = employeeRepository.findById(announcementDTO.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 작성자 ID: " + announcementDTO.getAuthorId()));

        // 기존 직위 확인
        Position position = positionRepository.findById(author.getPosition().getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 직위 ID: " + author.getPosition().getPositionId()));

        // ✅ 수정 권한 확인 (작성자 본인 또는 관리자만 수정 가능)
        if (!existingAnnouncement.getAuthor().getId().equals(author.getId()) && position.getPositionId() < 5) {
            throw new IllegalArgumentException("공지사항을 수정할 권한이 없습니다.");
        }

        // 부서 확인
        Department department = null;
        if (announcementDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(announcementDTO.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 부서 ID: " + announcementDTO.getDepartmentId()));
        }

        // ✅ 공지사항 내용 업데이트
        existingAnnouncement.setTitle(announcementDTO.getTitle());
        existingAnnouncement.setContent(announcementDTO.getContent());
        existingAnnouncement.setDepartment(department);
        existingAnnouncement.setUpdatedAt(LocalDateTime.now());

        // ✅ DB 저장
        Announcement updatedAnnouncement = announcementRepository.save(existingAnnouncement);
        return convertToDTO(updatedAnnouncement);
    }



    public List<AnnouncementDTO> getAnnouncementsByDepartment(Integer departmentId) {
        List<Announcement> announcements = announcementRepository.findByDepartment_DepartmentId(departmentId);
        return announcements.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    // ✅ 특정 직위(Position)에 대한 공지사항 조회 (List<Announcement> → List<AnnouncementDTO> 변환)
    public List<AnnouncementDTO> getAnnouncementsByPosition(Integer positionId) {
        List<Announcement> announcements = announcementRepository.findByPosition_PositionId(positionId);
        return announcements.stream().map(this::convertToDTO).collect(Collectors.toList());
    }




    // 전체 공지사항 조회
    public List<AnnouncementDTO> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return announcements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 특정 공지사항 조회
    public AnnouncementDTO getAnnouncementById(Integer id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Announcement ID: " + id));
        return convertToDTO(announcement);
    }

    // 공지사항 저장

    @Transactional
    public AnnouncementDTO saveAnnouncement(AnnouncementDTO announcementDTO) {
        // 작성자 조회
        Employee author = employeeRepository.findById(announcementDTO.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + announcementDTO.getAuthorId()));

        // 직위 조회
        Position position = positionRepository.findById(author.getPosition().getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Position ID: " + author.getPosition().getPositionId()));

        // ✅ 공지 생성 권한 체크
        boolean canCreateDepartmentAnnouncement = position.getPositionId() >= 5; // Admin(차장, 부장) 이상
        boolean canCreateGlobalAnnouncement = position.getPositionId() >= 7; // Supervisor(이사, 사장) 이상

        if (announcementDTO.getDepartmentId() != null) { // 부서별 공지사항
            if (!canCreateDepartmentAnnouncement) {
                throw new IllegalArgumentException("공지사항 작성 권한이 없습니다. (차장 이상만 가능)");
            }
        } else { // 전체 공지사항
            if (!canCreateGlobalAnnouncement) {
                throw new IllegalArgumentException("전체 공지사항은 이사 이상만 작성할 수 있습니다.");
            }
        }

        // 부서 조회 (부서별 공지사항인 경우)
        Department department = null;
        if (announcementDTO.getDepartmentId() != null) {
            department = departmentRepository.findById(announcementDTO.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Department ID: " + announcementDTO.getDepartmentId()));
        }

        // 공지사항 엔티티 생성
        Announcement announcement = new Announcement(
                null,
                announcementDTO.getTitle(),
                announcementDTO.getContent(),
                author,
                department,
                position,
                LocalDateTime.now(),
                null // updatedAt 초기값 없음
        );

        // ✅ 공지사항 저장 (누락된 부분 추가)
        announcement = announcementRepository.save(announcement); // ✅ 추가
        return convertToDTO(announcement); // ✅ 추가 (저장 후 DTO로 변환하여 반환)
    }

    // 공지사항 삭제
    public void deleteAnnouncement(Integer id) {
        announcementRepository.deleteById(id);
    }
}
