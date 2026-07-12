import { useState, useEffect } from "react"
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
import type { Appointment } from "@/types"

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [customAppointments, setCustomAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)

    try {
      const stored = localStorage.getItem("nailly_custom_appointments")
      if (stored) {
        setCustomAppointments(JSON.parse(stored))
      }
    } catch (e) {
      console.error(e)
    }

    return () => clearTimeout(timer)
  }, [])

  const todayStr = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col gap-8">
      <LoadingPopup isOpen={loading} message="กำลังโหลดข้อมูลแดชบอร์ด..." />

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
          value="12"
          sub={
            <span className="font-bold text-xs text-secondary bg-secondary-container px-2.5 py-0.5 rounded-lg border-2 border-secondary shadow-[2px_2px_0px_#FB923C] flex items-center gap-0.5">
              <ArrowUp className="h-3 w-3 stroke-[3px]" /> 3
            </span>
          }
          color="bg-primary-container border-primary text-primary"
          to="/appointments"
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="ลูกค้าทั้งหมด"
          value="248"
          sub={
            <span className="font-bold text-xs text-tertiary bg-tertiary-container px-2.5 py-0.5 rounded-lg border-2 border-tertiary shadow-[2px_2px_0px_#a78bfa] flex items-center gap-0.5">
              <ArrowUp className="h-3 w-3 stroke-[3px]" /> 5 ใหม่
            </span>
          }
          color="bg-secondary-container border-secondary text-secondary"
          to="/customers"
        />
        <StatCard
          icon={<Scissors className="h-6 w-6" />}
          label="บริการที่ให้"
          value="8"
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
          value="฿3,200"
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
            {customAppointments.map((apt, idx) => {
              const displayName = apt.name || apt.customerName || "ไม่ระบุชื่อ";
              return (
                <AppointmentRow
                  key={`custom-${idx}`}
                  name={`คุณ ${displayName}`}
                  service={apt.service || "บริการทำเล็บ"}
                  time={apt.time || "00:00"}
                  status={apt.status || "pending"}
                  avatarText={displayName.charAt(0)}
                />
              )
            })}
            <AppointmentRow
              name="คุณพิม พิมประภา"
              service="ต่อเล็บเจล + เพ้นท์ลาย"
              time="10:00"
              status="active"
              imgUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDhNpXZyacwG5q2S5HlwjiZ5Mr-kBxeh9rY_oUy58fKAWSFtkjevptHv8BZrlthTr6wg7GGomNMCZQTfThLURSNaBXGhfZZJROnvTIP2ntFy4C6Ki45ZQIbBf5QOswezsekhCTgNbSzCTFdRG1OnKpYLlrtZcQPsW-r7RFD-Jb4mLUjd9-04tEk0pivo5BZMJwYqbM23DDZBKa2jmAEYE83YpYioDWqJWG6a7OeZqZA_E-gtCgxHg4d0Brc9NeXivDDo1v127RIdQ0"
            />
            <AppointmentRow
              name="คุณอรัญญา"
              service="สปามือและเท้า + ทาสีเจล"
              time="13:30"
              status="pending"
              imgUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBQAdLpKVRx3Ilt3FqqiqbjG-RzEzl7HlLcLasPv7TGtAuv9KATFEynIMpQOWpsDXxY5iS7ARBNMX_U0_5cqobN45jvBS4DC27DlwJUYafl1YgAGu73S0Zqc5lDQTcwVeVVyBH50jdAw1pTiUBXclHUTfuLyEf7Ktyrnb2Jnn8ANLWxTI9yjk6VjbcxeL5DSBK9SxuaTXQu_FP3C3UmMRcQ0-R8IWvtm3dCN6sxTlVkrtfpFfjY8uqISUTI0Zkbs85UMJuLYgy_ncU"
            />
            <AppointmentRow
              name="คุณเจนนิเฟอร์"
              service="ถอดเล็บเจล"
              time="15:00"
              status="confirmed"
              avatarText="จ"
            />
            <AppointmentRow
              name="คุณลูกศร"
              service="ทาสีเจลมือ (สีพื้น)"
              time="16:30"
              status="confirmed"
              imgUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDaeplGl0eg0XDgBHNcLjjTKmTkE9MaJ7D28RnajVemY6abga4I7eDODXu_WoAVgNZinJJL5pH4yn-bFtRPSZTta3I2jnRerFLE-jQBxz7jJ5fXBBjX42MKq3TrXFXuI2ZA52SUoMHEm5ABUNCo_tiKnx8I4YuOEiyi6CqCr-u4O7FV_AuXjxjYdw_2u7-gBNJtUoMhVMYPV-8fWmCC46lgSqjThCweVOAXBLmP0R4_RE9sBy4PBuldTabvod1hemYU3w2bGCARW_Y"
            />
          </div>
        </div>

        {/* Right: บริการยอดนิยม */}
        <div className="lg:col-span-1 y2k-card flex flex-col p-5 bg-surface-variant/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl text-on-surface uppercase tracking-tight">บริการยอดนิยม</h3>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col gap-6">
            {[
              { name: "ทาสีเจลมือ", rate: 4.9, count: 124, percent: 45, color: "from-[#818CF8] to-[#FB923C]" },
              { name: "สปามือ-เท้า", rate: 4.8, count: 89, percent: 30, color: "bg-[#FB923C]" },
              { name: "ต่อเล็บ PVC", rate: 4.7, count: 56, percent: 15, color: "bg-[#a78bfa]" },
              { name: "เพ้นท์ลายศิลปะ", rate: 4.9, count: 42, percent: 10, color: "bg-[#818CF8]" },
            ].map((svc) => (
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
