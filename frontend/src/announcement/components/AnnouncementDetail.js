import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateAnnouncement, deleteAnnouncement } from "../api/announcementApi";
import "../scss/AnnouncementDetail.scss";

const positionMap = {
  1: "인턴",
  2: "사원",
  3: "대리",
  4: "과장",
  5: "차장",
  6: "부장",
  7: "이사",
  8: "사장",
};

const departmentMap = {
  1: "영업팀",
  2: "회계팀",
  3: "인사팀",
};

const AnnouncementDetail = ({ announcement, onClose, onUpdateTrigger }) => {
  const employeeId = useSelector((state) => state.loginSlice?.id || null);
  const isAuthor = Number(announcement?.authorId) === Number(employeeId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnnouncement, setEditedAnnouncement] = useState(
    announcement || {}
  );

  useEffect(() => {
    if (announcement) {
      setEditedAnnouncement(announcement);
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAnnouncement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 후 리스트 갱신
  const handleUpdate = async () => {
    try {
      const updatedData = await updateAnnouncement(
        announcement.id,
        editedAnnouncement
      );

      if (!updatedData || updatedData.error) {
        throw new Error("서버에서 업데이트된 데이터를 반환하지 않았습니다.");
      }

      alert("공지사항이 성공적으로 수정되었습니다.");
      if (onUpdateTrigger && typeof onUpdateTrigger === "function") {
        onUpdateTrigger();
      } else {
        console.error("onUpdateTrigger 함수가 전달되지 않았습니다.");
      }

      setIsEditing(false);
      onClose();
    } catch (error) {
      alert("공지사항 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;
    try {
      const deleteResponse = await deleteAnnouncement(announcement.id);

      if (!deleteResponse || deleteResponse.error) {
        throw new Error("서버에서 삭제 결과를 반환하지 않았습니다.");
      }

      alert("공지사항이 성공적으로 삭제되었습니다.");
      if (onUpdateTrigger && typeof onUpdateTrigger === "function") {
        onUpdateTrigger();
      }

      onClose();
    } catch (error) {
      alert("공지사항 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="announcement-detail-form">
      <div className="announcement-detail-header">
        <h2>공지사항 상세</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <form>
        <div className="form-group">
          <label>공지 ID</label>
          <input type="text" name="id" value={announcement.id} readOnly />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={editedAnnouncement.title}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>작성자</label>
          <input
            type="text"
            value={`${announcement.authorName} (ID: ${announcement.authorId})`}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>부서</label>
          <input
            type="text"
            value={
              announcement.departmentId
                ? departmentMap[announcement.departmentId] || "알 수 없음"
                : "전체"
            }
            readOnly
          />
        </div>

        <div className="form-group">
          <label>직위</label>
          <input
            type="text"
            value={
              announcement.positionId
                ? positionMap[announcement.positionId] || "N/A"
                : "N/A"
            }
            readOnly
          />
        </div>

        <div className="form-group">
          <label>작성일시</label>
          <input
            type="text"
            value={new Date(announcement.createdAt).toLocaleString()}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>수정일시</label>
          <input
            type="text"
            value={
              announcement.updatedAt
                ? new Date(announcement.updatedAt).toLocaleString()
                : "-"
            }
            readOnly
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            name="content"
            value={editedAnnouncement.content}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="announcement-detail-buttons">
          {isAuthor && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="update-button"
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="delete-button"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AnnouncementDetail;
