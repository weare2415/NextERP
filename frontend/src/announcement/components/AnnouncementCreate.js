import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux에서 로그인 정보 가져오기
import { createAnnouncement } from "../api/announcementApi"; // API 호출 함수
import { getEmployeeById } from "../../HR/employee/api/employeeApi"; //  기존 API 활용
import "../scss/AnnouncementCreate.scss"; //  스타일 적용

const AnnouncementCreate = ({ onClose, onAddSuccess }) => {
  //  onClose 부모에서 전달받음
  const employeeId = useSelector((state) => state.loginSlice?.id || null);
  const [employeeData, setEmployeeData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isGlobalAnnouncement, setIsGlobalAnnouncement] = useState(false);

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

  //  부서 ID → 한글 부서명 변환 매핑
  const departmentMap = {
    1: "영업팀",
    2: "회계팀",
    3: "인사팀",
  };

  useEffect(() => {
    if (employeeId) {
      getEmployeeById(employeeId)
        .then((employee) => {
          console.log("📌 직원 데이터 확인:", employee); //  디버깅용 로그 추가
          setEmployeeData(employee);

          const { departmentId, positionId } = employee;

          const canCreateDepartmentAnnouncement = positionId >= 5;
          const canCreateGlobalAnnouncement = positionId >= 7;

          setIsAuthorized(canCreateDepartmentAnnouncement);
          setIsGlobalAnnouncement(canCreateGlobalAnnouncement);
        })
        .catch((error) => console.error("직원 정보 가져오기 실패:", error));
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeData) {
      setAnnouncement((prev) => ({
        ...prev,
        departmentId: employeeData.departmentId || null,
        positionId: employeeData.positionId || null,
      }));
    }
  }, [employeeData]); //  employeeData가 업데이트될 때 announcement 상태 변경

  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    authorId: employeeId || "",
    departmentId: null,
    positionId: null,
    isGlobal: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setAnnouncement((prev) => ({ ...prev, isGlobal: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthorized) {
      alert("공지사항 작성 권한이 없습니다. (차장 이상만 가능)");
      return;
    }

    if (announcement.isGlobal && !isGlobalAnnouncement) {
      alert("전체 공지사항은 이사 이상만 작성할 수 있습니다.");
      return;
    }

    try {
      const newAnnouncement = {
        title: announcement.title,
        content: announcement.content,
        authorId: employeeId,
        departmentId: announcement.isGlobal ? null : employeeData?.departmentId,
        positionId: employeeData?.positionId,
        createdAt: new Date().toISOString(),
      };

      await createAnnouncement(newAnnouncement);
      alert("공지사항이 성공적으로 생성되었습니다.");

      //  리스트 갱신 함수 호출
      onAddSuccess();

      setAnnouncement({
        title: "",
        content: "",
        authorId: employeeId,
        departmentId: null,
        positionId: null,
        isGlobal: false,
      });

      onClose(); //  창 닫기
    } catch (error) {
      alert("공지사항 생성에 실패했습니다.");
      console.error("❌ 공지사항 생성 실패:", error);
    }
  };

  return (
    <div className="modal-overlay"  onClick={(e) => e.stopPropagation()}>
      <div className="announcement-create-form">
      <div className="announcement-create-header">
        <h2>공지사항 생성</h2>
        <button className="close-button" onClick={onClose}>X</button>
        </div>
        {!employeeId ? (
          <p className="error-message">⚠️ 로그인이 필요합니다.</p>
        ) : !isAuthorized ? (
          <p className="error-message">
            ⚠️ 공지사항을 작성할 권한이 없습니다. (차장 이상만 가능)
          </p>
        ) : (
          <form className="create-announcement-input" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="제목"
              value={announcement.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="content"
              placeholder="내용"
              value={announcement.content}
              onChange={handleChange}
              required
            />

            {/* 전체 공지사항 체크박스 */}
            {isGlobalAnnouncement && (
                  <div className="checkbox-container">
                    <label>
                      <input
                        type="checkbox"
                        checked={announcement.isGlobal}
                        onChange={handleCheckboxChange}
                      />
                      전체 공지사항으로 등록 (이사 이상만 가능)
                    </label>
                  </div>
                )}

            {/* 로그인된 사용자 정보 자동 입력 (보이지만 수정 불가) */}
            <input
              type="hidden"
              name="authorId"
              value={announcement.authorId}
              readOnly
            />
            <input
              type="hidden"
              name="departmentId"
              value={
                announcement.departmentId
                  ? departmentMap[announcement.departmentId] || "전체"
                  : "전체"
              }
              readOnly
            />

            <input
              type="hidden"
              name="positionId"
              value={
                announcement.positionId
                  ? positionMap[announcement.positionId] || "N/A"
                  : "N/A"
              }
              readOnly
            />

            <div className="button-group">
              <button type="submit">공지 생성</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCreate;
