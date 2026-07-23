import { useState } from "react"
import { Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart } from "@/components/BarChart"
import { LoadingPopup } from "@/components/LoadingPopup"
import { useTranslation } from "@/hooks/useTranslation"
import { useQuery } from "@tanstack/react-query"
import { fetchReportData } from "@/services/reportService"
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards"
import { PaymentBreakdown } from "@/components/reports/PaymentBreakdown"
import { RecentTransactions } from "@/components/reports/RecentTransactions"

export function ReportsPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<"week" | "month">("week")

  // Fetch report data using useQuery
  const { data, isLoading: loading } = useQuery({
    queryKey: ["reports", period],
    queryFn: () => fetchReportData({ period }),
  })

  // Destructure values with fallbacks
  const summary = data?.summary ?? {
    todayRevenue: 0,
    todayAppointments: 0,
    avgPerBill: 0,
    targetPercent: 0,
    revenueChange: 0,
  }
  const chartData = data?.chartData ?? []
  const paymentBreakdown = data?.paymentBreakdown ?? []
  const recentTransactions = data?.recentTransactions ?? []
  const isOffline = data?.isOffline ?? false

  // Calculated values
  const maxRevenue = chartData.length ? Math.max(...chartData.map((d) => d.revenue)) : 0
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const totalAppointments = chartData.reduce((s, d) => s + d.appointments, 0)
  const avgPerDay = chartData.length ? Math.round(totalRevenue / chartData.length) : 0

  return (
    <div className="space-y-8">
      <LoadingPopup isOpen={loading} message={t("admin.reports.loading", "กำลังสรุปยอดรายงาน...")} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">{t("admin.reports.title", "รายงาน")}</h1>
          <p className="text-sm text-on-surface-variant font-semibold mt-1">{t("admin.reports.subtitle", "สรุปรายได้และสถิติการใช้งาน")}</p>
          {isOffline && (
            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {t("admin.reports.offline", "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ แสดงข้อมูลจำลอง (Offline Mode)")}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          className="shrink-0 gap-2 rounded-xl text-sm border-2 border-outline hover:bg-neutral-50 shadow-[2px_2px_0px_#c7d2fe] font-bold"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{t("admin.reports.download", "ดาวน์โหลดรายงาน")}</span>
        </Button>
      </div>

      {/* Today summary grids */}
      <ReportSummaryCards summary={summary} />

      {/* Revenue Chart */}
      <div className="y2k-card p-5">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-on-surface uppercase tracking-tight">
              {t("admin.reports.revenue", "รายได้")} {period === "week" ? t("admin.reports.weekly", "รายสัปดาห์") : t("admin.reports.monthly", "รายเดือน")}
            </h2>
            <p className="text-xs text-neutral-500 font-bold mt-1">
              {t("admin.reports.total", "รวม")} ฿{totalRevenue.toLocaleString()} · {totalAppointments} {t("admin.reports.appointments", "นัด")} · {t("admin.reports.average", "เฉลี่ย")} ฿{avgPerDay.toLocaleString()}/{t("admin.reports.perDay", "วัน")}
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
                {p === "week" ? t("admin.reports.week", "สัปดาห์") : t("admin.reports.month", "เดือน")}
              </button>
            ))}
          </div>
        </div>

        <BarChart data={chartData} maxValue={maxRevenue} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Payment Breakdown */}
        <PaymentBreakdown items={paymentBreakdown} />

        {/* Transactions list */}
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}
