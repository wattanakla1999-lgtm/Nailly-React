import { useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { LoadingPopup } from "@/components/LoadingPopup"

interface AxiosInterceptorProps {
  children: ReactNode
}

export function AxiosInterceptor({ children }: AxiosInterceptorProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeRequests, setActiveRequests] = useState(0)

  useEffect(() => {
    // Request Interceptor: Attach Token / Credentials
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Increase active requests count to show loading overlay
        setActiveRequests((prev) => prev + 1)

        // Read token/auth credentials from localStorage
        const authData = localStorage.getItem("nailly_auth")
        if (authData) {
          try {
            const parsed = JSON.parse(authData)
            const token = parsed.token || ""
            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch (e) {
            console.error("Failed to parse auth token", e)
          }
        }
        return config
      },
      (error) => {
        setActiveRequests((prev) => Math.max(0, prev - 1))
        return Promise.reject(error)
      }
    )

    // Response Interceptor: Handle Global HTTP Errors (401, 403, 500)
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setActiveRequests((prev) => Math.max(0, prev - 1))
        return response
      },
      (error) => {
        setActiveRequests((prev) => Math.max(0, prev - 1))

        if (error.response) {
          const { status } = error.response

          if (status === 401) {
            console.warn("Session expired. Logging out...")
            logout()
            navigate("/login", { replace: true })
          } else if (status === 403) {
            console.error("Forbidden resource.")
            alert("คุณไม่มีสิทธิ์เข้าถึงข้อมูลส่วนนี้ค่ะ")
          } else if (status >= 500) {
            console.error("Server Error:", error.response.data || error.message)
            alert("เกิดข้อผิดพลาดจากทางเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งภายหลังค่ะ")
          }
        } else {
          console.error("Network Error:", error.message)
          alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ตค่ะ")
        }

        return Promise.reject(error)
      }
    )

    // Eject interceptors on unmount to prevent duplicated interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [navigate, logout])

  return (
    <>
      <LoadingPopup isOpen={activeRequests > 0} message="กำลังประมวลผลข้อมูล..." />
      {children}
    </>
  )
}
