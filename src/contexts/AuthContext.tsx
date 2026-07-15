import { createContext, useState, useEffect, useCallback, type ReactNode } from "react"
import api from "@/lib/api"
import { getApiErrorMessage } from "@/lib/apiError"

export interface User {
  id: number
  username: string
  name: string
  role: "admin"
  avatar?: string
}

interface AuthSession {
  token: string
  tokenType: "Bearer"
  expiresAt: string
  user: User
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const STORAGE_KEY = "nailly_auth"

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const session = JSON.parse(stored) as AuthSession
        const isExpired = new Date(session.expiresAt).getTime() <= Date.now()
        if (!session.token || !session.user || isExpired) {
          localStorage.removeItem(STORAGE_KEY)
        } else {
          setUser(session.user)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await api.post<AuthSession>("/auth/login", {
          username: username.trim(),
          password,
        })
        const session = response.data
        setUser(session.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: getApiErrorMessage(error, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"),
        }
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
