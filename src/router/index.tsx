import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { AppointmentsPage } from "@/pages/AppointmentsPage"
import { ServicesPage } from "@/pages/ServicesPage"
import { TechniciansPage } from "@/pages/TechniciansPage"
import { CustomersPage } from "@/pages/CustomersPage"
import { ReportsPage } from "@/pages/ReportsPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { CustomerBookingPage } from "@/pages/CustomerBookingPage"
import { AxiosInterceptor } from "@/components/AxiosInterceptor"

/**
 * Application route definitions.
 *
 * Route structure:
 *   /                  → Customer Booking Flow (Public)
 *   /login             → Staff Login Page
 *   /dashboard         → Protected: ภาพรวม
 *   /appointments      → Protected: นัดหมาย
 *   /services          → Protected: บริการ
 *   /technicians       → Protected: ช่างทำเล็บ
 *   /customers         → Protected: ลูกค้า
 *   /reports           → Protected: รายงาน
 *   /settings          → Protected: ตั้งค่าร้าน
 */
export const router = createBrowserRouter([
  {
    element: (
      <AxiosInterceptor>
        <Outlet />
      </AxiosInterceptor>
    ),
    children: [
      {
        path: "/",
        element: <CustomerBookingPage />,
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
              { path: "/technicians",   element: <TechniciansPage /> },
              { path: "/customers",     element: <CustomersPage /> },
              { path: "/reports",       element: <ReportsPage /> },
              { path: "/settings",      element: <SettingsPage /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
