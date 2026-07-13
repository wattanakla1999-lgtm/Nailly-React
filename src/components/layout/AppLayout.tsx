import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  UserRoundCog,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Plus,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "ภาพรวม", icon: LayoutDashboard, to: "/dashboard" },
  { label: "การนัดหมาย", icon: Calendar, to: "/appointments" },
  { label: "บริการ", icon: Scissors, to: "/services" },
  { label: "ช่างทำเล็บ", icon: UserRoundCog, to: "/technicians" },
  { label: "ลูกค้า", icon: Users, to: "/customers" },
  { label: "รายงาน", icon: TrendingUp, to: "/reports" },
  { label: "ตั้งค่า", icon: Settings, to: "/settings" },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-mesh text-on-surface font-sans antialiased">
      {/* ── Mobile Top Navigation ── */}
      <nav className="md:hidden bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 border-b-4 border-outline shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 w-full max-w-7xl mx-auto">
          <div className="text-2xl text-primary font-extrabold tracking-tighter">Nailly</div>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="text-primary hover:text-secondary transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary cursor-pointer hover:scale-105 transition-transform flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
              {user?.name?.charAt(0) ?? "A"}
            </div>
          </div>
        </div>
        {/* Scrollable Submenu */}
        <div className="flex overflow-x-auto px-6 gap-6 pb-2 hide-scrollbar scroll-smooth">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "pb-1 whitespace-nowrap text-sm uppercase font-semibold transition-all border-b-4",
                  isActive
                    ? "text-primary font-bold border-secondary"
                    : "text-on-surface-variant/70 border-transparent hover:text-primary"
                )}
              >
                {label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* ── Desktop Side Navigation ── */}
      <aside className="hidden md:flex bg-surface h-screen w-64 fixed left-0 top-0 border-r-4 border-outline flex-col p-4 gap-4 z-40">
        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6 mt-4 px-2">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary shadow-[2px_2px_0px_#FB923C] flex items-center justify-center bg-gradient-to-br from-[#818CF8] to-[#FB923C] text-white text-2xl font-black">
            💅
          </div>
          <div>
            <h1 className="text-2xl text-primary font-black tracking-tighter leading-none">Nailly</h1>
            <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-1">Management</p>
          </div>
        </div>

        {/* Action Button (Add Appt shortcut) */}
        <div className="px-1 mb-2">
          <button
            onClick={() => navigate("/appointments")}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 px-4 font-bold uppercase tracking-wider border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            จองคิวใหม่
          </button>
        </div>

        {/* Main Nav Links */}
        <nav className="flex flex-col gap-2.5 flex-grow">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary-container text-on-primary-container border-2 border-primary shadow-[4px_4px_0px_0px_#FB923C] translate-x-[-2px] translate-y-[-2px] font-bold"
                    : "text-on-surface-variant/80 hover:bg-surface-variant/40 hover:text-primary hover:translate-x-1 font-semibold"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                <span className="text-xs uppercase tracking-wider">{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer Nav Links */}
        <div className="mt-auto flex flex-col gap-1.5 border-t-2 border-outline-variant/60 pt-4">
          <button
            onClick={() => navigate("/settings")}
            className="text-on-surface-variant/80 flex items-center gap-3 px-4 py-2 hover:bg-surface-variant/40 hover:text-primary rounded-xl transition-all font-semibold hover:translate-x-1 text-left w-full"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">ตั้งค่า</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-on-surface-variant/80 flex items-center gap-3 px-4 py-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all font-semibold hover:translate-x-1 text-left w-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* ── Page Container ── */}
      <main className="pt-[110px] pb-16 md:pt-8 md:ml-64 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
