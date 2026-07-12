import type { DayRevenue } from "@/types"

interface BarChartProps {
  data: DayRevenue[]
  maxValue: number
}

export function BarChart({ data, maxValue }: BarChartProps) {
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
