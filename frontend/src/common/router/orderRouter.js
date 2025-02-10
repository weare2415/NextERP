import { lazy, Suspense } from "react";

const OrderPage = lazy(() =>
  import("../../order/pages/OrderPage")
);

const orderRouter = () => {
  return [
    {
      path: "", // `/order` 경로에서 OrderPage 렌더링
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <OrderPage />
        </Suspense>
      ),
    }
  ];
};

export default orderRouter;