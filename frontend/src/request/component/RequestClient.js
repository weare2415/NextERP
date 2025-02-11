import React, { useEffect, useState } from "react";
import { approveClient, rejectClient } from "../../client/api/clientApi";
import "../component/scss/RequestClient.scss";
import { getEmployeeById } from "../../member/api/memberApi";

const RequestClient = ({ client, onClose, onUpdateSuccess }) => {
  const [employeeName, setEmployeeName] = useState("Loading..."); // 영업 담당자 이름

  // ✅ 담당자 이름 조회 (employeeId를 기반으로)
  useEffect(() => {
    const fetchEmployeeName = async () => {
      if (client.employeeId) {
        try {
          const employeeInfo = await getEmployeeById(client.employeeId); // API 호출
          setEmployeeName(employeeInfo.name); // 담당자 이름 저장
        } catch (error) {
          console.error("Failed to fetch employee name:", error);
          setEmployeeName("알 수 없음"); // 오류 발생 시 기본값
        }
      }
    };

    fetchEmployeeName();
  }, [client.employeeId]);

  // ✅ 거래처 승인 처리
  const handleApprove = async () => {
    try {
      await approveClient(client.clientCode, client.employeeId);
      alert("거래처 수정이 승인되었습니다.");
      onUpdateSuccess(client.clientCode); // 승인된 거래처 반영
      onClose();
    } catch (error) {
      console.error("승인 요청 실패:", error);
      alert("승인 요청이 실패되었습니다.");
    }
  };

  // ✅ 거래처 반려 처리
  const handleReject = async () => {
    try {
      await rejectClient(client.clientCode, client.employeeId);
      alert("거래처 수정 요청이 반려되었습니다.");
      onUpdateSuccess(client.clientCode); // 반려된 거래처 반영
      onClose();
    } catch (error) {
      console.error("반려 요청 실패:", error);
      alert("반려 요청이 실패되었습니다.");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-header">
        <h2>수정 승인 요청</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="modal-content">
        <form>
          <div className="form-grid">
            <div className="form-group">
              <label>기업명</label>
              <input
                type="text"
                name="clientName"
                value={client.clientName}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>회사 코드</label>
              <input
                type="text"
                name="clientCode"
                value={client.clientCode}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>회사 전화</label>
              <input
                type="text"
                name="clientPhone"
                value={client.clientPhone}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>우편번호</label>
              <div className="input-with-button">
                <input
                  type="text"
                  name="zipCode"
                  value={client.zipCode}
                  readOnly
                />
                <button type="button">우편번호 찾기</button>
              </div>
            </div>

            <div className="form-group full-width">
              <label>주소</label>
              <input
                type="text"
                name="clientAddress"
                value={client.clientAddress}
                readOnly
              />
            </div>

            <div className="form-group full-width">
              <label>상세주소</label>
              <input
                type="text"
                name="clientDetailedAddress"
                value={client.clientDetailedAddress}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>회사 이메일</label>
              <input
                type="email"
                name="clientEmail"
                value={client.clientEmail}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>사업자등록번호</label>
              <input
                type="text"
                name="registrationNumber"
                value={client.registrationNumber}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>거래 은행</label>
              <input
                type="text"
                name="clientBank"
                value={client.clientBank}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>계좌번호</label>
              <input
                type="text"
                name="clientAccountNumber"
                value={client.clientAccountNumber}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>예금주</label>
              <input
                type="text"
                name="clientAccountOwner"
                value={client.clientAccountOwner}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>메모</label>
              <textarea name="memo" value={client.memo} readOnly />
            </div>

            <div className="form-group">
              <label>영업 담당자</label>
              <input
                type="text"
                value={employeeName} // employeeId가 아닌 담당자 이름 표시
                readOnly
              />
            </div>
          </div>

          <div className="button-container">
            <button
              type="button"
              onClick={handleApprove}
              className="approve-button"
            >
              승인
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="reject-button"
            >
              반려
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestClient;
