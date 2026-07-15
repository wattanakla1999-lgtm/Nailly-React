import { cn } from "@/lib/utils"
import type { PaymentBreakdownItem } from "@/services/reportService"

interface PaymentBreakdownProps {
  items: PaymentBreakdownItem[]
}

const METHOD_CONFIG: Record<
  PaymentBreakdownItem["method"],
  { label: string; color: string }
> = {
  transfer: { label: "โอนเงิน", color: "from-blue-400 to-blue-500" },
  cash: { label: "เงินสด", color: "from-emerald-400 to-emerald-500" },
  card: { label: "บัตรเครดิต", color: "from-violet-400 to-violet-500" },
}

export function PaymentBreakdown({ items }: PaymentBreakdownProps) {
  return (
    <div className="y2k-card p-5 lg:col-span-2 flex flex-col bg-surface-variant/20">
      <h2 className="mb-6 text-base font-black text-on-surface uppercase tracking-tight">ช่องทางชำระเงิน</h2>
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {items.map(({ method, percent, amount }) => {
          const config = METHOD_CONFIG[method] || { label: method, color: "from-neutral-400 to-neutral-500" }
          return (
            <div key={method}>
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-neutral-700">{config.label}</span>
                <span className="text-neutral-500">
                  ฿{amount.toLocaleString()} ({percent}%)
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-3 border-2 border-outline-variant overflow-hidden">
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r", config.color)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
