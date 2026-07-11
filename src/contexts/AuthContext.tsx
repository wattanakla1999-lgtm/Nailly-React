import { createContext, useState, useEffect, useCallback, type ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  username: string
  name: string
  role: "admin" | "staff"
  avatar?: string
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// ─── Mock Credentials ────────────────────────────────────────────────────────

const MOCK_USERS: Array<{ username: string; password: string; user: User }> = [
  {
    username: "admin",
    password: "nailly2025",
    user: {
      username: "admin",
      name: "ผู้ดูแลระบบ",
      role: "admin",
    },
  },
  {
    username: "staff",
    password: "staff123",
    user: {
      username: "staff",
      name: "พนักงาน",
      role: "staff",
    },
  },
]

const STORAGE_KEY = "nailly_auth"

// ─── Context ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as User
        setUser(parsed)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Simulate network delay for realism
      await new Promise((resolve) => setTimeout(resolve, 800))

      const match = MOCK_USERS.find(
        (u) => u.username === username.trim() && u.password === password
      )

      if (!match) {
        return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }
      }

      setUser(match.user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user))
      return { success: true }
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
