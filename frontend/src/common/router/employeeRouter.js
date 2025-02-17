import { lazy, Suspense } from "react";

const EmployeePage = lazy(() => import("../../HR/employee/pages/EmployeePage"));
const CreateEmployee = lazy(() =>
  import("../../HR/employee/components/CreateEmployee")
);
const EmployeeDetail = lazy(() =>
  import("../../HR/employee/components/EmployeeDetail")
);
const ApprovalStatusPage = lazy(() =>
  import("../../HR/employee/pages/ApprovalStatusPage")
);
const AttendancePage = lazy(() =>
  import("../../HR/attendance/pages/AttendancePage")
);
const MyAttendanceRequestPage = lazy(() =>
  import("../../HR/attendance/pages/MyAttendanceRequestPage")
);
const AttendanceHistoryPage = lazy(() =>
  import("../../HR/attendance/pages/AttendanceHistoryPage")
);

const ApprovalPage = lazy(() =>
  import("../../HR/attendance/pages/ApprovalPage")
);

const MyAttendancePage = lazy(() =>
  import("../../HR/attendance/pages/MyAttendancePage")
);

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
          <ApprovalStatusPage />
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
      path: "attendance/request",
      element: (
        <Suspense fallback={<Loading />}>
          <MyAttendanceRequestPage />
        </Suspense>
      ),
    },
    {
      path: "attendance/history",
      element: (
        <Suspense fallback={<Loading />}>
          <AttendanceHistoryPage />
        </Suspense>
      ),
    },
    {
      path: "attendance/approval",
      element: (
        <Suspense fallback={<Loading />}>
          <ApprovalPage />
        </Suspense>
      ),
    },
    {
      path: "myattendance",
      element: (
        <Suspense fallback={<Loading />}>
          <MyAttendancePage />
        </Suspense>
      ),
    },
  ];
};

export default EmployeeRouter;
