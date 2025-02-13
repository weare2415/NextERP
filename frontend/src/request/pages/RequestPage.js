import React, { useEffect, useState } from "react";
import RequestClient from "../component/RequestClient";
import "./RequestPage.scss";
import BasicLayout from "../../common/pages/BasicLayout";
import ListRequestClient from "../component/ListRequestClient";
import { getPendingClients } from "../../client/api/clientApi";

const RequestPage = () => {
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);

  // 클라이언트 목록을 가져오는 함수
  const fetchClients = async () => {
    try {
      const data = await getPendingClients();
      if (data && Array.isArray(data.content)) {
        setClients([...data.content].reverse());
      } else if (Array.isArray(data)) {
        setClients([...data].reverse());
      } else {
        console.error("데이터 형식이 올바르지 않습니다:", data);
        setClients([]);
      }
    } catch (error) {
      console.error("거래처 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchClients();
  }, []);

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
