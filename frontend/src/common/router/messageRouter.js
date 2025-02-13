import { lazy, Suspense } from "react";

const MessagePage = lazy(() => import("../../message/pages/MessagePage"));
const ChatList = lazy(() => import("../../message/components/ChatList"));
const ChatRoom = lazy(() => import("../../message/components/ChatRoom"));
const ChatCreate = lazy(() => import("../../message/components/ChatCreate")); // ✅ 추가

const messageRouter = [
  {
    path: "/message",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <MessagePage />
      </Suspense>
    ),
  },
  {
    path: "/message/list",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ChatList />
      </Suspense>
    ),
  },
  {
    path: "/message/create", // ✅ 채팅방 생성 페이지 추가
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ChatCreate />
      </Suspense>
    ),
  },
  {
    path: "/message/chat/:chatRoomId",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ChatRoom />
      </Suspense>
    ),
  },
];

export default messageRouter;
