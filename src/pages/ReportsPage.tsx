import { useState } from "react"
import { TrendingUp, TrendingDown, ArrowUpRight, Calendar, Download } from "lucide-react"
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
  { id: "1", customer: "สมใจ รักสวย", service: "Gel Manicure + Nail Art", amount: 650, time: "10:45", staff: "น้องนุ่น", method: "transfer" },
  { id: "2", customer: "วรรณา สวยงาม", service: "French Manicure", amount: 450, time: "14:00", staff: "น้องนุ่น", method: "cash" },
  { id: "3", customer: "พิมพ์ใจ รุ่งเรือง", service: "Nail Extension", amount: 900, time: "16:00", staff: "น้องแนน", method: "card" },
  { id: "4", customer: "มาลี สดใส", service: "Pedicure Classic", amount: 350, time: "09:30", staff: "น้องแนน", method: "transfer" },
  { id: "5", customer: "กนกวรรณ ดาวแดง", service: "Gel Pedicure", amount: 480, time: "11:00", staff: "น้องนุ่น", method: "cash" },
]

const METHOD_CONFIG: Record<Transaction["method"], { label: string; styles: string }> = {
  cash:     { label: "เงินสด", styles: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  transfer: { label: "โอนเงิน", styles: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
  card:     { label: "บัตร", styles: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" },
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ data, maxValue }: { data: DayRevenue[]; maxValue: number }) {
  return (
    <div className="flex h-48 items-end justify-between gap-1 px-1">
      {data.map(({ day, revenue }) => {
        const heightPct = maxValue > 0 ? (revenue / maxValue) * 100 : 0
        return (
          <div key={day} className="group flex flex-1 flex-col items-center gap-1">
            {/* Tooltip */}
            <div className="hidden group-hover:flex flex-col items-center">
              <div className="rounded-lg bg-neutral-900 px-2 py-1 text-[10px] text-white dark:bg-white dark:text-neutral-900 whitespace-nowrap shadow-md">
                ฿{revenue.toLocaleString()}
              </div>
              <div className="h-1.5 w-0.5 bg-neutral-900/30 dark:bg-white/30" />
            </div>
            {/* Bar */}
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-rose-500 to-pink-400 transition-all duration-500 hover:from-rose-600 hover:to-pink-500 cursor-pointer min-h-[4px]"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{day}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

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
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">รายงาน</h1>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">สรุปรายได้และสถิติ</p>
        </div>
        <Button
          variant="outline"
          className="shrink-0 gap-2 rounded-xl text-sm border-neutral-200 dark:border-neutral-700"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">ดาวน์โหลด</span>
        </Button>
      </div>

      {/* Today summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "รายได้วันนี้", value: `฿${todayRevenue.toLocaleString()}`, change: revenueChange, icon: TrendingUp },
          { label: "นัดหมายวันนี้", value: "12 นัด", change: 15, icon: Calendar },
          { label: "ค่าเฉลี่ย/ลูกค้า", value: "฿267", change: -3, icon: ArrowUpRight },
          { label: "เป้าหมายวันนี้", value: "64%", change: null, icon: TrendingUp },
        ].map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{label}</p>
              <Icon className="h-4 w-4 text-neutral-300 shrink-0" />
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white">{value}</p>
            {change !== null && (
              <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", change >= 0 ? "text-emerald-500" : "text-red-500")}>
                {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(change).toFixed(1)}% จากเมื่อวาน
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="mb-6 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              รายได้ {period === "week" ? "รายสัปดาห์" : "รายเดือน"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              รวม ฿{totalRevenue.toLocaleString()} · {totalAppointments} นัด · เฉลี่ย ฿{avgPerDay.toLocaleString()}/วัน
            </p>
          </div>
          <div className="flex gap-1 rounded-xl border border-neutral-200 p-1 dark:border-neutral-700">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                  period === p
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                {p === "week" ? "สัปดาห์" : "เดือน"}
              </button>
            ))}
          </div>
        </div>

        <BarChart data={chartData} maxValue={maxRevenue} />
      </div>

      {/* Two-col layout: payment method + recent tx */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* Payment Method Breakdown */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-white">ช่องทางชำระเงิน</h2>
          <div className="space-y-4">
            {[
              { method: "โอนเงิน", percent: 55, amount: 1760, color: "from-blue-400 to-blue-500" },
              { method: "เงินสด", percent: 30, amount: 960, color: "from-emerald-400 to-emerald-500" },
              { method: "บัตร", percent: 15, amount: 480, color: "from-violet-400 to-violet-500" },
            ].map(({ method, percent, amount, color }) => (
              <div key={method}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{method}</span>
                  <span className="text-neutral-400">฿{amount.toLocaleString()} · {percent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className={cn("h-2.5 rounded-full bg-gradient-to-r transition-all", color)}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-3">
          <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-white">รายการล่าสุด</h2>
          <div className="space-y-3">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 font-semibold text-sm dark:bg-rose-950 dark:text-rose-400">
                  {tx.customer.charAt(0)}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{tx.customer}</p>
                  <p className="truncate text-xs text-neutral-400">{tx.service} · {tx.time}</p>
                </div>
                {/* Amount + badge */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-rose-500">+฿{tx.amount}</p>
                  <span className={cn("text-[10px] font-medium rounded-full px-1.5 py-0.5", METHOD_CONFIG[tx.method].styles)}>
                    {METHOD_CONFIG[tx.method].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
