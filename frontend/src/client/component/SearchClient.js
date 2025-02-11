import React, { useState } from 'react';
import { getClientById, getAllClients, getClientsByEmployeeId } from '../api/clientApi';
import { getEmployeeByName } from '../../member/api/memberApi';
import '../component/scss/SearchClient.scss';

const SearchClient = ({ onSearchResults }) => {
  const [searchParams, setSearchParams] = useState({
    searchType: 'clientName', // 기본값: 거래처 명 검색
    searchTerm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data = [];

      if (searchParams.searchType === 'clientCode') {
        // ✅ 거래처 코드로 검색
        const client = await getClientById(searchParams.searchTerm);
        data = client ? [client] : [];
      } else if (searchParams.searchType === 'clientName') {
        // ✅ 거래처 명으로 검색
        const allClients = await getAllClients();
        data = allClients.filter(client => 
          client.clientName.includes(searchParams.searchTerm)
        );
      } else if (searchParams.searchType === 'employeeName') {
        // ✅ 영업 담당자 이름으로 검색 -> 먼저 employeeId를 가져온 후 client 목록 조회
        const employee = await getEmployeeByName(searchParams.searchTerm);
      console.log("검색된 직원 정보:", employee); // 직원 정보 확인
      if (employee && employee.id) {
        data = await getClientsByEmployeeId(employee.id);
        console.log("해당 직원의 거래처 목록:", data); // 거래처 목록 확인
      } else {
        console.log("유효한 직원 정보가 없습니다.");
        data = [];
      }
    }

      // 검색 결과를 부모(ListClient)로 전달
      onSearchResults(data);
    } catch (err) {
      console.error('검색 오류:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-client-container">
      <form onSubmit={handleSearch} className="search-client-form">
        <select
          name="searchType"
          value={searchParams.searchType}
          onChange={handleInputChange}
        >
          <option value="clientName">기업명</option>
          <option value="clientCode">거래처 코드</option>
          <option value="employeeName">영업 담당자</option>
        </select>

        <input
          type="text"
          name="searchTerm"
          placeholder="검색어를 입력하세요"
          value={searchParams.searchTerm}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />

        <button type="submit">검색</button>
      </form>

      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SearchClient;
