import React, { useState } from "react";
import {
  getAllAnnouncements,
  getAnnouncementsByDepartment,
  getAnnouncementsByPosition,
} from "../api/announcementApi";
import "../scss/AnnouncementSearch.scss";
import { div } from "@tensorflow/tfjs";

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

      // ✅ 전체 공지를 가져올 때 첫 페이지의 100개 데이터를 가져와 필터링
      const response = await getAllAnnouncements(0, 100);
      const allAnnouncements = response.content || []; // ✅ `content` 배열 사용

      console.log("📌 전체 공지 불러옴:", allAnnouncements);

      if (!Array.isArray(allAnnouncements)) {
        console.error(
          "🚨 allAnnouncements가 배열이 아닙니다!",
          allAnnouncements
        );
        return;
      }

      if (searchTerm.trim()) {
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
          const departmentResponse = await getAnnouncementsByDepartment(
            Number(departmentId)
          );
          const departmentResults = departmentResponse.content || [];
          searchResults = [...searchResults, ...departmentResults];
        }

        // ✅ 직위 한글 검색 (한글 입력 시 직위 ID로 변환)
        const positionId = Object.keys(positionMap).find(
          (key) => positionMap[key] === searchTerm
        );
        if (positionId) {
          console.log(`📌 직위 검색 (${searchTerm} -> ID ${positionId})`);
          const positionResponse = await getAnnouncementsByPosition(
            Number(positionId)
          );
          const positionResults = positionResponse.content || [];
          searchResults = [...searchResults, ...positionResults];
        }
      } else {
        searchResults = allAnnouncements;
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
    <div className="announcement-search-section">
      <form className="announcement-search-form">
        <input
          type="text"
          placeholder="작성자, 제목, 부서명, 직위명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="button" onClick={handleSearch}>
          검색
        </button>
      </form>
    </div>
  );
};

export default AnnouncementSearch;
