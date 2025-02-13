import React, { useRef, useState, useCallback } from "react";
import AnnouncementCreate from "../components/AnnouncementCreate";
import AnnouncementList from "../components/AnnouncementList";
import AnnouncementSearch from "../components/AnnouncementSearch";
import AnnouncementDetail from "../components/AnnouncementDetail"; // AnnouncementDetail 컴포넌트 임포트 추가
import "../scss/AnnouncementPage.scss";
import BasicLayout from "../../common/pages/BasicLayout";

const AnnouncementPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false); // showDetailForm 상태 추가
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // selectedAnnouncement 상태 추가
  const [searchResults, setSearchResults] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const announcementListRef = useRef(null);

  // 검색 결과 저장 함수
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // 업데이트 트리거 (공지 추가, 수정, 삭제 시 실행)
  const onUpdateTrigger = useCallback(() => {
    console.log("🆕 onUpdateTrigger 실행됨");
    setUpdateTrigger((prev) => prev + 1);
  }, []);

  // 공지사항 삭제 성공 후 호출되는 함수
  const handleDeleteSuccess = useCallback(() => {
    onUpdateTrigger(); // 삭제 후 목록 갱신
  }, [onUpdateTrigger]);

  // 공지사항 상세 보기 클릭 시 호출되는 함수
  const handleViewDetail = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailForm(true); // 상세 보기 모달 열기
  };

  return (
    <BasicLayout>
      <div className="announcement-page">
        <div className="page-header">
          <h2>공지사항 관리</h2>
          <AnnouncementSearch onSearch={handleSearchResults} />
          <button
            className="new-announcement-btn"
            onClick={() => setShowCreateForm(true)}
          >
            공지 작성
          </button>
        </div>
        <AnnouncementList
          ref={announcementListRef}
          searchResults={searchResults}
          onUpdateTrigger={updateTrigger}
          onViewDetail={handleViewDetail} // 공지 상세보기 클릭 핸들러 전달
        />

        {showCreateForm && (
          <div className="modal-overlay">
            <AnnouncementCreate
              onClose={() => setShowCreateForm(false)}
              onAddSuccess={onUpdateTrigger}
            />
          </div>
        )}

        {showDetailForm && selectedAnnouncement && (
          <div className="modal-overlay">
            <AnnouncementDetail
              announcement={selectedAnnouncement}
              onClose={() => {
                setShowDetailForm(false);
                setSelectedAnnouncement(null);
              }}
              onDeleteSuccess={handleDeleteSuccess}
              onUpdateSuccess={onUpdateTrigger}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default AnnouncementPage;
