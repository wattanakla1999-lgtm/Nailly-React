import { useState } from "react"
import { TrendingUp, TrendingDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DayRevenue {
  day: string
  revenue: number
  appointments: number
}

interface Transaction {
  id: string
  customer: string
  service: string
  amount: number
  time: string
  staff: string
  method: "cash" | "transfer" | "card"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WEEKLY_DATA: DayRevenue[] = [
  { day: "จ.", revenue: 2800, appointments: 8 },
  { day: "อ.", revenue: 4200, appointments: 12 },
  { day: "พ.", revenue: 3500, appointments: 10 },
  { day: "พฤ.", revenue: 5100, appointments: 15 },
  { day: "ศ.", revenue: 6200, appointments: 18 },
  { day: "ส.", revenue: 7800, appointments: 22 },
  { day: "อา.", revenue: 3200, appointments: 9 },
]

const MONTHLY_DATA: DayRevenue[] = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(Math.random() * 6000) + 1000,
  appointments: Math.floor(Math.random() * 15) + 3,
}))

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: "1", customer: "คุณสมใจ รักสวย", service: "Gel Manicure + Nail Art", amount: 650, time: "10:45", staff: "น้องนุ่น", method: "transfer" },
  { id: "2", customer: "คุณวรรณา สวยงาม", service: "French Manicure", amount: 450, time: "14:00", staff: "น้องนุ่น", method: "cash" },
  { id: "3", customer: "คุณพิมพ์ใจ รุ่งเรือง", service: "Nail Extension", amount: 900, time: "16:00", staff: "น้องแนน", method: "card" },
  { id: "4", customer: "คุณมาลี สดใส", service: "Pedicure Classic", amount: 350, time: "09:30", staff: "น้องแนน", method: "transfer" },
  { id: "5", customer: "คุณกนกวรรณ ดาวแดง", service: "Gel Pedicure", amount: 480, time: "11:00", staff: "น้องนุ่น", method: "cash" },
]

const METHOD_CONFIG: Record<Transaction["method"], { label: string; styles: string }> = {
  cash:     { label: "เงินสด", styles: "bg-emerald-100 text-emerald-700 border-emerald-500 shadow-[1px_1px_0px_rgba(16,185,129,0.2)]" },
  transfer: { label: "โอนเงิน", styles: "bg-blue-100 text-blue-700 border-blue-500 shadow-[1px_1px_0px_rgba(59,130,246,0.2)]" },
  card:     { label: "บัตร", styles: "bg-violet-100 text-violet-700 border-violet-500 shadow-[1px_1px_0px_rgba(139,92,246,0.2)]" },
}

function BarChart({ data, maxValue }: { data: DayRevenue[]; maxValue: number }) {
  return (
    <div className="flex h-48 items-end justify-between gap-1.5 px-1 pt-6">
      {data.map(({ day, revenue }) => {
        const heightPct = maxValue > 0 ? (revenue / maxValue) * 100 : 0
        return (
          <div key={day} className="group flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
            <div className="hidden group-hover:flex flex-col items-center">
              <div className="rounded-lg bg-neutral-900 px-2.5 py-1 text-[10px] text-white whitespace-nowrap shadow-md border border-neutral-700 font-bold">
                ฿{revenue.toLocaleString()}
              </div>
              <div className="h-1.5 w-0.5 bg-neutral-900" />
            </div>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary transition-all duration-300 hover:scale-x-105 cursor-pointer min-h-[4px] border-x-2 border-t-2 border-on-surface"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-neutral-400 font-bold">{day}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ReportsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week")

  const chartData = period === "week" ? WEEKLY_DATA : MONTHLY_DATA
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue))
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const totalAppointments = chartData.reduce((s, d) => s + d.appointments, 0)
  const avgPerDay = Math.round(totalRevenue / chartData.length)
  const todayRevenue = 3200
  const yesterdayRevenue = 2950
  const revenueChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">รายงาน</h1>
          <p className="text-sm text-on-surface-variant font-semibold mt-1">สรุปรายได้และสถิติการใช้งาน</p>
        </div>
        <Button
          variant="outline"
          className="shrink-0 gap-2 rounded-xl text-sm border-2 border-outline hover:bg-neutral-50 shadow-[2px_2px_0px_#c7d2fe] font-bold"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">ดาวน์โหลดรายงาน</span>
        </Button>
      </div>

      {/* Today summary grids */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "รายได้วันนี้", value: `฿${todayRevenue.toLocaleString()}`, change: revenueChange, color: "text-primary" },
          { label: "นัดหมายวันนี้", value: `${totalAppointments} นัด`, change: 15, color: "text-secondary" },
          { label: "เฉลี่ยต่อบิล", value: "฿267", change: -3, color: "text-tertiary" },
          { label: "เป้าหมายรายได้", value: "64%", change: null, color: "text-on-surface" },
        ].map(({ label, value, change, color }) => (
          <div key={label} className="y2k-card p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{label}</p>
              <p className={cn("text-xl sm:text-2xl font-black mt-2", color)}>{value}</p>
            </div>
            {change !== null && (
              <p className={cn("mt-2 flex items-center gap-1 text-[10px] font-bold", change >= 0 ? "text-emerald-500" : "text-red-500")}>
                {change >= 0 ? <TrendingUp className="h-3 w-3 stroke-[2.5px]" /> : <TrendingDown className="h-3 w-3 stroke-[2.5px]" />}
                {Math.abs(change).toFixed(1)}% จากเมื่อวาน
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="y2k-card p-5">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-on-surface uppercase tracking-tight">
              รายได้ {period === "week" ? "รายสัปดาห์" : "รายเดือน"}
            </h2>
            <p className="text-xs text-neutral-500 font-bold mt-1">
              รวม ฿{totalRevenue.toLocaleString()} · {totalAppointments} นัด · เฉลี่ย ฿{avgPerDay.toLocaleString()}/วัน
            </p>
          </div>
          <div className="flex gap-1 rounded-xl border-2 border-outline-variant p-1 bg-neutral-50 self-start">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                  period === p
                    ? "bg-primary text-on-primary border-2 border-primary shadow-[2px_2px_0px_#1e1b4b] -translate-y-0.5"
                    : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {p === "week" ? "สัปดาห์" : "เดือน"}
              </button>
            ))}
          </div>
        </div>

        <BarChart data={chartData} maxValue={maxRevenue} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Payment Breakdown */}
        <div className="y2k-card p-5 lg:col-span-2 flex flex-col bg-surface-variant/20">
          <h2 className="mb-6 text-base font-black text-on-surface uppercase tracking-tight">ช่องทางชำระเงิน</h2>
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {[
              { method: "โอนเงิน", percent: 55, amount: 1760, color: "from-blue-400 to-blue-500", border: "border-blue-500" },
              { method: "เงินสด", percent: 30, amount: 960, color: "from-emerald-400 to-emerald-500", border: "border-emerald-500" },
              { method: "บัตรเครดิต", percent: 15, amount: 480, color: "from-violet-400 to-violet-500", border: "border-violet-500" },
            ].map(({ method, percent, amount, color }) => (
              <div key={method}>
                <div className="mb-2 flex justify-between text-xs font-bold">
                  <span className="text-neutral-700">{method}</span>
                  <span className="text-neutral-500">฿{amount.toLocaleString()} ({percent}%)</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-3 border-2 border-outline-variant overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", color)}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions list */}
        <div className="y2k-card p-5 lg:col-span-3">
          <h2 className="mb-4 text-base font-black text-on-surface uppercase tracking-tight">รายการล่าสุด</h2>
          <div className="space-y-4">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-outline-variant/50 transition-colors"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary font-black border-2 border-primary shadow-[2px_2px_0px_#818CF8]">
                  {tx.customer.charAt(3)}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-neutral-900">{tx.customer}</p>
                  <p className="truncate text-[11px] text-neutral-400 font-semibold mt-0.5">
                    {tx.service} · {tx.time} น.
                  </p>
                </div>
                {/* Amount */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-primary">+฿{tx.amount}</p>
                  <span className={cn("text-[9px] font-black rounded-full px-2 py-0.5 border inline-block mt-1", METHOD_CONFIG[tx.method].styles)}>
                    {METHOD_CONFIG[tx.method].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
