import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
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
  to?: string
}

interface AppointmentItem {
  name: string
  service: string
  time: string
  status: "confirmed" | "pending" | "done"
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<AppointmentItem["status"], string> = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  done: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
}

const STATUS_LABEL: Record<AppointmentItem["status"], string> = {
  confirmed: "ยืนยัน",
  pending: "รอยืนยัน",
  done: "เสร็จ",
}

const MOCK_APPOINTMENTS: AppointmentItem[] = [
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

function StatCard({ icon, label, value, sub, color, to }: StatCardProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => to && navigate(to)}
      className={cn(
        "rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900",
        to && "cursor-pointer"
      )}
    >
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

function AppointmentRow({ name, service, time, status }: AppointmentItem) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-3 py-3 sm:px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-semibold text-sm dark:bg-rose-950 dark:text-rose-400">
        {name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{name}</p>
        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{service}</p>
      </div>
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      {/* Welcome header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">
            สวัสดี, {user?.name} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{today}</p>
        </div>
        <Button
          onClick={() => navigate("/appointments")}
          className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200/50 hover:from-rose-600 hover:to-pink-600 dark:shadow-rose-900/20 text-sm"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">เพิ่มนัดหมาย</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />}
          label="นัดหมายวันนี้"
          value="12"
          sub="↑ 3 จากเมื่อวาน"
          color="bg-rose-100 dark:bg-rose-950"
          to="/appointments"
        />
        <StatCard
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500" />}
          label="ลูกค้าทั้งหมด"
          value="248"
          sub="↑ 5 คนใหม่สัปดาห์นี้"
          color="bg-violet-100 dark:bg-violet-950"
          to="/customers"
        />
        <StatCard
          icon={<Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />}
          label="บริการที่ให้"
          value="8"
          sub="ประเภทบริการ"
          color="bg-teal-100 dark:bg-teal-950"
          to="/services"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />}
          label="รายได้วันนี้"
          value="฿3,200"
          sub="เป้าหมาย ฿5,000"
          color="bg-amber-100 dark:bg-amber-950"
          to="/reports"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Appointments */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
              นัดหมายวันนี้
            </h2>
            <button
              onClick={() => navigate("/appointments")}
              className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
            >
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
              บริการยอดนิยม
            </h2>
            <button
              onClick={() => navigate("/services")}
              className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
            >
              ดูทั้งหมด →
            </button>
          </div>
          <div className="space-y-3">
            {POPULAR_SERVICES.map((svc) => (
              <div key={svc.name} className="rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
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
    </>
  )
}
