import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  ArrowUp,
  Sparkles,
  Star,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/StatCard"
import { AppointmentRow } from "@/components/AppointmentRow"
import { LoadingPopup } from "@/components/LoadingPopup"
import { useQuery } from "@tanstack/react-query"
import { fetchDashboardData } from "@/services/dashboardService"

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  })

  const todayStr = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (isLoading) {
    return <LoadingPopup isOpen={true} message="กำลังโหลดข้อมูลแดชบอร์ด..." />
  }

  const stats = data || {
    todayAppointments: 0,
    todayAppointmentsChange: 0,
    totalCustomers: 0,
    totalCustomersChange: "",
    activeServicesCount: 0,
    todayRevenue: 0,
    appointments: [],
    popularServices: [],
    isOffline: false,
  }

  const isOffline = !!stats.isOffline

  return (
    <div className="flex flex-col gap-8">
      {isOffline && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800">
          ⚠️ กำลังแสดงข้อมูลแบบออฟไลน์ (เชื่อมต่อเซิร์ฟเวอร์ไม่ได้)
        </div>
      )}

      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">สวัสดี, คุณ{user?.name || "มินนี่"} 👋</h2>
          <p className="text-base text-on-surface-variant mt-1 font-semibold">{todayStr}</p>
        </div>
        <Button
          onClick={() => navigate("/appointments")}
          className="w-full sm:w-auto bg-gradient-to-r from-[#818CF8] to-[#FB923C] text-white rounded-xl py-3 px-6 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5 stroke-[3px]" />
          เพิ่มนัดหมาย
        </Button>
      </section>

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label="นัดหมายวันนี้"
          value={String(stats.todayAppointments)}
          sub={
            stats.todayAppointmentsChange > 0 ? (
              <span className="font-bold text-xs text-secondary bg-secondary-container px-2.5 py-0.5 rounded-lg border-2 border-secondary shadow-[2px_2px_0px_#FB923C] flex items-center gap-0.5">
                <ArrowUp className="h-3 w-3 stroke-[3px]" /> {stats.todayAppointmentsChange}
              </span>
            ) : undefined
          }
          color="bg-primary-container border-primary text-primary"
          to="/appointments"
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="ลูกค้าทั้งหมด"
          value={String(stats.totalCustomers)}
          sub={
            stats.totalCustomersChange ? (
              <span className="font-bold text-xs text-tertiary bg-tertiary-container px-2.5 py-0.5 rounded-lg border-2 border-tertiary shadow-[2px_2px_0px_#a78bfa] flex items-center gap-0.5">
                <ArrowUp className="h-3 w-3 stroke-[3px]" /> {stats.totalCustomersChange}
              </span>
            ) : undefined
          }
          color="bg-secondary-container border-secondary text-secondary"
          to="/customers"
        />
        <StatCard
          icon={<Scissors className="h-6 w-6" />}
          label="บริการที่ให้"
          value={String(stats.activeServicesCount)}
          sub={
            <span className="font-bold text-xs text-on-surface-variant bg-surface-variant px-2.5 py-0.5 rounded-lg border-2 border-outline-variant">
              ประเภท
            </span>
          }
          color="bg-tertiary-container border-tertiary text-tertiary"
          to="/services"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="รายได้วันนี้"
          value={`฿${stats.todayRevenue.toLocaleString()}`}
          color="bg-gradient-to-br from-[#818CF8] to-[#FB923C] border-on-surface text-white"
          to="/reports"
        />
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
        {/* Left: นัดหมายวันนี้ */}
        <div className="lg:col-span-2 y2k-card flex flex-col p-0 overflow-hidden">
          <div className="p-5 border-b-2 border-outline-variant flex justify-between items-center bg-surface-variant/30 rounded-t-xl">
            <h3 className="font-black text-xl text-on-surface uppercase tracking-tight">นัดหมายวันนี้</h3>
            <button
              onClick={() => navigate("/appointments")}
              className="text-primary font-bold text-sm hover:text-secondary underline decoration-2 underline-offset-4 transition-colors"
            >
              ดูทั้งหมด
            </button>
          </div>
          <div className="flex flex-col p-4 gap-4 bg-white">
            {stats.appointments.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-neutral-400">
                ไม่มีรายการนัดหมายวันนี้ค่ะ
              </div>
            ) : (
              stats.appointments.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  name={apt.name}
                  service={apt.service}
                  time={apt.time}
                  status={apt.status}
                  avatarText={apt.avatarText || apt.name.trim().charAt(0)}
                  imgUrl={apt.imgUrl}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: บริการยอดนิยม */}
        <div className="lg:col-span-1 y2k-card flex flex-col p-5 bg-surface-variant/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl text-on-surface uppercase tracking-tight">บริการยอดนิยม</h3>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col gap-6">
            {stats.popularServices.map((svc) => (
              <div key={svc.name}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-on-surface">{svc.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-xs text-on-surface-variant">
                        {svc.rate} ({svc.count})
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-base text-primary">{svc.percent}%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-3 border-2 border-outline-variant overflow-hidden">
                  <div className={cn("h-full rounded-full", svc.color)} style={{ width: `${svc.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
