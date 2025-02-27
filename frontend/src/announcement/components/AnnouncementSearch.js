import React, { useState } from "react";
import {
  getAllAnnouncements,
  getAnnouncementsByDepartment,
  getAnnouncementsByPosition,
} from "../api/announcementApi";
import "../scss/AnnouncementSearch.scss";

const departmentMap = {
  1: "영업팀",
  2: "회계팀",
  3: "인사팀",
};

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

const pageSize = 10; // ✅ 한 페이지당 10개씩 표시

const AnnouncementSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title"); // 기본값: 제목
  const [searchResults, setSearchResults] = useState([]);

  // ✅ 검색 실행
  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // 검색어가 없으면 실행 안 함

    try {
      let results = [];
      const trimmedSearchTerm = searchTerm.trim();
      console.log(
        `🔍 검색 실행됨: ${trimmedSearchTerm}, 카테고리: ${searchCategory}`
      );

      const allAnnouncementsResponse = await getAllAnnouncements(0, 1000);
      const allAnnouncements = allAnnouncementsResponse.content || [];

      switch (searchCategory) {
        case "title":
          results = allAnnouncements.filter((a) =>
            a.title.includes(trimmedSearchTerm)
          );
          break;

        case "authorName":
          results = allAnnouncements.filter((a) =>
            a.authorName.includes(trimmedSearchTerm)
          );
          break;

        case "department":
          if (trimmedSearchTerm === "전체") {
            // "전체"가 제목이나 내용에 포함된 공지사항만 검색
            results = allAnnouncements.filter(
              (a) => a.title.includes("전체") || a.content.includes("전체")
            );
          } else {
            const departmentId = Object.keys(departmentMap).find(
              (key) => departmentMap[key] === trimmedSearchTerm
            );
            if (departmentId) {
              const departmentResults = await getAnnouncementsByDepartment(
                Number(departmentId),
                0,
                1000
              ).catch((err) => {
                console.error("❌ 부서 검색 실패:", err);
                return { content: [] };
              });
              results = departmentResults.content || [];
            }
          }
          break;

        case "position":
          const positionId = Object.keys(positionMap).find(
            (key) => positionMap[key] === trimmedSearchTerm
          );
          if (positionId) {
            const positionResults = await getAnnouncementsByPosition(
              positionId,
              0,
              1000
            ).catch((err) => {
              console.error("❌ 직위 검색 실패:", err);
              return { content: [] };
            });
            results = positionResults.content || [];
          }
          break;

        default:
          console.warn("⚠️ 알 수 없는 필터 옵션");
      }

      const uniqueResults = Array.from(new Set(results.map((a) => a.id))).map(
        (id) => results.find((a) => a.id === id)
      );

      console.log("🔄 중복 제거 후 최종 검색 결과:", uniqueResults);
      setSearchResults(uniqueResults);

      onSearch(uniqueResults.slice(0, pageSize));
    } catch (error) {
      console.error("❌ 공지사항 검색 실패:", error);
    }
  };

  return (
    <div className="announcement-search-section">
      <div className="search-container">
        {/* 검색 필터 선택 */}
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="search-category-select"
        >
          <option value="title">제목</option>
          <option value="authorName">작성자</option>
          <option value="department">부서명</option>
          <option value="position">직위명</option>
        </select>

        {/* 검색 입력창 */}
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        {/* 검색 버튼 */}
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default AnnouncementSearch;
