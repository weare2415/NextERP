import React, { useState } from "react";
import { useSelector } from "react-redux";
import { requestApproval } from "../api/attendanceApi";
import "../scss/RequestAttendance.scss";

const RequestAttendance = ({ onClose }) => {
  const [reason, setReason] = useState(""); // 신청 사유
  const [selectedStatus, setSelectedStatus] = useState("LEAVE"); // 기본값: 휴가
  const [selectedDate, setSelectedDate] = useState(""); // 신청 날짜
  const [loading, setLoading] = useState(false);

  // ✅ 로그인한 사용자의 ID 가져오기
  const employeeId = useSelector((state) => state.loginSlice.id);

  const getMinDate = () => {
    const today = new Date();

    if (selectedStatus === "SICK_LEAVE") {
      // ✅ 병가는 다음날부터 가능
      today.setDate(today.getDate() + 1);
    } else if (selectedStatus === "LEAVE" || selectedStatus === "REMOTE_WORK") {
      // ✅ 휴가 & 재택근무는 일주일 뒤부터 가능
      today.setDate(today.getDate() + 7);
    }

    return today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
  };

  // ✅ 신청 요청
  const handleRequest = async () => {
    if (!reason.trim() || !selectedDate) {
      alert("신청 날짜와 사유를 입력해주세요.");
      return;
    }

    if (!employeeId) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      await requestApproval(employeeId, selectedStatus, selectedDate, reason);
      alert("신청이 완료되었습니다. 승인 대기 중입니다.");
      if (typeof onClose === "function") {
        onClose(); // ✅ onClose가 함수일 때만 실행
      }
    } catch (error) {
      alert("신청 실패: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>근태 신청</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-content">
          <div className="form-group">
            <div className="input-box">
              <label>근태 유형</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="LEAVE">휴가</option>
                <option value="SICK_LEAVE">병가</option>
                <option value="REMOTE_WORK">재택근무</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="input-box">
              <label>신청 날짜</label>
              <input
                type="date"
                min={getMinDate()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-box">
              <label>신청 사유</label>
              <textarea
                placeholder="사유를 입력하세요."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-detail-buttons">
            <button
              type="button"
              onClick={handleRequest}
              disabled={loading}
              className="submit-button"
            >
              {loading ? "신청 중..." : "신청하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAttendance;
