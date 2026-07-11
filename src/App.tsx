import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { router } from "@/router"

/**
 * App root:
 *   AuthProvider  — provides authentication state to the entire tree
 *   RouterProvider — renders the correct page based on the current URL
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
