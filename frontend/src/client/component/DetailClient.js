import React, { useEffect, useState } from "react";
import { requestUpdateClient, deleteClient } from "../api/clientApi";
import "../component/scss/DetailClient.scss";
import { getEmployeeById } from "../../member/api/memberApi";

const DetailClient = ({ client, onClose, onUpdateSuccess, onDeleteSuccess }) => {
    const [clientData, setClientData] = useState(client);
    const [employeeName, setEmployeeName] = useState("Loading..."); // 영업 담당자 이름
    const [userMemo, setUserMemo] = useState(client.memo || ""); // 변경된 값 기록
  
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

    const fieldNames = {
      clientName: "기업명",
      clientCode: "회사 코드",
      clientPhone: "회사 전화",
      zipCode: "우편번호",
      clientAddress: "주소",
      clientDetailedAddress: "상세주소",
      clientEmail: "회사 이메일",
      registrationNumber: "사업자등록번호",
      clientBank: "거래 은행",
      clientAccountNumber: "계좌번호",
      clientAccountOwner: "예금주",
  };

    // ✅ 변경 사항 감지 및 메모 자동 생성
    const generateMemo = (originalData, modifiedData) => {
      let changes = [];

      Object.keys(originalData).forEach((key) => {
          if (originalData[key] !== modifiedData[key] && key !== "memo") { // memo 필드는 비교 제외
              const fieldName = fieldNames[key] || key;
              changes.push(`${fieldName} 변경 (${originalData[key] || "없음"} → ${modifiedData[key] || "없음"})`);
          }
      });

      return changes.length > 0 ? `\n\n[자동 생성된 변경 이력]\n${changes.join("\n")}` : "";
  };

    // ✅ 입력값 변경 감지
    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "memo") {
          setUserMemo(value); // 사용자가 입력한 메모 따로 저장
      } else {
          const updatedData = { ...clientData, [name]: value };
          setClientData(updatedData);
      }
  };

    // ✅ 수정 요청 처리
    const handleUpdate = async () => {
      try {
          const updatedMemo = userMemo + generateMemo(client, clientData); // 기존 사용자 메모 + 변경 이력 합치기

          const updatedClient = await requestUpdateClient(client.clientCode, {
              ...clientData,
              memo: updatedMemo, // 최종 메모 전송
          });

          alert("수정 요청이 완료되었습니다.");
          onUpdateSuccess(updatedClient);
      } catch (error) {
          console.error("수정 요청 실패:", error);
          alert("수정 요청에 실패했습니다.");
      }
  };
  
    const handleDelete = async () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        try {
          await deleteClient(client.clientCode);
          alert("삭제가 완료되었습니다.");
          onDeleteSuccess(client.clientCode);
        } catch (error) {
          console.error("삭제 실패:", error);
          alert("삭제에 실패했습니다.");
        }
      }
    };
  
    return (
      <div className="client-detail-form">
        <div className="client-detail-header">
          <h2>거래처 상세 정보</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <form>
          <div className="form-group">
            <label>거래처 코드</label>
            <input type="text" name="clientCode" value={clientData.clientCode} onChange={handleChange} readOnly/>
          </div>
    
          <div className="form-group">
            <label>기업명</label>
            <input type="text" name="clientName" value={clientData.clientName} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>영업 담당자</label>
            <input type="text" value={employeeName} readOnly />
          </div>
    
          <div className="form-group">
            <label>거래처 전화</label>
            <input type="text" name="clientPhone" value={clientData.clientPhone} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>우편번호</label>
            <input type="text" name="zipCode" value={clientData.zipCode} onChange={handleChange} />
            <button type="button">우편번호 찾기</button>
          </div>
    
          <div className="form-group">
            <label>주소</label>
            <input type="text" name="clientAddress" value={clientData.clientAddress} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>상세 주소</label>
            <input type="text" name="clientDetailedAddress" value={clientData.clientDetailedAddress} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>거래처 이메일</label>
            <input type="email" name="clientEmail" value={clientData.clientEmail} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>사업자등록번호</label>
            <input type="text" name="registrationNumber" value={clientData.registrationNumber} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>거래 은행</label>
            <input type="text" name="clientBank" value={clientData.clientBank} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>예금주</label>
            <input type="text" name="clientAccountOwner" value={clientData.clientAccountOwner} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>계좌번호</label>
            <input type="text" name="clientAccountNumber" value={clientData.clientAccountNumber} onChange={handleChange} />
          </div>
    
          <div className="form-group">
            <label>메모</label>
            <textarea name="memo" value={userMemo + generateMemo(client, clientData)} onChange={handleChange}></textarea>
          </div>
    
          <div className="client-detail-buttons">
            <button type="button" onClick={handleUpdate} className="update-button">수정</button>
            <button type="button" onClick={handleDelete} className="delete-button">삭제</button>
          </div>
        </form>
      </div>
    );
  };

export default DetailClient;