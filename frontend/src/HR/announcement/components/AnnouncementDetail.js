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

const AnnouncementDetail = ({ announcement, onClose, onUpdateTrigger }) => { // ✅ `onUpdateSuccess` 대신 `onUpdateTrigger` 사용
    const employeeId = useSelector((state) => state.loginSlice?.id || null);
    const isAuthor = Number(announcement?.authorId) === Number(employeeId);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnnouncement, setEditedAnnouncement] = useState(announcement || {});

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

    // ✅ 수정 후 리스트 갱신
    const handleUpdate = async () => {
        try {
            console.log("📤 업데이트 요청 데이터:", editedAnnouncement);
            const updatedData = await updateAnnouncement(announcement.id, editedAnnouncement);
            console.log("✅ 서버 응답 데이터:", updatedData);
    
            if (!updatedData || updatedData.error) { 
                throw new Error("서버에서 업데이트된 데이터를 반환하지 않았습니다.");
            }
    
            alert("✅ 공지사항이 성공적으로 수정되었습니다.");
            if (onUpdateTrigger && typeof onUpdateTrigger === "function") {
                console.log("🔄 fetchAnnouncements 실행됨");
                onUpdateTrigger(); // ✅ 이제 `fetchAnnouncements()`가 실행됨
            } else {
                console.error("🚨 fetchAnnouncements가 전달되지 않음!", onUpdateTrigger);
            }
            
            
            setIsEditing(false);
            onClose(); // ✅ 모달 닫기 추가
        } catch (error) {
            console.error("❌ 공지 수정 실패:", error.response?.data || error.message);
            alert("❌ 공지사항 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm("📢 공지사항을 삭제하시겠습니까?")) return;
        try {
            console.log("🗑️ 삭제 요청 ID:", announcement.id);
            const deleteResponse = await deleteAnnouncement(announcement.id);
            console.log("✅ 삭제 응답:", deleteResponse);
    
            if (!deleteResponse || deleteResponse.error) {
                throw new Error("서버에서 삭제 결과를 반환하지 않았습니다.");
            }
    
            alert("📌 공지사항이 성공적으로 삭제되었습니다.");
            if (onUpdateTrigger && typeof onUpdateTrigger === "function") {
                console.log("🔄 fetchAnnouncements 실행됨");
                onUpdateTrigger(); // ✅ 이제 `fetchAnnouncements()`가 실행됨
            } else {
                console.error("🚨 fetchAnnouncements가 전달되지 않음!", onUpdateTrigger);
            }
            
    
            onClose(); // ✅ 모달 닫기 추가
        } catch (error) {
            console.error("❌ 공지 삭제 실패:", error.response?.data || error.message);
            alert("❌ 공지사항 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };
    
    

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📌 공지사항 상세</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <div className="announcement-detail">
                        <p><strong>공지 ID:</strong> {announcement.id}</p>
                        {isEditing ? (
                            <>
                                <div className="form-group">
                                    <label><strong>제목:</strong></label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={editedAnnouncement.title} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label><strong>내용:</strong></label>
                                    <textarea 
                                        name="content" 
                                        value={editedAnnouncement.content} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <p><strong>제목:</strong> {announcement.title}</p>
                                <p><strong>내용:</strong> {announcement.content}</p>
                            </>
                        )}
                        <p><strong>작성자:</strong> {announcement.authorName} (ID: {announcement.authorId})</p>
                        <p><strong>부서:</strong> {announcement.departmentId ? departmentMap[announcement.departmentId] || "알 수 없음" : "전체"}</p>
                        <p><strong>직위:</strong> {announcement.positionId ? positionMap[announcement.positionId] || "N/A" : "N/A"}</p>
                        <p><strong>작성일시:</strong> {new Date(announcement.createdAt).toLocaleString()}</p>
                        <p><strong>수정일시:</strong> {announcement.updatedAt ? new Date(announcement.updatedAt).toLocaleString() : "-"}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    {isAuthor && (
                        isEditing ? (
                            <>
                                <button className="save-btn" onClick={handleUpdate}>저장</button>
                                <button className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
                            </>
                        ) : (
                            <>
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
                                <button className="delete-btn" onClick={handleDelete}>삭제</button>
                            </>
                        )
                    )}
                    <button className="close-btn" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetail;
