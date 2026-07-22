import { useState, type FormEvent } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { Eye, EyeOff, Sparkles, Lock, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
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

  // Destination after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard"

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
    <div className="relative flex min-h-screen overflow-hidden bg-mesh">
      <div className="fixed right-4 top-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* ── Left panel — branding (hidden on mobile) ── */}
      <div className="relative hidden flex-col items-center justify-center gap-8 bg-gradient-to-br from-[#818CF8] to-[#FB923C] px-12 text-white lg:flex lg:w-[480px] xl:w-[540px] border-r-4 border-on-surface">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "30px 30px" }} />

        <div className="relative space-y-8 text-center flex flex-col items-center">
          {/* Logo */}
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white border-3 border-on-surface shadow-[6px_6px_0px_#1e1b4b]">
            <span className="text-5xl">💅</span>
          </div>

          <div>
            <h1 className="text-6xl font-black tracking-tighter leading-none drop-shadow-[4px_4px_0px_#1e1b4b] text-white">Nailly</h1>
            <p className="mt-3 text-lg font-bold text-on-primary-container bg-primary-container/80 px-4 py-1.5 rounded-full border-2 border-primary inline-block">
              ระบบจัดการร้านทำเล็บ
            </p>
          </div>

          <div className="space-y-4 text-left w-full max-w-[320px] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 shadow-lg">
            {[
              { icon: "📅", text: "จัดการนัดหมายลูกค้าได้ง่ายดาย" },
              { icon: "💖", text: "บริหารบริการและราคาในที่เดียว" },
              { icon: "📊", text: "รายงานรายได้และสถิติรายวัน" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <span className="text-sm font-semibold tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-6 text-xs text-white/70 font-semibold uppercase tracking-wider">
          © 2025 Nailly — Nail Salon Management
        </p>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-6 flex flex-col items-center gap-2 lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-3 border-primary shadow-[4px_4px_0px_#FB923C] text-3xl">
              💅
            </div>
            <div className="text-center mt-1">
              <h1 className="text-3xl font-black text-primary tracking-tighter">Nailly</h1>
              <p className="text-xs text-secondary font-bold uppercase tracking-wider">ระบบจัดการร้านทำเล็บ</p>
            </div>
          </div>

          {/* Card */}
          <div className="y2k-card overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                  ยินดีต้อนรับกลับมา 👋
                </h2>
                <p className="mt-1 text-sm text-neutral-500 font-medium">
                  เข้าสู่ระบบเพื่อจัดการร้านทำเล็บของคุณ
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <label
                    htmlFor="login-username"
                    className="text-xs font-bold uppercase tracking-wider text-neutral-700"
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
                      maxLength={50}
                      className={cn(
                        "w-full rounded-xl border bg-neutral-50/50 py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all",
                        "focus:border-primary focus:ring-0 focus:bg-white shadow-[2px_2px_0px_0px_#c7d2fe]",
                        error
                          ? "border-red-400 focus:border-red-400"
                          : "border-neutral-200"
                      )}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-bold uppercase tracking-wider text-neutral-700"
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
                      maxLength={100}
                      className={cn(
                        "w-full rounded-xl border bg-neutral-50/50 py-3 pl-10 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all",
                        "focus:border-primary focus:ring-0 focus:bg-white shadow-[2px_2px_0px_0px_#c7d2fe]",
                        error
                          ? "border-red-400 focus:border-red-400"
                          : "border-neutral-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
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
                  <div className="flex items-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-[2px_2px_0px_0px_rgba(239,68,68,0.2)]">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all text-white font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      กำลังเข้าสู่ระบบ...
                    </span>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </Button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-6 rounded-2xl border-2 border-primary-container bg-primary-container/20 p-4 shadow-[3px_3px_0px_0px_#e0e7ff]">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1 text-xs text-neutral-600">
                    <p className="font-bold text-neutral-800 mb-1">
                      ข้อมูลสำหรับทดสอบ
                    </p>
                    <p className="font-semibold">
                      Username:{" "}
                      <code className="rounded bg-white border border-neutral-200 px-1.5 py-0.5 font-mono text-primary">
                        admin
                      </code>
                    </p>
                    <p className="mt-1 font-semibold">
                      Password:{" "}
                      <code className="rounded bg-white border border-neutral-200 px-1.5 py-0.5 font-mono text-primary">
                        nailly2025
                      </code>
                    </p>
                    <button
                      type="button"
                      onClick={fillDemo}
                      className="mt-2 text-primary hover:text-secondary font-bold underline underline-offset-2 transition-colors block text-left"
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
