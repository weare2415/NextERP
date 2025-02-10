import { lazy, Suspense } from "react";

const EmployeePage = lazy(() => import("../../employee/pages/EmployeePage"));
const CreateEmployee = lazy(() => import("../../employee/components/CreateEmployee"));
const EmployeeDetail = lazy(() => import("../../employee/components/EmployeeDetail"));

const EmployeeRouter = () => {
  return [
    {
      path: "", // `/employee` 경로에서 EmployeePage 렌더링
      element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeePage />
          </Suspense>
      ),
    },
    {
      path: "create", // `/employee/create` 경로에서 CreateEmployee 렌더링
      element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CreateEmployee />
          </Suspense>
      ),
    },
    {
      path: ":id", // `/employee/:id` 경로에서 EmployeeDetail 렌더링
      element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeeDetail />
          </Suspense>
      ),
    },
  ]
};

export default EmployeeRouter;
