import React, { useEffect, useState } from "react";
import RequestClient from "../component/RequestClient";
import "./scss/RequestPage.scss";
import BasicLayout from "../../../common/pages/BasicLayout";
import ListRequestClient from "../component/ListRequestClient";
import { getPendingClients } from "../api/clientApi";
import Pagination from "../../../common/component/Pagination";

const RequestPage = () => {
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

   // 클라이언트 목록을 가져오는 함수
  const fetchClients = async (page) => {
    try {
      const data = await getPendingClients(page, size);
      setClients([...data.content].reverse());
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("거래처 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchClients(page);
  }, [page]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowDetailForm(true);
  };

  const handleUpdateSuccess = (approvedClientCode) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.clientCode !== approvedClientCode)
    );
    setShowDetailForm(false);
    setSelectedClient(null);
  };

  return (
    <BasicLayout>
      <div className="request-client-page-container">
        <div className="page-header">
          <h1>거래처 승인 요청 관리</h1>
        </div>
        
        <ListRequestClient
          clients={clients}
          onClientSelect={handleClientClick}
           />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        {showDetailForm && selectedClient && (
          <div className="modal-overlay">
            <RequestClient
              client={selectedClient}
              onClose={() => {
                setShowDetailForm(false);
                setSelectedClient(null);
              }}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default RequestPage;