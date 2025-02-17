import React, { useRef, useState, useCallback } from "react";
import AnnouncementCreate from "../components/AnnouncementCreate";
import AnnouncementList from "../components/AnnouncementList";
import AnnouncementSearch from "../components/AnnouncementSearch";
import "../scss/AnnouncementPage.scss";
import BasicLayout from "../../common/pages/BasicLayout";

const AnnouncementPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const announcementListRef = useRef(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // 업데이트 트리거 (공지 추가, 수정, 삭제 시 실행)
  const onUpdateTrigger = useCallback(() => {
    console.log("🆕 onUpdateTrigger 실행됨");
    setUpdateTrigger((prev) => prev + 1);
  }, []);

  return (
    <BasicLayout>
      <div className="announcement-page-container">
        <div className="page-header">
          <h1>공지사항 관리</h1>
          <div className="header-right">
            <AnnouncementSearch onSearch={handleSearchResults} />
            <button
              className="new-announcement-btn"
              onClick={() => setShowCreateForm(true)}
            >
              공지 작성
            </button>
          </div>
        </div>
        <AnnouncementList
          ref={announcementListRef}
          searchResults={searchResults}
          onUpdateTrigger={updateTrigger}
        />

        {showCreateForm && (
          <div className="modal-overlay">
            <AnnouncementCreate
              onClose={() => setShowCreateForm(false)}
              onAddSuccess={onUpdateTrigger}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default AnnouncementPage;
