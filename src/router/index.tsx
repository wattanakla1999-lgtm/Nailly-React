import { createBrowserRouter, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"

/**
 * Application route definitions.
 *
 * Route structure:
 *   /               → Redirect to /dashboard
 *   /login          → Login page (redirects to /dashboard if already authenticated)
 *   /dashboard      → Protected: requires login
 *
 * To add new protected pages:
 *   1. Create a new `*Page.tsx` in src/pages/
 *   2. Add a new route object inside the ProtectedRoute children array
 */
export const router = createBrowserRouter([
  {
    // Root: redirect to /dashboard
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // Protected area — all children require authentication
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      // Add more protected routes here, e.g.:
      // { path: "/appointments", element: <AppointmentsPage /> },
      // { path: "/customers", element: <CustomersPage /> },
      // { path: "/services", element: <ServicesPage /> },
    ],
  },
  {
    // 404 fallback — redirect to dashboard
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
])
