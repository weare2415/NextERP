import React, { useEffect, useState } from "react";
import {
  getPendingAttendances,
  approveAttendance,
  rejectAttendance,
} from "../api/attendanceApi"; // ✅ API 추가
import BasicLayout from "../../common/pages/BasicLayout";
import "../scss/ApprovalPage.scss";

const ApprovalPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const data = await getPendingAttendances();
      setPendingRequests(data);
    } catch (error) {
      console.error("승인 대기 목록 조회 실패:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await approveAttendance(id);
      alert("승인 완료되었습니다.");
      fetchPendingRequests(); // ✅ 목록 갱신
    } catch (error) {
      alert("승인 실패: " + error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAttendance(id);
      alert("거부 완료되었습니다.");
      fetchPendingRequests(); // ✅ 목록 갱신
    } catch (error) {
      alert("거부 실패: " + error.message);
    }
  };

  return (
    <BasicLayout>
      <div className="approval-page">
        <h2>근태 승인 관리</h2>
        {loading ? (
          <p>⏳ 로딩 중...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>사원명</th>
                <th>신청 유형</th>
                <th>신청 날짜</th>
                <th>신청 사유</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.employeeName}</td>
                    <td>{request.status}</td>
                    <td>{request.date}</td>
                    <td>{request.approvalReason}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(request.id)}
                      >
                        승인
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(request.id)}
                      >
                        거부
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">승인 대기 요청이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </BasicLayout>
  );
};

export default ApprovalPage;
