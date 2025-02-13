import React, { useEffect, useState } from "react";
import { getAllAttendances } from "../api/attendanceApi"; // ✅ 신청 내역 조회 API

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const allAttendances = await getAllAttendances(); // ✅ 모든 근태 기록 가져오기
      console.log("✅ API 응답 데이터:", allAttendances); // ✅ 데이터 확인

      // ✅ 휴가(LEAVE), 병가(SICK_LEAVE), 재택근무(REMOTE_WORK) 상태만 필터링
      const filteredData = allAttendances.filter((request) =>
        ["LEAVE", "SICK_LEAVE", "REMOTE_WORK"].includes(request.status)
      );

      setRequests(filteredData);
    } catch (error) {
      console.error("❌ 신청 내역 조회 실패:", error);
      alert("신청 내역을 불러오지 못했습니다.");
    }
  };

  return (
    <div className="request-history">
      <h2>근태 신청 내역</h2>
      <table className="request-table">
        <thead>
          <tr>
            <th>사원명</th>
            <th>신청 날짜</th>
            <th>근태 유형</th>
            <th>신청 사유</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.employeeName}</td>
                <td>{request.date}</td>
                <td>
                  {request.status === "LEAVE"
                    ? "휴가"
                    : request.status === "SICK_LEAVE"
                    ? "병가"
                    : "재택근무"}
                </td>
                <td>{request.approvalReason || "N/A"}</td>
                <td>
                  <span
                    className={`status-label ${request.requestStatus.toLowerCase()}`}
                  >
                    {request.requestStatus === "PENDING"
                      ? "승인 대기"
                      : request.requestStatus === "APPROVED"
                      ? "승인됨"
                      : "거부됨"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">📌 신청 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestHistory;
