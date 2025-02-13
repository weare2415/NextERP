import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import MainPage from "../pages/MainPage";
import memberRouter from "./memberRouter";
import ExampleCharts from "../../test/ExampleCharts";
import productRouter from "./productRouter";
import clientRouter from "./clientRouter";
import employeeRouter from "./employeeRouter";
import payrollRouter from "./payrollRouter";
import orderRouter from "./orderRouter";
import announcementRouter from "./announcementRouter";
import messageRouter from "./messageRouter";

const Loading = () => <div>Loading...</div>;

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <MainPage />
      </Suspense>
    ),
  },
  {
    path: "member",
    children: memberRouter(),
  },
  {
    path: "product", // product 관련 경로 추가
    children: productRouter(), // productRouter 연결
  },
  {
    path: "clients",
    children: clientRouter(),
  },
  {
    path: "order",
    children: orderRouter(),
  },
  {
    path: "employee", // ✅ employee 관련 경로 추가
    children: employeeRouter(),
  },

  {
    path: "announcement", // ✅ 공지사항 관련 경로 추가
    children: announcementRouter, // ✅ 함수를 호출하는 것이 아니라 변수 자체를 사용해야 함
  },

  {
    path: "message", // ✅ 공지사항 관련 경로 추가
    children: messageRouter, // ✅ 함수를 호출하는 것이 아니라 변수 자체를 사용해야 함
  },

  {
    path: "test",
    element: (
      <Suspense fallback={<Loading />}>
        <ExampleCharts />
      </Suspense>
    ),
  },
  {
    path: "payroll",
    children: payrollRouter(),
  },
]);

export default root;
