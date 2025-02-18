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

const AnnouncementSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      let searchResults = [];

      console.log(`🔍 검색 실행됨: ${searchTerm}`);

      // ✅ 입력값이 없으면 전체 공지 조회
      if (!searchTerm.trim()) {
        searchResults = await getAllAnnouncements();
        console.log("📌 전체 공지 불러옴:", searchResults);
      } else {
        const allAnnouncements = await getAllAnnouncements();

        // ✅ 제목, 작성자 검색
        const filteredResults = allAnnouncements.filter(
          (announcement) =>
            announcement.title.includes(searchTerm) ||
            announcement.authorName.includes(searchTerm)
        );

        searchResults = [...filteredResults];

        console.log("🔎 제목/작성자 검색 결과:", filteredResults);

        // ✅ 부서 한글 검색 (한글 입력 시 부서 ID로 변환)
        const departmentId = Object.keys(departmentMap).find(
          (key) => departmentMap[key] === searchTerm
        );
        if (departmentId) {
          console.log(`📌 부서 검색 (${searchTerm} -> ID ${departmentId})`);
          const departmentResults = await getAnnouncementsByDepartment(
            Number(departmentId)
          ).catch(() => []);
          searchResults = [...searchResults, ...departmentResults];
        }

        // ✅ 직위 한글 검색 (한글 입력 시 직위 ID로 변환)
        const positionId = Object.keys(positionMap).find(
          (key) => positionMap[key] === searchTerm
        );
        if (positionId) {
          console.log(`📌 직위 검색 (${searchTerm} -> ID ${positionId})`);
          const positionResults = await getAnnouncementsByPosition(
            Number(positionId)
          ).catch(() => []);
          searchResults = [...searchResults, ...positionResults];
        }
      }

      // ✅ 중복 데이터 제거
      const uniqueResults = Array.from(
        new Set(searchResults.map((a) => a.id))
      ).map((id) => searchResults.find((a) => a.id === id));

      console.log("🔄 최종 검색 결과:", uniqueResults);
      onSearch(uniqueResults);
    } catch (error) {
      console.error("❌ 공지사항 검색 실패:", error);
    }
  };

  return (
    <div className="announcement-search">
      <form onSubmit={handleSearch} className="announcement-search-form">
        <input
          type="text"
          placeholder="작성자, 제목, 부서명, 직위명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </form>
    </div>
  );
};

export default AnnouncementSearch;
