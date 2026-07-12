import { Phone, Calendar, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Customer } from "@/types"

const TAG_CONFIG: Record<Customer["tag"], { label: string; styles: string }> = {
  vip: {
    label: "VIP",
    styles: "bg-secondary-container text-on-secondary-container border-secondary shadow-[2px_2px_0px_#FB923C]",
  },
  regular: {
    label: "ประจำ",
    styles: "bg-tertiary-container text-on-tertiary-container border-tertiary shadow-[2px_2px_0px_#a78bfa]",
  },
  new: {
    label: "ใหม่",
    styles: "bg-emerald-100 text-emerald-700 border-emerald-500 shadow-[2px_2px_0px_#10B981]",
  },
}

interface CustomerRowProps {
  customer: Customer
}

export function CustomerRow({ customer }: CustomerRowProps) {
  return (
    <div className="glass-card rounded-[24px] p-4 flex items-center gap-4 relative overflow-hidden group">
      {/* Avatar */}
      <div className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white text-base font-black shadow-[2px_2px_0px_#1e1b4b] border-2 border-on-surface",
        customer.avatar
      )}>
        {customer.name.charAt(0)}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-grow">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">{customer.name}</span>
          <span className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wide border-2", TAG_CONFIG[customer.tag].styles)}>
            {TAG_CONFIG[customer.tag].label}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-400 font-bold">
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {customer.phone}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {customer.lastVisit}
          </span>
        </div>
        <p className="mt-1.5 truncate text-xs text-neutral-500 font-semibold">
          บริการล่าสุด: {customer.lastService}
        </p>
      </div>

      {/* Spend Info */}
      <div className="shrink-0 text-right pr-2">
        <p className="text-base sm:text-lg font-black text-primary">฿{customer.totalSpend.toLocaleString()}</p>
        <p className="text-xs text-neutral-400 font-bold">{customer.totalVisits} ครั้ง</p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300 group-hover:text-primary transition-colors" />
    </div>
  )
}
