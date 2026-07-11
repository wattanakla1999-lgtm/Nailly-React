import { useState, type FormEvent } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { Eye, EyeOff, Sparkles, Lock, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Destination after login (preserved by ProtectedRoute)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard"

  // Already authenticated → redirect immediately
  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้")
      return
    }
    if (!password) {
      setError("กรุณากรอกรหัสผ่าน")
      return
    }

    setIsSubmitting(true)
    const result = await login(username, password)
    setIsSubmitting(false)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    }
  }

  const fillDemo = () => {
    setUsername("admin")
    setPassword("nailly2025")
    setError("")
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-fuchsia-950/30">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-600/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-600/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-200/20 blur-2xl dark:bg-fuchsia-700/10" />

      {/* Left panel — branding (hidden on mobile) */}
      <div className="relative hidden flex-col items-center justify-center gap-8 bg-gradient-to-b from-rose-500 to-pink-600 px-12 text-white lg:flex lg:w-[480px] xl:w-[540px]">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative space-y-6 text-center">
          {/* Logo */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl ring-1 ring-white/30">
            <span className="text-5xl">💅</span>
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tight">Nailly</h1>
            <p className="mt-2 text-xl font-light text-rose-100">ระบบจัดการร้านทำเล็บ</p>
          </div>

          <div className="space-y-4 text-left">
            {[
              { icon: "📅", text: "จัดการนัดหมายลูกค้าได้ง่ายดาย" },
              { icon: "💖", text: "บริหารบริการและราคาในที่เดียว" },
              { icon: "📊", text: "รายงานรายได้และสถิติรายวัน" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-rose-100">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-6 text-xs text-rose-200">
          © 2025 Nailly — Nail Salon Management
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-6 flex flex-col items-center gap-2 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-200 text-3xl">
              💅
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-rose-600">Nailly</h1>
              <p className="text-xs text-neutral-400">ระบบจัดการร้านทำเล็บ</p>
            </div>
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-rose-100/80 bg-white/80 shadow-2xl shadow-rose-100/50 backdrop-blur-xl dark:border-rose-900/30 dark:bg-neutral-900/80 dark:shadow-rose-950/20">
            <div className="p-6 sm:p-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  ยินดีต้อนรับกลับมา 👋
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  เข้าสู่ระบบเพื่อจัดการร้านทำเล็บของคุณ
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Username */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-username"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    ชื่อผู้ใช้
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <User className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      autoComplete="username"
                      autoFocus
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        setError("")
                      }}
                      placeholder="กรอกชื่อผู้ใช้"
                      className={cn(
                        "w-full rounded-xl border bg-neutral-50/50 py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all dark:bg-neutral-800/50 dark:text-white",
                        "focus:border-rose-400 focus:ring-3 focus:ring-rose-400/20 focus:bg-white dark:focus:bg-neutral-800",
                        error
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                          : "border-neutral-200 dark:border-neutral-700"
                      )}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    รหัสผ่าน
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Lock className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      placeholder="กรอกรหัสผ่าน"
                      className={cn(
                        "w-full rounded-xl border bg-neutral-50/50 py-3 pl-10 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all dark:bg-neutral-800/50 dark:text-white",
                        "focus:border-rose-400 focus:ring-3 focus:ring-rose-400/20 focus:bg-white dark:focus:bg-neutral-800",
                        error
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                          : "border-neutral-200 dark:border-neutral-700"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 font-semibold text-white shadow-lg shadow-rose-200/50 hover:from-rose-600 hover:to-pink-600 hover:shadow-rose-300/50 dark:shadow-rose-900/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      กำลังเข้าสู่ระบบ...
                    </span>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </Button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-900/30 dark:bg-rose-950/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <div className="flex-1 text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      ข้อมูลสำหรับทดสอบ
                    </p>
                    <p>
                      Username:{" "}
                      <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-rose-600 dark:bg-neutral-800 dark:text-rose-400">
                        admin
                      </code>
                    </p>
                    <p className="mt-1">
                      Password:{" "}
                      <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-rose-600 dark:bg-neutral-800 dark:text-rose-400">
                        nailly2025
                      </code>
                    </p>
                    <button
                      type="button"
                      onClick={fillDemo}
                      className="mt-2 text-rose-500 hover:text-rose-700 underline underline-offset-2 transition-colors"
                    >
                      กรอกอัตโนมัติ →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
