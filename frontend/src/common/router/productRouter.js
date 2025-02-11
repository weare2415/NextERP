import { lazy, Suspense } from "react";

const ProductPage = lazy(() => import("../../product/pages/ProductPage"));
const CreateProduct = lazy(() =>
  import("../../product/components/CreateProduct")
);
const RequestOrderPage = lazy(() =>
  import("../../request/pages/RequestOrderPage")
);

const productRouter = () => {
  return [
    {
      path: "", // `/product` 경로에서 ProductPage 렌더링
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ProductPage />
        </Suspense>
      ),
    },
    {
      path: "create", // `/product/create` 경로에서 CreateProduct 렌더링
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <CreateProduct />
        </Suspense>
      ),
    },
    {
      path: "request", // `/product/request` → 수정 승인 요청 페이지
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <RequestOrderPage />
        </Suspense>
      ),
    },
  ];
};

export default productRouter;
