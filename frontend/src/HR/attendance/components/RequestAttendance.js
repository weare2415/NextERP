import React, { useState } from "react";
import { useSelector } from "react-redux";
import { requestApproval } from "../api/attendanceApi";
import "../scss/RequestAttendance.scss";

const RequestAttendance = ({ onClose, onRequestSuccess }) => {
  const [reason, setReason] = useState(""); // 신청 사유
  const [selectedStatus, setSelectedStatus] = useState("LEAVE"); // 기본값: 휴가
  const [selectedDate, setSelectedDate] = useState(""); // 신청 날짜
  const [loading, setLoading] = useState(false);

  const employeeId = useSelector((state) => state.loginSlice.id);
  const employeeName = useSelector((state) => state.loginSlice.name); // 사원명 추가

  const getMinDate = () => {
    const today = new Date();
    if (selectedStatus === "SICK_LEAVE") today.setDate(today.getDate() + 1);
    else if (selectedStatus === "LEAVE" || selectedStatus === "REMOTE_WORK")
      today.setDate(today.getDate() + 7);
    return today.toISOString().split("T")[0];
  };

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

      // 부모 컴포넌트로 신청 내역 전달 (사원명 추가)
      if (onRequestSuccess) {
        onRequestSuccess({
          status: selectedStatus,
          date: selectedDate,
          reason: reason,
          employeeId, // 사원 ID
          employeeName, // 사원명
        });
      }

      if (typeof onClose === "function") {
        onClose();
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
