import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector } from "react-redux";
import { getAllAnnouncements } from "../api/announcementApi";
import { getEmployeeById } from "../../HR/employee/api/employeeApi";
import AnnouncementDetail from "./AnnouncementDetail";
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
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 직원 정보를 불러와 부서 ID와 직위 ID 저장
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

    // 공지사항 가져오기
    useEffect(() => {
      console.log("🔄 useEffect 실행됨, onUpdateTrigger:", onUpdateTrigger);
      fetchAnnouncements();
    }, [onUpdateTrigger]);

    // 검색 결과에 따른 필터링 처리
    useEffect(() => {
      if (searchResults && searchResults.length > 0) {
        console.log("🔍 검색 결과 적용:", searchResults);
        setFilteredAnnouncements(searchResults);
      } else {
        filterAnnouncements();
      }
    }, [announcements]);

    useEffect(() => {
      if (userDepartmentId !== null) {
        filterAnnouncements();
      }
    }, [userDepartmentId]);

    const filterAnnouncements = () => {
      if (userDepartmentId === null) return;

      const filtered = announcements.filter(
        (announcement) =>
          announcement.departmentId === null ||
          announcement.departmentId === userDepartmentId
      );

      console.log("📌 필터링된 데이터:", filtered);

      setFilteredAnnouncements(filtered.length > 0 ? filtered : announcements);
    };

    useEffect(() => {
      console.log("📢 화면에 표시될 데이터:", filteredAnnouncements);
    }, [filteredAnnouncements]);

    // 공지사항을 불러오는 함수 (직위 ID에 따라 필터링)
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAllAnnouncements();
        console.log("📌 최신 데이터:", data);

        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements([...sortedData]);
        setFilteredAnnouncements([...sortedData]);
      } catch (error) {
        console.error("❌ 공지사항 불러오기 실패:", error);
        setError("공지사항을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    const handleAnnouncementClick = (announcement) => {
      setSelectedAnnouncement(announcement);
      setIsModalOpen(true);
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
          {filteredAnnouncements.length > 0 ? (
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
                {filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id}>
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
                    <td>
                      {announcement.createdAt
                        ? new Date(announcement.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {announcement.updatedAt
                        ? new Date(announcement.updatedAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && !error && <p>📌 등록된 공지사항이 없습니다.</p>
          )}

          {isModalOpen && selectedAnnouncement && (
            <AnnouncementDetail
              announcement={selectedAnnouncement}
              onClose={() => setIsModalOpen(false)}
              onUpdateTrigger={fetchAnnouncements} // ✅ `fetchAnnouncements` 함수 직접 전달
            />
          )}
        </div>
      </div>
    );
  }
);

export default AnnouncementList;
