import { lazy, Suspense } from "react";

const AnnouncementPage = lazy(() =>
  import("../../announcement/pages/AnnouncementPage")
);
const AnnouncementCreate = lazy(() =>
  import("../../announcement/components/AnnouncementCreate")
);

const Loading = () => <div>Loading...</div>;

// ✅ 익명 함수가 아닌, 변수를 사용하여 내보내기
const announcementRouter = [
  {
    path: "", // ✅ 기본 `/announcement` 경로에서 `AnnouncementPage`가 보이도록 설정
    element: (
      <Suspense fallback={<Loading />}>
        <AnnouncementPage />
      </Suspense>
    ),
  },
  {
    path: "create", // ✅ `/announcement/create` 경로로 이동
    element: (
      <Suspense fallback={<Loading />}>
        <AnnouncementCreate />
      </Suspense>
    ),
  },
];

export default announcementRouter;
