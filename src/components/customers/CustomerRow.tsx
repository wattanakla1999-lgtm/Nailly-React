import { Phone, Calendar } from "lucide-react"
import { CardCrudActions } from "@/components/CardCrudActions"
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
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerRow({ customer, onEdit, onDelete }: CustomerRowProps) {
  return (
    <div className="glass-card group relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-[20px] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-on-surface bg-gradient-to-br text-sm font-black text-white shadow-[2px_2px_0px_#1e1b4b]",
          customer.avatar
        )}>
          {customer.name.charAt(0)}
        </div>
        <CardCrudActions
          itemName={customer.name}
          onEdit={() => onEdit(customer)}
          onDelete={() => onDelete(customer)}
        />
      </div>

      <div className="min-w-0 flex-grow">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-bold text-neutral-900 dark:text-white">{customer.name}</span>
          <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold", TAG_CONFIG[customer.tag].styles)}>
            {TAG_CONFIG[customer.tag].label}
          </span>
        </div>
        <div className="mt-1.5 space-y-1 text-[10px] font-bold text-neutral-400">
          <span className="flex min-w-0 items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            <span className="truncate">{customer.phone}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {customer.lastVisit}
          </span>
        </div>
        <p className="mt-1.5 truncate text-[10px] font-semibold text-neutral-500">
          บริการล่าสุด: {customer.lastService}
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-dashed border-outline-variant pt-2">
        <p className="text-[10px] font-bold text-neutral-400">{customer.totalVisits} ครั้ง</p>
        <p className="text-base font-black text-primary">฿{customer.totalSpend.toLocaleString()}</p>
      </div>
    </div>
  )
}
