import { lazy } from "react";

const Chatbot = lazy(() => import("../../chatbot/component/chatbot"));

const chatbotRouter = () => [
  {
    path: "", // ✅ "window"로 경로 설정
    element: <Chatbot />,
  },
];

export default chatbotRouter;
