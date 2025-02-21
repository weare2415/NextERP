import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import MainPage from "../pages/MainPage";
import memberRouter from "./memberRouter";
import ExampleCharts from "../../test/ExampleCharts";
import productRouter from "./productRouter";
import clientRouter from "./clientRouter";
import employeeRouter from "./employeeRouter";
import payrollRouter from "./payrollRouter";
import announcementRouter from "./announcementRouter";
import messageRouter from "./messageRouter";
import chatbotRouter from "./chatbotRouter";

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
    path: "employee", // ✅ employee 관련 경로 추가
    children: employeeRouter(),
  },

  {
    path: "announcement",
    children: announcementRouter,
  },
  {
    path: "message",
    children: messageRouter,
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
  //  챗봇 추가
  {
    path: "chatbot",
    children: chatbotRouter(),
  },
]);

export default root;
