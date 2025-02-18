import React from "react";
import { approveClient, rejectClient } from "../api/clientApi";
import "./scss/RequestClient.scss";
import useEmployeeNames from '../../../common/hooks/useEmployeeNames';

const RequestClient = ({ client, onClose, onUpdateSuccess }) => {
  const employeeNames = useEmployeeNames(client, "employeeId");

    // ✅ 거래처 승인 처리
    const handleApprove = async () => {
        try {
          await approveClient(client.clientCode, client.employeeId);
          alert("거래처 수정이 승인되었습니다.");
          onUpdateSuccess(client.clientCode); 
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
          onUpdateSuccess(client.clientCode); 
          onClose();
        } catch (error) {
          console.error("반려 요청 실패:", error);
          alert("반려 요청이 실패되었습니다.");
        }
    };
  
    return (
      <div className="request-client-detail-form">
        <div className="request-client-detail-header">
          <h2>수정 승인 요청</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
          <form>
          <div className="form-group">
              <label>거래처 코드</label>
              <input
                type="text"
                name="clientCode"
                value={client.clientCode}
                readOnly
              />
            </div>
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
              <label>영업 담당자</label>
              <input
                  type="text"
                  value={employeeNames[client.employeeId]}
                  readOnly
                />
          </div>
            <div className="form-group">
              <label>거래처 전화</label>
              <input
                type="text"
                name="clientPhone"
                value={client.clientPhone}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>우편번호</label>
                <input
                  type="text"
                  name="zipCode"
                  value={client.zipCode}
                  readOnly
                />
                <button type="button">우편번호 찾기</button>
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
              <label>거래처 이메일</label>
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
              <label>예금주</label>
              <input
                type="text"
                name="clientAccountOwner"
                value={client.clientAccountOwner}
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
              <label>메모</label>
              <textarea
                name="memo"
                value={client.memo}
                readOnly
              />
            </div>
            <div className="request-client-detail-buttons">
            <button type="button" onClick={handleApprove} className="approve-button">
              승인
            </button>
            <button type="button" onClick={handleReject} className="reject-button">
              반려
            </button>
            </div>
          </form>
        </div>
    );
  };

export default RequestClient;