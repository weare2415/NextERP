import React, { useEffect, useState } from "react";
import { getAllAttendances, requestApproval } from "../api/attendanceApi";
import BasicLayout from "../../../common/pages/BasicLayout";
import "../scss/AttendanceHistoryPage.scss";
import RequestHistory from "../components/RequestHistory";

const AttendanceHistoryPage = () => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
  
    useEffect(() => {
      fetchRequests();
    }, []);
  
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const allAttendances = await getAllAttendances();
        const filteredData = allAttendances.filter(request =>
          ["LEAVE", "SICK_LEAVE", "REMOTE_WORK"].includes(request.status)
        );
        setRequests(filteredData);
      } catch (error) {
        console.error("❌ 신청 내역 조회 실패:", error);
        alert("신청 내역을 불러오지 못했습니다.");
      }
      setLoading(false);
    };
  
    const handleApprovalRequest = async (id) => {
      try {
        await requestApproval(id);
        alert("승인 요청이 완료되었습니다.");
        fetchRequests();
      } catch (error) {
        console.error("❌ 승인 요청 실패:", error);
        alert("승인 요청 실패");
      }
    };

    return (
        <BasicLayout>
          <div className="attendance-history-page-container">
            <div className="page-header">
              <h1>근태 신청 내역</h1>
            </div>
            {loading ? (
              <p>⏳ 로딩 중...</p>
            ) : (
              <RequestHistory 
                requests={requests}
                onApprovalRequest={handleApprovalRequest}
              />
            )}
          </div>
        </BasicLayout>
      );
    };

export default AttendanceHistoryPage;
