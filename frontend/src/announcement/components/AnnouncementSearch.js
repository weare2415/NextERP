import React, { useState, useEffect } from "react";
import {
  getAllAnnouncements,
  getAnnouncementsByDepartment,
  getAnnouncementsByPosition,
} from "../api/announcementApi";
import { useSearchParams } from "react-router-dom";
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
  const [searchType, setSearchType] = useState("title"); // 기본적으로 제목으로 검색
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [searchParams, setSearchParams] = useState({
    searchType: "",
    searchTerm: "",
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAllAnnouncements();
      setAllAnnouncements(data); // 모든 공지사항 데이터를 상태에 저장
      onSearch(data); // 초기 데이터 로딩 시 검색 결과를 바로 출력
    };
    fetchAnnouncements();
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행되도록 설정

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        console.log("검색어가 비어 있어 결과를 반환하지 않습니다.");
        onSearch([]); // 빈 배열을 전달
        return;
      }

      let filteredResults = [];
      console.log(`🔍 검색 실행됨: ${searchTerm}`);

      if (searchType === "title") {
        // 제목 검색
        filteredResults = allAnnouncements.filter((announcement) =>
          announcement.title.includes(searchTerm)
        );
      } else if (searchType === "author") {
        // 작성자 검색
        filteredResults = allAnnouncements.filter((announcement) =>
          announcement.authorName.includes(searchTerm)
        );
      } else if (searchType === "department") {
        // 부서 검색
        const departmentId = Object.keys(departmentMap).find(
          (key) => departmentMap[key] === searchTerm
        );
        if (departmentId) {
          console.log(`📌 부서 검색 (${searchTerm} -> ID ${departmentId})`);
          // DB에서 부서별 공지사항을 검색
          filteredResults = await getAnnouncementsByDepartment(
            Number(departmentId)
          ).catch(() => []);
        }
      } else if (searchType === "position") {
        // 직위 검색
        const positionId = Object.keys(positionMap).find(
          (key) => positionMap[key] === searchTerm
        );
        if (positionId) {
          console.log(`📌 직위 검색 (${searchTerm} -> ID ${positionId})`);
          // DB에서 직위별 공지사항을 검색
          filteredResults = await getAnnouncementsByPosition(
            Number(positionId)
          ).catch(() => []);
        }
      }

      // 중복 데이터 제거 (ID 기준)
      const uniqueResults = Array.from(
        new Set(filteredResults.map((a) => a.id))
      ).map((id) => filteredResults.find((a) => a.id === id));

      console.log("🔄 최종 검색 결과:", uniqueResults);
      onSearch(uniqueResults);
    } catch (error) {
      console.error("❌ 공지사항 검색 실패:", error);
    }
  };

  return (
    <div className="announcement-search">
      <form onSubmit={handleSearch} className="announcement-search-form ">
        <select
          name="searchType"
          value={useSearchParams.searchType}
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />
        <button type="submit">검색</button>
      </form>
    </div>
  );
};

export default AnnouncementSearch;
