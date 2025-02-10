import { Suspense, lazy } from "react";

const Loading = <div>Loading...</div>;
const ClientPage = lazy(() => import("../../client/pages/ClientPage"));
const RequestPage = lazy(() => import("../../request/pages/RequestPage"));

const clientRouter = () => {
  return [
    {
      path: "", // 거래처 기본본 페이지
      element: (
        <Suspense fallback={Loading}>
          <ClientPage />
        </Suspense>
      ),
    },
    {
      path: "request", // 🔹 /client/request → 수정 승인 요청 페이지
      element: (
        <Suspense fallback={Loading}>
          <RequestPage />
        </Suspense>
      ),
    },
  ];
};

export default clientRouter;
