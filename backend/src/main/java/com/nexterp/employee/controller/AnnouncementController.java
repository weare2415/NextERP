package com.nexterp.employee.controller;

import com.nexterp.employee.dto.AnnouncementDTO;
import com.nexterp.employee.service.AnnouncementService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }



    // 모든 공지사항 페이징 조회
    @GetMapping
    public ResponseEntity<Page<AnnouncementDTO>> getAllAnnouncements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AnnouncementDTO> announcements = announcementService.getAllAnnouncements(page, size);
        return ResponseEntity.ok(announcements);
    }


    // 특정 공지사항 조회 id
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Integer id) {
        AnnouncementDTO announcementDTO = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(announcementDTO);
    }

    //  특정 부서 공지사항 페이징 조회
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Page<AnnouncementDTO>> getAnnouncementsByDepartment(
            @PathVariable Integer departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsByDepartment(departmentId, page, size);
        return ResponseEntity.ok(announcements);
    }


    // 특정 직위 공지사항 페이징 조회
    @GetMapping("/position/{positionId}")
    public ResponseEntity<Page<AnnouncementDTO>> getAnnouncementsByPosition(
            @PathVariable Integer positionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AnnouncementDTO> announcements = announcementService.getAnnouncementsByPosition(positionId, page, size);
        return ResponseEntity.ok(announcements);
    }


    // 공지사항 생성
    @PostMapping
    public ResponseEntity<AnnouncementDTO> createAnnouncement(@RequestBody AnnouncementDTO announcementDTO) {
        AnnouncementDTO savedAnnouncement = announcementService.saveAnnouncement(announcementDTO);
        return ResponseEntity.ok(savedAnnouncement);
    }

    // ✅ 공지사항 수정 (추가)
    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Integer id,
            @RequestBody AnnouncementDTO announcementDTO) {
        AnnouncementDTO updatedAnnouncement = announcementService.updateAnnouncement(id, announcementDTO);
        return ResponseEntity.ok(updatedAnnouncement);
    }

    // 공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Integer id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok("Announcement deleted successfully.");
    }
}
