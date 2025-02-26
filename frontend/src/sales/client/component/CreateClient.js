import React, { useEffect, useState } from "react";
import { createClient } from "../api/clientApi"; // API 요청 함수
import "./scss/CreateClient.scss"; // 스타일 파일 추가 (선택사항)
import { getEmployeeByName } from "../../../common/member/api/memberApi";
import { useSelector } from "react-redux";

const CreateClient = ({ onClose, onSuccess }) => {
  const name = useSelector((state) => state.loginSlice.name);

  const [clientData, setClientData] = useState({
    clientName: "",
    clientCode: "",
    clientPhone: "",
    zipCode: "",
    clientAddress: "",
    clientDetailedAddress: "",
    clientEmail: "",
    registrationNumber: "",
    clientBank: "",
    clientAccountNumber: "",
    clientAccountOwner: "",
    memo: "",
    employeeName: name, // 담당자 이름 입력
    employeeId: "", // 조회된 사원 ID 저장
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  // ✅ 로그인한 사용자 이름으로 employeeId 자동 조회
  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (name) {
        try {
          const response = await getEmployeeByName(name);
          const employees = response.content;
          console.log("조회된 사원 리스트:", employees);
          if (employees.length > 0) {
            setClientData((prev) => ({
              ...prev,
              employeeId: employees[0].id, // 첫 번째 검색 결과의 ID 저장
            }));
          }
        } catch (error) {
          console.error("사원 ID 조회 실패:", error);
        }
      }
    };

    fetchEmployeeId();
  }, [name]); // name이 변경될 때마다 실행

  // Daum 우편번호 검색 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 우편번호 검색 함수
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 선택시 입력값 세팅
        setClientData(prev => ({
          ...prev,
          zipCode: data.zonecode, // 우편번호 설정
          clientAddress: data.address, // 주소 설정
          clientDetailedAddress: "" // 상세주소 초기화
        }));
      }
    }).open();
  };

  // 거래처 등록 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientData.employeeId) {
      alert("담당자 정보가 유효하지 않습니다.");
      return; // employeeId가 없으면 등록을 진행하지 않음
    }
    try {
      const newClient = await createClient(clientData);
      alert("거래처가 성공적으로 등록되었습니다.");
      onSuccess(newClient); // 새로 생성된 거래처 데이터를 부모 컴포넌트로 전달
      onClose(); // 폼 닫기
      window.location.reload();
    } catch (error) {
      console.error("거래처 등록 중 오류 발생:", error);
      alert("거래처 등록에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="client-create-form">
        <div className="client-create-header">
          <h2>거래처 신규등록</h2>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <form className="client-create-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>거래처 코드</label>
            <input
              type="text"
              name="clientCode"
              value={clientData.clientCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>기업명</label>
            <input
              type="text"
              name="clientName"
              value={clientData.clientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>영업 담당자</label>
            <input
              type="text"
              name="employeeName"
              value={clientData.employeeName}
              required
              readOnly
            />
          </div>

          <div className="form-group">
            <label>거래처 전화</label>
            <input
              type="text"
              name="clientPhone"
              value={clientData.clientPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>우편번호</label>
            <input
              type="text"
              name="zipCode"
              value={clientData.zipCode}
              onChange={handleChange}
              required
              readOnly
            />
            <button type="button" onClick={searchAddress}>우편번호 찾기</button>
          </div>

          <div className="form-group">
            <label>주소</label>
            <input
              type="text"
              name="clientAddress"
              value={clientData.clientAddress}
              onChange={handleChange}
              required
              readOnly
            />
          </div>

          <div className="form-group">
            <label>상세 주소</label>
            <input
              type="text"
              name="clientDetailedAddress"
              value={clientData.clientDetailedAddress}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>거래처 이메일</label>
            <input
              type="email"
              name="clientEmail"
              value={clientData.clientEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>사업자등록번호</label>
            <input
              type="text"
              name="registrationNumber"
              value={clientData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>거래 은행</label>
            <input
              type="text"
              name="clientBank"
              value={clientData.clientBank}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>예금주</label>
            <input
              type="text"
              name="clientAccountOwner"
              value={clientData.clientAccountOwner}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>계좌번호</label>
            <input
              type="text"
              name="clientAccountNumber"
              value={clientData.clientAccountNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>메모</label>
            <textarea
              name="memo"
              value={clientData.memo}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="client-create-buttons">
            <button type="submit">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClient;
