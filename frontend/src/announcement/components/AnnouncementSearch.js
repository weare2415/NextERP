import React, { useEffect, useState } from "react";
import {
    getAllAnnouncements,
    getAnnouncementsByDepartment,
    getAnnouncementsByPosition
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
    const [searchParams, setSearchParams] = useState({
      searchType: "title", // 기본값
      searchTerm: "",
    });
    const [allAnnouncements, setAllAnnouncements] = useState([]);
  
    useEffect(() => {
      const fetchAnnouncements = async () => {
        const data = await getAllAnnouncements();
        setAllAnnouncements(data);
        onSearch(data);
      };
      fetchAnnouncements();
    }, []);
  
    const handleInputChange = (e) => {
      setSearchParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleSearch = async (e) => {
      e.preventDefault();
      const { searchType, searchTerm } = searchParams;
      if (!searchTerm.trim()) {
        onSearch([]);
        return;
      }
  
      try {
        let filteredResults = [];
  
        switch (searchType) {
          case "title":
            filteredResults = allAnnouncements.filter((a) =>
              a.title.includes(searchTerm)
            );
            break;
          case "author":
            filteredResults = allAnnouncements.filter((a) =>
              a.authorName.includes(searchTerm)
            );
            break;
          case "department":
            const departmentId = Object.keys(departmentMap).find(
              (key) => departmentMap[key] === searchTerm
            );
            if (departmentId)
              filteredResults = await getAnnouncementsByDepartment(
                Number(departmentId)
              );
            break;
          case "position":
            const positionId = Object.keys(positionMap).find(
              (key) => positionMap[key] === searchTerm
            );
            if (positionId)
              filteredResults = await getAnnouncementsByPosition(
                Number(positionId)
              );
            break;
          default:
            break;
        }
  
        onSearch(filteredResults || []);
      } catch (error) {
        console.error("검색 오류:", error);
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
          <div className="search-input-wrapper">
  
          <input
            type="text"
            name="searchTerm"
            placeholder="검색어를 입력하세요."
            value={searchParams.searchTerm}
            onChange={handleInputChange}
          />
          </div>
          <button type="submit">검색</button>
        </form>
      </div>
    );
  };
  
  export default AnnouncementSearch;
  