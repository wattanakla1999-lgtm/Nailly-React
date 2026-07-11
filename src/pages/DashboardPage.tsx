import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  LogOut,
  Bell,
  Settings,
  ChevronRight,
  Clock,
  Star,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}

interface AppointmentProps {
  name: string
  service: string
  time: string
  status: "confirmed" | "pending" | "done"
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<AppointmentProps["status"], string> = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  done: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
}

const STATUS_LABEL: Record<AppointmentProps["status"], string> = {
  confirmed: "ยืนยัน",
  pending: "รอยืนยัน",
  done: "เสร็จ",
}

const NAV_ITEMS = [
  { label: "ภาพรวม", icon: LayoutDashboard },
  { label: "นัดหมาย", icon: Calendar },
  { label: "บริการ", icon: Scissors },
  { label: "ลูกค้า", icon: Users },
  { label: "รายงาน", icon: TrendingUp },
]

const MOCK_APPOINTMENTS: AppointmentProps[] = [
  { name: "สมใจ รักสวย", service: "Gel Manicure + Nail Art", time: "10:00", status: "confirmed" },
  { name: "นิดา มีสุข", service: "Pedicure Classic", time: "11:30", status: "pending" },
  { name: "วรรณา สวยงาม", service: "French Manicure", time: "13:00", status: "confirmed" },
  { name: "พิมพ์ใจ รุ่งเรือง", service: "Nail Extension", time: "14:30", status: "done" },
  { name: "กนกวรรณ ดาวแดง", service: "Gel Pedicure", time: "15:30", status: "pending" },
]

const POPULAR_SERVICES = [
  { name: "Gel Manicure", count: 42, percent: 80 },
  { name: "Nail Art", count: 31, percent: 60 },
  { name: "Pedicure", count: 28, percent: 54 },
  { name: "Nail Extension", count: 19, percent: 37 },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl", color)}>
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-neutral-300 dark:text-neutral-600" />
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">{label}</p>
        <p className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 truncate">{sub}</p>
      </div>
    </div>
  )
}

function AppointmentRow({ name, service, time, status }: AppointmentProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-3 py-3 sm:px-4 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-semibold text-sm dark:bg-rose-950 dark:text-rose-400">
        {name.charAt(0)}
      </div>

      {/* Name + service */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{name}</p>
        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{service}</p>
      </div>

      {/* Time + Status — stacked on xs, inline on sm+ */}
      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="h-3 w-3" />
          {time}
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
          {STATUS_LABEL[status]}
        </span>
      </div>
    </div>
  )
}

// ─── Mobile Drawer ─────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeIndex: number
  onSelect: (i: number) => void
  user: { name: string; username: string; role: string } | null
  onLogout: () => void
}

function MobileDrawer({ isOpen, onClose, activeIndex, onSelect, user, onLogout }: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-900 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-xl shadow-sm">
              💅
            </div>
            <div>
              <span className="block text-sm font-black text-rose-500 leading-none">Nailly</span>
              <span className="block text-[10px] text-neutral-400 leading-none">Nail Salon</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon }, i) => (
              <button
                key={label}
                onClick={() => { onSelect(i); onClose() }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  activeIndex === i
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-neutral-100 px-4 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-sm font-bold text-white">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-neutral-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeIndex={activeNav}
        onSelect={setActiveNav}
        user={user}
        onLogout={handleLogout}
      />

      {/* ── Top Navigation ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left — hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              aria-label="เปิดเมนู"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-xl shadow-sm">
                💅
              </div>
              <div className="hidden sm:block">
                <span className="block text-sm font-black text-rose-500 leading-none">Nailly</span>
                <span className="block text-[10px] text-neutral-400 leading-none">Nail Salon</span>
              </div>
            </div>
          </div>

          {/* Center — desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ label }, i) => (
              <button
                key={label}
                onClick={() => setActiveNav(i)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeNav === i
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                )}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right — actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notification bell */}
            <button
              aria-label="การแจ้งเตือน"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            {/* Settings — hidden on xs */}
            <button
              aria-label="ตั้งค่า"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User avatar chip — show only name initial on xs */}
            <div className="ml-1 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 sm:px-3 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-bold text-white">
                {user?.name?.charAt(0) ?? "A"}
              </div>
              <span className="hidden lg:block text-sm font-medium text-neutral-700 dark:text-neutral-300 max-w-[120px] truncate">
                {user?.name}
              </span>
            </div>

            {/* Logout — icon only on xs/sm, text on md+ */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hidden md:flex"
              aria-label="ออกจากระบบ"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">

        {/* Welcome header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">
              สวัสดี, {user?.name} 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{today}</p>
          </div>
          <Button className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200/50 hover:from-rose-600 hover:to-pink-600 dark:shadow-rose-900/20 text-sm">
            <Calendar className="h-4 w-4" />
            <span className="hidden xs:inline">เพิ่มนัดหมาย</span>
            <span className="xs:hidden">เพิ่ม</span>
          </Button>
        </div>

        {/* Stats Grid — 2 cols on mobile, 4 cols on lg */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />}
            label="นัดหมายวันนี้"
            value="12"
            sub="↑ 3 จากเมื่อวาน"
            color="bg-rose-100 dark:bg-rose-950"
          />
          <StatCard
            icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500" />}
            label="ลูกค้าทั้งหมด"
            value="248"
            sub="↑ 5 คนใหม่สัปดาห์นี้"
            color="bg-violet-100 dark:bg-violet-950"
          />
          <StatCard
            icon={<Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />}
            label="บริการที่ให้"
            value="8"
            sub="ประเภทบริการ"
            color="bg-teal-100 dark:bg-teal-950"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />}
            label="รายได้วันนี้"
            value="฿3,200"
            sub="เป้าหมาย ฿5,000"
            color="bg-amber-100 dark:bg-amber-950"
          />
        </div>

        {/* Main grid — stacks vertically on mobile, 3-col on lg */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Appointments */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                นัดหมายวันนี้
              </h2>
              <button className="text-sm text-rose-500 hover:text-rose-600 transition-colors">
                ดูทั้งหมด →
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {MOCK_APPOINTMENTS.map((apt) => (
                <AppointmentRow key={`${apt.name}-${apt.time}`} {...apt} />
              ))}
            </div>
          </div>

          {/* Sidebar — Popular services */}
          <div>
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
              บริการยอดนิยม
            </h2>
            <div className="space-y-3">
              {POPULAR_SERVICES.map((svc) => (
                <div
                  key={svc.name}
                  className="rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-900 dark:text-white">{svc.name}</span>
                    <span className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {svc.count}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 transition-all"
                      style={{ width: `${svc.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Bottom Navigation (mobile only) ──────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.slice(0, 5).map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              onClick={() => setActiveNav(i)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-0",
                activeNav === i
                  ? "text-rose-500"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", activeNav === i && "scale-110")} />
              <span className="text-[10px] font-medium truncate">{label}</span>
            </button>
          ))}
        </div>
        {/* Safe area for iOS home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </nav>
    </div>
  )
}
