import { Clock, Tag } from "lucide-react"
import { CardCrudActions } from "@/components/CardCrudActions"
import type { Service } from "@/types"

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "manicure", label: "เมนิเกียร์" },
  { value: "pedicure", label: "เพดิเกียร์" },
  { value: "art", label: "เพนท์ลวดลาย" },
  { value: "extension", label: "ต่อเล็บ" },
]

interface ServiceCardProps {
  service: Service
  onEdit?: (service: Service) => void
  onDelete?: (service: Service) => void
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="y2k-card relative flex min-w-0 flex-col gap-2 overflow-hidden p-2.5">
      <div className="flex min-w-0 items-start gap-1.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-primary-container text-lg shadow-[2px_2px_0px_#818CF8]">
          {service.img ? (
            <img src={service.img} alt={service.name} className="h-full w-full object-cover" />
          ) : (
            service.emoji || "💅"
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="truncate text-xs font-bold text-neutral-900 dark:text-white">{service.nameTh || service.name}</h3>
          <p className="truncate text-[9px] font-semibold text-neutral-400">{service.name}</p>
        </div>
        <CardCrudActions
          itemName={service.nameTh || service.name}
          onEdit={() => onEdit?.(service)}
          onDelete={() => onDelete?.(service)}
        />
      </div>

      <p className="truncate text-[9px] font-semibold leading-relaxed text-neutral-500 dark:text-neutral-400">
        {service.description}
      </p>

      <div className="flex items-end justify-between gap-1 border-t border-dashed border-outline-variant/60 pt-2">
        <div className="min-w-0 space-y-0.5 text-[9px] font-bold text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {service.duration} น.
          </span>
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span className="truncate">{CATEGORIES.find((c) => c.value === service.category)?.label || "บริการ"}</span>
          </span>
        </div>
        <span className="shrink-0 text-sm font-black text-primary">฿{service.price.toLocaleString()}</span>
      </div>
    </div>
  )
}
