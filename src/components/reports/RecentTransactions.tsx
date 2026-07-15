import { cn } from "@/lib/utils"
import type { Transaction } from "@/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const METHOD_CONFIG: Record<
  Transaction["method"],
  { label: string; styles: string }
> = {
  cash: {
    label: "เงินสด",
    styles: "bg-emerald-100 text-emerald-700 border-emerald-500 shadow-[1px_1px_0px_rgba(16,185,129,0.2)]",
  },
  transfer: {
    label: "โอนเงิน",
    styles: "bg-blue-100 text-blue-700 border-blue-500 shadow-[1px_1px_0px_rgba(59,130,246,0.2)]",
  },
  card: {
    label: "บัตร",
    styles: "bg-violet-100 text-violet-700 border-violet-500 shadow-[1px_1px_0px_rgba(139,92,246,0.2)]",
  },
}

const getFirstLetter = (name: string) => {
  const cleanName = name.replace(/^คุณ\s*/, "")
  return cleanName.charAt(0) || "ค"
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="y2k-card p-5 lg:col-span-3">
      <h2 className="mb-4 text-base font-black text-on-surface uppercase tracking-tight">รายการล่าสุด</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl border border-transparent hover:border-outline-variant/50 transition-colors"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary font-black border-2 border-primary shadow-[2px_2px_0px_#818CF8]">
              {getFirstLetter(tx.customer)}
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
              <span
                className={cn(
                  "text-[9px] font-black rounded-full px-2 py-0.5 border inline-block mt-1",
                  METHOD_CONFIG[tx.method]?.styles || "bg-neutral-100 text-neutral-600 border-neutral-300"
                )}
              >
                {METHOD_CONFIG[tx.method]?.label || tx.method}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
