import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SummaryMetrics } from "@/services/reportService"

interface ReportSummaryCardsProps {
  summary: SummaryMetrics
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  const cardItems = [
    {
      label: "รายได้วันนี้",
      value: `฿${summary.todayRevenue.toLocaleString()}`,
      change: summary.revenueChange,
      color: "text-primary",
    },
    {
      label: "นัดหมายวันนี้",
      value: `${summary.todayAppointments} นัด`,
      change: null,
      color: "text-secondary",
    },
    {
      label: "เฉลี่ยต่อบิล",
      value: `฿${summary.avgPerBill.toLocaleString()}`,
      change: null,
      color: "text-tertiary",
    },
    {
      label: "เป้าหมายรายได้",
      value: `${summary.targetPercent}%`,
      change: null,
      color: "text-on-surface",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cardItems.map(({ label, value, change, color }) => (
        <div key={label} className="y2k-card p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{label}</p>
            <p className={cn("text-xl sm:text-2xl font-black mt-2", color)}>{value}</p>
          </div>
          {change !== null && (
            <p
              className={cn(
                "mt-2 flex items-center gap-1 text-[10px] font-bold",
                change >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3 stroke-[2.5px]" />
              ) : (
                <TrendingDown className="h-3 w-3 stroke-[2.5px]" />
              )}
              {Math.abs(change).toFixed(1)}% จากเมื่อวาน
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
