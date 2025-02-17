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
  // searchParams 상태 정의 (검색 유형과 검색어 관리)
  const [searchParams, setSearchParams] = useState({
    searchType: "title", // 기본값
    searchTerm: "",
  });

  // 입력값을 처리하는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 검색 실행 함수
  const handleSearch = async (e) => {
    e.preventDefault();

    const { searchType, searchTerm } = searchParams;
    try {
      let searchResults = [];

      console.log(`🔍 검색 실행됨: ${searchTerm}`);

      // 검색어가 없으면 전체 공지 조회
      if (!searchTerm.trim()) {
        searchResults = await getAllAnnouncements();
        console.log("📌 전체 공지 불러옴:", searchResults);
      } else {
        const allAnnouncements = await getAllAnnouncements();

        // 제목과 작성자 검색 시, 작성자 검색은 announcement.authorName 필드 사용
        if (searchType === "title" || searchType === "author") {
          searchResults = allAnnouncements.filter((announcement) => {
            const fieldValue =
              searchType === "author"
                ? announcement.authorName
                : announcement.title;
            return (
              fieldValue &&
              fieldValue.toLowerCase().includes(searchTerm.toLowerCase().trim())
            );
          });
          console.log(`🔎 ${searchType} 검색 결과:`, searchResults);
        }

        // 부서 검색 (대소문자, 공백 무시)
        if (searchType === "department") {
          const departmentId = Object.keys(departmentMap).find(
            (key) =>
              departmentMap[key].toLowerCase() ===
              searchTerm.toLowerCase().trim()
          );
          if (departmentId) {
            console.log(`📌 부서 검색 (${searchTerm} -> ID ${departmentId})`);
            const departmentResults = await getAnnouncementsByDepartment(
              Number(departmentId)
            );
            searchResults = [...departmentResults];
            console.log("🔎 부서 검색 결과:", departmentResults);
          } else {
            searchResults = [];
          }
        }

        // 직위 검색 (대소문자, 공백 무시)
        if (searchType === "position") {
          const positionId = Object.keys(positionMap).find(
            (key) =>
              positionMap[key].toLowerCase() === searchTerm.toLowerCase().trim()
          );
          if (positionId) {
            console.log(`📌 직위 검색 (${searchTerm} -> ID ${positionId})`);
            const positionResults = await getAnnouncementsByPosition(
              Number(positionId)
            );
            searchResults = [...positionResults];
            console.log("🔎 직위 검색 결과:", positionResults);
          } else {
            searchResults = [];
          }
        }
      }

      // 중복 데이터 제거
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
        <select
          name="searchType"
          value={searchParams.searchType}
          onChange={handleInputChange}
        >
          <option value="title">제목</option>
          <option value="author">작성자</option>
          <option value="department">부서명</option>
          <option value="position">직위명</option>
        </select>

        <input
          type="text"
          name="searchTerm"
          placeholder="검색어를 입력하세요."
          value={searchParams.searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">검색</button>
      </form>
    </div>
  );
};

export default AnnouncementSearch;
