import { lazy, Suspense } from "react";

const AnnouncementPage = lazy(() => import("../../announcement/pages/AnnouncementPage"));
const AnnouncementCreate = lazy(() => import("../../announcement/components/AnnouncementCreate"));

const Loading = () => <div>Loading...</div>;

const announcementRoutes = [
  {
    path: "", 
    element: (
      <Suspense fallback={<Loading />}>
        <AnnouncementPage />
      </Suspense>
    ),
  },
  {
    path: "create", 
    element: (
      <Suspense fallback={<Loading />}>
        <AnnouncementCreate />
      </Suspense>
    ),
  },
];

export default announcementRoutes;