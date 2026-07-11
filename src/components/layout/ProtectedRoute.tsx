import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

/**
 * ProtectedRoute — Guards authenticated-only routes.
 *
 * Usage in router:
 *   { element: <ProtectedRoute />, children: [...protected routes] }
 *
 * - If loading: shows a splash loader
 * - If not authenticated: redirects to /login (preserving the requested URL)
 * - If authenticated: renders the child route via <Outlet />
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
          <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
