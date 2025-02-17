import React, { useEffect, useState } from "react";
import CreateClient from "../component/CreateClient";
import ClientDetail from "../component/DetailClient";
import ListClient from "../component/ListClient";
import "./scss/ClientPage.scss";
import BasicLayout from "../../../common/pages/BasicLayout";
import { getAllClients } from "../api/clientApi";
import SearchClient from "../component/SearchClient";
import Pagination from "../../../common/component/Pagination";

const ClientPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchClients(page);
  }, [page]);

  // 전체 거래처 목록을 가져오는 함수
  const fetchClients = async (page) => {
    try {
      const data = await getAllClients(page, size);
      setClients(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowDetailForm(true);
  };

  const handleCreateSuccess = (newClient) => {
    setClients((prevClients) => [...prevClients, newClient]);
    setShowCreateForm(false);
  };

  const handleDeleteSuccess = (clientCode) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.clientCode !== clientCode)
    );
    setShowDetailForm(false);
    setSelectedClient(null);
  };

  const handleUpdateSuccess = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.clientCode === updatedClient.clientCode ? updatedClient : client
      )
    );
    setShowDetailForm(false);
    setSelectedClient(null);
  };

  const handleSearchResults = (results) => {
    console.log("SearchClient에서 전달된 검색 결과:", results);
    setSearchResults(results);
  };

  return (
    <BasicLayout>
      <div className="client-page-container">
        <div className="page-header">
          <h1>거래처 관리</h1>
          <div className="header-right">
            <SearchClient onSearchResults={handleSearchResults} />
            <button
              className="new-client-btn"
              onClick={() => setShowCreateForm(true)}
            >
              신규등록
            </button>
          </div>
        </div>

        <ListClient
          clients={searchResults || clients}
          onClientSelect={handleClientClick}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        {showCreateForm && (
          <div className="modal-overlay">
            <CreateClient
              onClose={() => setShowCreateForm(false)}
              onSuccess={handleCreateSuccess}
            />
          </div>
        )}

        {showDetailForm && selectedClient && (
          <div className="modal-overlay">
            <ClientDetail
              client={selectedClient}
              onClose={() => {
                setShowDetailForm(false);
                setSelectedClient(null);
              }}
              onDeleteSuccess={handleDeleteSuccess}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default ClientPage;
