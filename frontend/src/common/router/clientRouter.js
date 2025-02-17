import { Suspense, lazy } from "react";

const Loading = <div>Loading...</div>;
const ClientPage = lazy(() => import("../../sales/client/pages/ClientPage"));
const RequestPage = lazy(() => import("../../sales/client/pages/RequestPage"));

const clientRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <ClientPage />
        </Suspense>
      ),
    },
    {
      path: "request",
      element: (
        <Suspense fallback={Loading}>
          <RequestPage />
        </Suspense>
      ),
    },
  ];
};

export default clientRouter;
