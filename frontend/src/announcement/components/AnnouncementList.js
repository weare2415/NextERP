import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector } from "react-redux";
import { getAllAnnouncements } from "../api/announcementApi";
import { getEmployeeById } from "../../employee/api/employeeApi";
import "../scss/AnnouncementList.scss";
import AnnouncementDetail from "./AnnouncementDetail";

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
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      if (employeeId) {
        getEmployeeById(employeeId)
          .then((employee) => {
            setUserDepartmentId(employee.departmentId);
          })
          .catch((error) =>
            console.error("❌ 직원 정보 불러오기 실패:", error)
          );
      }
    }, [employeeId]);

    useEffect(() => {
      fetchAnnouncements();
    }, []);

    // ✅ 검색 결과를 반영
    useEffect(() => {
      if (searchResults && searchResults.length > 0) {
        console.log("🔍 검색 결과 적용:", searchResults);
        setFilteredAnnouncements(searchResults);
      } else {
        filterAnnouncements();
      }
    }, [searchResults, announcements, userDepartmentId]);

    const filterAnnouncements = () => {
      if (userDepartmentId === null) return;

      const filtered = announcements.filter(
        (announcement) =>
          // ✅ 전체 공지는 모든 부서에서 볼 수 있음
          announcement.departmentId === null ||
          // ✅ 같은 부서의 공지만 볼 수 있음
          announcement.departmentId === userDepartmentId
      );

      setFilteredAnnouncements(filtered);
    };

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAllAnnouncements();
        console.log("📌 최신 데이터:", data);

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

    // ✅ "내용" 클릭 시만 모달 열기
    const handleContentClick = (announcement, e) => {
      // "내용" 부분만 클릭 시 모달 열리도록 처리
      if (e.target.tagName === "TD" && e.target.cellIndex === 1) {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
      }
    };

    // ✅ 부모에서 `fetchAnnouncements()` 실행 가능하도록 설정
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
              {/* 데이터가 있을 때만 행을 표시 */}
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
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
                // 데이터가 없을 때는 "등록된 공지사항이 없습니다." 메시지 표시
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedAnnouncement && (
          <div className="modal-overlay">
            <AnnouncementDetail
              announcement={selectedAnnouncement}
              onClose={() => setIsModalOpen(false)}
              onUpdateTrigger={fetchAnnouncements} // `fetchAnnouncements` 함수 직접 전달
            />
          </div>
        )}
      </div>
    );
  }
);

export default AnnouncementList;
