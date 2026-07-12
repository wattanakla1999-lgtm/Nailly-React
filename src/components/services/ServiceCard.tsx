import { Clock, Tag, Star } from "lucide-react"
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
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="y2k-card p-5 flex flex-col gap-4 relative overflow-hidden group">
      {service.popular && (
        <div className="absolute -top-1.5 right-4 flex items-center gap-1 rounded-full bg-amber-400 border-2 border-on-surface px-2.5 py-0.5 text-[9px] font-black text-white shadow-[2px_2px_0px_#1e1b4b]">
          <Star className="h-3.5 w-3.5 fill-white text-white" />
          ยอดนิยม
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container border-2 border-primary text-2xl shadow-[2px_2px_0px_#818CF8]">
          {service.emoji || "💅"}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-neutral-900 dark:text-white truncate">{service.nameTh || service.name}</h3>
          <p className="text-xs text-neutral-400 font-semibold truncate">{service.name}</p>
        </div>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
        {service.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-dashed border-outline-variant/60 pt-3">
        <div className="flex items-center gap-3 text-xs text-neutral-400 font-bold">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration} น.
          </span>
          <span className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" />
            {CATEGORIES.find((c) => c.value === service.category)?.label || "บริการ"}
          </span>
        </div>
        <span className="text-lg font-black text-primary">฿{service.price.toLocaleString()}</span>
      </div>

      <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="flex-1 rounded-xl border-2 border-outline-variant bg-neutral-50 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100">
          แก้ไข
        </button>
        <button className="flex-1 rounded-xl bg-primary text-on-primary border-2 border-primary py-1.5 text-xs font-bold hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#1e1b4b]">
          เพิ่มคิว
        </button>
      </div>
    </div>
  )
}
