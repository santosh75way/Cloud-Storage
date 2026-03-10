import type { RouteObject } from "react-router";
import { authLoader } from "@/services/authLoader";
import AuthLayout from "@/layouts/authLayout";
import AdminLayout from "@/layouts/adminLayout";
import AdminPage from "@/pages/admin";
import { adminLoader } from "@/services/adminLoader";
import DashboardPage from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import ErrorBoundaryPage from "@/pages/error-boundary";
import { DrivePage } from "@/pages/DrivePage";
import SharedWithMePage from "@/pages/SharedWithMePage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { SearchPage } from "@/pages/SearchPage";


const protectedRoutes: RouteObject[] = [
  {
    loader: authLoader,
    element: <AuthLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/profile/user",
        element: <ProfilePage />,
      },
      {
        path: "/drive",
        element: <DrivePage />,
      },
      {
        path: "/drive/:folderId",
        element: <DrivePage />,
      },
      {
        path: "/shared-with-me",
        element: <SharedWithMePage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },

  {
    loader: adminLoader,
    element: <AdminLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/admin/dashboard",
        element: (
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/dashboard/:folderId",
        element: (
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
];

export default protectedRoutes;
