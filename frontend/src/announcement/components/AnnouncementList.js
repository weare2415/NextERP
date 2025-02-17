import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { getAllAnnouncements, getAnnouncementsByPosition } from "../api/announcementApi";
import { getEmployeeById } from "../../HR/employee/api/employeeApi";
import AnnouncementDetail from "./AnnouncementDetail";
import Pagination from "../../common/component/Pagination";
import "../scss/AnnouncementList.scss";

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
  const departmentMap = { 1: "영업팀", 2: "회계팀", 3: "인사팀" };
  
  const AnnouncementList = forwardRef(
    ({ searchResults, onUpdateTrigger }, ref) => {
      const [announcements, setAnnouncements] = useState([]);
      const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const employeeId = useSelector((state) => state.loginSlice?.id || null);
      const [userDepartmentId, setUserDepartmentId] = useState(null);
      const [userPositionId, setUserPositionId] = useState(null);
      const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentPage, setCurrentPage] = useState(1);
      const pageSize = 10;
  
      // 직원 정보를 불러와 부서 ID와 직위 ID 저장
      useEffect(() => {
        if (employeeId) {
          getEmployeeById(employeeId)
            .then((employee) => {
              setUserDepartmentId(employee.departmentId);
              setUserPositionId(employee.positionId);
            })
            .catch((error) =>
              console.error("❌ 직원 정보 불러오기 실패:", error)
            );
        }
      }, [employeeId]);
  
      // 공지사항 가져오기
      useEffect(() => {
        fetchAnnouncements();
      }, []);
  
      // 검색 결과에 따른 필터링 처리
      useEffect(() => {
        if (searchResults && searchResults.length > 0) {
          console.log("🔍 검색 결과 적용:", searchResults);
          setFilteredAnnouncements(searchResults);
        } else {
          filterAnnouncements();
        }
      }, [searchResults, announcements, userDepartmentId, userPositionId]);
  
      // 공지사항 필터링 함수
      const filterAnnouncements = () => {
        if (userDepartmentId === null || userPositionId === null) return;
  
        const filtered = announcements.filter((announcement) => {
          return (
            (announcement.departmentId === null ||
              announcement.departmentId === userDepartmentId) &&
            (announcement.positionId === userPositionId ||
              announcement.positionId === null)
          );
        });
  
        setFilteredAnnouncements(filtered);
      };
  
      // 공지사항을 불러오는 함수 (직위 ID에 따라 필터링)
      const fetchAnnouncements = async () => {
        try {
          setLoading(true);
          let data = [];
  
          if (userPositionId) {
            data = await getAnnouncementsByPosition(userPositionId);
          } else {
            data = await getAllAnnouncements();
          }
  
          const sortedData = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAnnouncements(sortedData);
          filterAnnouncements();
        } catch (error) {
          console.error("❌ 공지사항 불러오기 실패:", error);
          setError("공지사항을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };
  
      // 페이지네이션 처리
      const paginate = (announcements, currentPage, pageSize) => {
        const startIndex = (currentPage - 1) * pageSize;
        return announcements.slice(startIndex, startIndex + pageSize);
      };
  
      const paginatedAnnouncements = paginate(
        filteredAnnouncements,
        currentPage,
        pageSize
      );
  
      // 공지사항 내용 클릭 시 모달 열기
      const handleContentClick = (announcement, e) => {
        if (e.target.tagName === "TD" && e.target.cellIndex === 1) {
          setSelectedAnnouncement(announcement);
          setIsModalOpen(true);
        }
      };
  
      // 부모에서 fetchAnnouncements 실행 가능하도록 설정
      useImperativeHandle(ref, () => ({
        fetchAnnouncements,
      }));
  
      return (
        <div className="announcement-list-wrapper">
          {loading && <p>⏳ 불러오는 중...</p>}
          {error && <p className="error-message">{error}</p>}
  
          <div className="announcement-table-section">
            <table>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>내용</th>
                  <th>작성자</th>
                  <th>부서</th>
                  <th>직위</th>
                  <th>작성일시</th>
                  <th>수정일시</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAnnouncements.length > 0 ? (
                  paginatedAnnouncements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      onClick={(e) => handleContentClick(announcement, e)}
                    >
                      <td>{announcement.title}</td>
                      <td>{announcement.content}</td>
                      <td>{announcement.authorName}</td>
                      <td>
                        {announcement.departmentId
                          ? departmentMap[announcement.departmentId] ||
                            "알 수 없음"
                          : "전체"}
                      </td>
                      <td>
                        {announcement.positionId
                          ? positionMap[announcement.positionId] || "N/A"
                          : "N/A"}
                      </td>
                      <td>{new Date(announcement.createdAt).toLocaleString()}</td>
                      <td>
                        {announcement.updatedAt
                          ? new Date(announcement.updatedAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
          {/* 페이지네이션 컴포넌트 */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredAnnouncements.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
  
          {isModalOpen && selectedAnnouncement && (
            <div className="modal-overlay">
              <AnnouncementDetail
                announcement={selectedAnnouncement}
                onClose={() => setIsModalOpen(false)}
                onUpdateTrigger={fetchAnnouncements}
              />
            </div>
          )}
        </div>
      );
    }
  );
  
  export default AnnouncementList;
  