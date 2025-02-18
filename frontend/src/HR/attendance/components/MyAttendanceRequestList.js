// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { getAttendanceByEmployee } from "../api/attendanceApi"; // ✅ API 수정
// import Pagination from "../../../common/component/Pagination";
// import "../scss/MyAttendanceRequestList.scss";

// const MyAttendanceRequestList = () => {
//   const [attendances, setAttendances] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ 페이징 관련 상태 추가
//   const [currentPage, setCurrentPage] = useState(0); // ✅ 0부터 시작
//   const pageSize = 10; // ✅ 고정 페이지 크기
//   const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 수

//   // Redux에서 로그인한 사용자의 ID 가져오기
//   const employeeId = useSelector((state) => state.loginSlice.id);

//   useEffect(() => {
//     if (employeeId) {
//       fetchAttendanceRecords(employeeId);
//     } else {
//       console.error("❌ 로그인된 사원 ID를 찾을 수 없습니다.");
//       alert("로그인된 사원 ID를 찾을 수 없습니다.");
//     }
//   }, [employeeId, currentPage]); // ✅ currentPage 변경될 때마다 실행

//   const fetchAttendanceRecords = async (employeeId) => {
//     setLoading(true);
//     try {
//       const data = await getAttendanceByEmployee(
//         employeeId,
//         currentPage,
//         pageSize
//       ); // ✅ page, size 추가
//       console.log("📌 가져온 근태 데이터:", data);

//       setAttendances(data.content); // ✅ 페이징된 데이터 적용
//       setTotalPages(data.totalPages); // ✅ 전체 페이지 수 업데이트
//     } catch (error) {
//       console.error(`❌ 직원 근태 기록 조회 실패 (ID: ${employeeId}):`, error);
//       alert("근태 기록을 불러오지 못했습니다.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="attendance-list-wrapper">
//       <div className="attendance-table-section">
//         {loading ? (
//           <p className="loading">⏳ 로딩 중...</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>날짜</th>
//                 <th>사원 ID</th>
//                 <th>사원명</th>
//                 <th>출근 시간</th>
//                 <th>퇴근 시간</th>
//                 <th>현재 상태</th>
//                 <th>초과 근무 (시간)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendances.length > 0 ? (
//                 attendances.map((attendance) => (
//                   <tr key={attendance.id} className="clickable-row">
//                     <td>{attendance.date}</td>
//                     <td>{attendance.employeeId}</td>
//                     <td>{attendance.employeeName}</td>
//                     <td>{attendance.checkInTime || "N/A"}</td>
//                     <td>{attendance.checkOutTime || "N/A"}</td>
//                     <td>
//                       {(() => {
//                         const statusMap = {
//                           PRESENT: "출근",
//                           OFF_WORK: "퇴근",
//                           LATE: "지각",
//                           LEAVE: "휴가",
//                           SICK_LEAVE: "병가",
//                           REMOTE_WORK: "재택근무",
//                         };
//                         return statusMap[attendance.status] || "알 수 없음";
//                       })()}
//                     </td>
//                     <td>{attendance.overtimeHours || "0"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7">📌 근태 기록이 없습니다.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ✅ 페이지네이션 컴포넌트 적용 */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//       />
//     </div>
//   );
// };

// export default MyAttendanceRequestList;
