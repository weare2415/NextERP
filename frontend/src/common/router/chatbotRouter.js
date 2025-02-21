import { lazy } from "react";

const ChatbotPage = lazy(() => import("../../chatbot/ChatbotPage"));

const chatbotRouter = () => [
  {
    path: "",
    element: <ChatbotPage />,
  },
];

export default chatbotRouter;
