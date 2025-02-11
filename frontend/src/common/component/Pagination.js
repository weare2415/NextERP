import React from "react";
import './Pagination.scss';

/* Pagination 컴포넌트 사용법
  1. 해당 부모 페이지에 useState 셋업
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  2. async 보낼때 page 포함해서 보내야함
  예시 :
        const fetchClients = async (page) => {
          try {
            const data = await getAllClients(page, size);
            setClients(data.content);
            setTotalPages(data.totalPages);
          } catch (error) {
            console.error("Error fetching clients:", error);
          }
        };

  3. return 구현하는 곳에
  {!searchResults && totalPages > 1 && (
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        )}
  // !searchResults && totalPaes > 1 이 부분에서 searchResults 는 상황에 따라 다르게 설정할 수 있음
*/

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = 10; // 한 번에 표시할 페이지 개수
  const startPage = Math.floor(currentPage / maxPagesToShow) * maxPagesToShow;
  const endPage = Math.min(startPage + maxPagesToShow, totalPages);

  return (
      <div className="pagination">
        {/* 이전 10 페이지 */}
        <button
            onClick={() => onPageChange(startPage - 1)}
            disabled={startPage === 0}
        >
          {"<<"}
        </button>

        {/* 개별 페이지 버튼 */}
        <div className="page-numbers">
        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((page) => (
            <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
        ))}
        </div>

        {/* 다음 10 페이지 */}
        <button
            onClick={() => onPageChange(endPage)}
            disabled={endPage >= totalPages}
        >
          {">>"}
        </button>
      </div>
  );
};

export default Pagination;