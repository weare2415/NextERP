import { lazy, Suspense } from "react";

const EmployeePage = lazy(() => import("../../HR/employee/pages/EmployeePage"));
const CreateEmployee = lazy(() =>
  import("../../HR/employee/components/CreateEmployee")
);
const EmployeeDetail = lazy(() =>
  import("../../HR/employee/components/EmployeeDetail")
);
const ApprovalStatus = lazy(() =>
  import("../../HR/employee/components/ApprovalStatus")
); // ✅ 승인 여부 페이지 추가
const AttendancePage = lazy(() =>
  import("../../HR/attendance/pages/AttendancePage")
);
const RequestAttendance = lazy(() =>
  import("../../HR/attendance/components/RequestAttendance")
);

const RequestHistory = lazy(() =>
  import("../../HR/attendance/components/RequestHistory")
); // ✅ 신청 내역 페이지 추가
const ApprovalPage = lazy(() => import("../../HR/attendance/pages/ApprovalPage")); // ✅ 관리자 승인 페이지 추가
const MyPage = lazy(() => import("../../HR/employee/pages/MyPage")); // ✅ 마이페이지 추가

const Loading = () => <div>Loading...</div>;

const EmployeeRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={<Loading />}>
          <EmployeePage />
        </Suspense>
      ),
    },
    {
      path: "create",
      element: (
        <Suspense fallback={<Loading />}>
          <CreateEmployee />
        </Suspense>
      ),
    },
    {
      path: ":id",
      element: (
        <Suspense fallback={<Loading />}>
          <EmployeeDetail />
        </Suspense>
      ),
    },
    {
      path: "approval-status",
      element: (
        <Suspense fallback={<Loading />}>
          <ApprovalStatus />
        </Suspense>
      ),
    },
    {
      path: "attendance",
      element: (
        <Suspense fallback={<Loading />}>
          <AttendancePage />
        </Suspense>
      ),
    },
    {
      path: "attendance/request", // ✅ 근태 신청 페이지 추가
      element: (
        <Suspense fallback={<Loading />}>
          <RequestAttendance />
        </Suspense>
      ),
    },
    {
      path: "attendance/history", // ✅ 신청 내역 페이지 추가
      element: (
        <Suspense fallback={<Loading />}>
          <RequestHistory />
        </Suspense>
      ),
    },
    {
      path: "attendance/approval", // ✅ 관리자 승인 페이지 추가
      element: (
        <Suspense fallback={<Loading />}>
          <ApprovalPage />
        </Suspense>
      ),
    },
    {
      path: "mypage",
      element: (
        <Suspense fallback={<Loading />}>
          <MyPage />
        </Suspense>
      ),
    },
  ];
};

export default EmployeeRouter;
