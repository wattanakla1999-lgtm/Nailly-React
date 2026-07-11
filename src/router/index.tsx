import { createBrowserRouter, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { AppointmentsPage } from "@/pages/AppointmentsPage"
import { ServicesPage } from "@/pages/ServicesPage"
import { CustomersPage } from "@/pages/CustomersPage"
import { ReportsPage } from "@/pages/ReportsPage"

/**
 * Application route definitions.
 *
 * Route structure:
 *   /                  → Redirect to /dashboard
 *   /login             → Login page
 *   /dashboard         → Protected: ภาพรวม
 *   /appointments      → Protected: นัดหมาย
 *   /services          → Protected: บริการ
 *   /customers         → Protected: ลูกค้า
 *   /reports           → Protected: รายงาน
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // ProtectedRoute guards auth; AppLayout provides shared header/nav
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard",     element: <DashboardPage /> },
          { path: "/appointments",  element: <AppointmentsPage /> },
          { path: "/services",      element: <ServicesPage /> },
          { path: "/customers",     element: <CustomersPage /> },
          { path: "/reports",       element: <ReportsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
])
