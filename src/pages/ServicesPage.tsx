import { useState } from "react"
import { Plus, Search, Scissors, Clock, Tag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
  id: string
  name: string
  nameTh: string
  category: string
  price: number
  duration: number // minutes
  popular: boolean
  description: string
  emoji: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SERVICES: Service[] = [
  { id: "1", name: "Manicure Classic", nameTh: "เมนิเกียร์คลาสสิก", category: "manicure", price: 250, duration: 45, popular: false, description: "ตกแต่งเล็บพร้อมทาสีทั่วไป", emoji: "💅" },
  { id: "2", name: "Gel Manicure", nameTh: "เจลเมนิเกียร์", category: "manicure", price: 550, duration: 75, popular: true, description: "ทาเจลติดทนนานถึง 3 สัปดาห์", emoji: "✨" },
  { id: "3", name: "French Manicure", nameTh: "เฟรนช์เมนิเกียร์", category: "manicure", price: 450, duration: 60, popular: false, description: "ปลายเล็บสีขาว สวยคลาสสิก", emoji: "🤍" },
  { id: "4", name: "Nail Art", nameTh: "เพนท์ลวดลาย", category: "art", price: 150, duration: 30, popular: true, description: "ราคาต่อนิ้ว ลวดลายตามต้องการ", emoji: "🎨" },
  { id: "5", name: "Nail Art Premium", nameTh: "เพนท์ลวดลายพรีเมียม", category: "art", price: 800, duration: 120, popular: true, description: "ลวดลาย 3D งานละเอียด ใช้เวลา 2 ชั่วโมง", emoji: "💎" },
  { id: "6", name: "Nail Extension", nameTh: "ต่อเล็บ", category: "extension", price: 900, duration: 120, popular: false, description: "ต่อเล็บอคริลิกหรือเจล ยาวตามต้องการ", emoji: "🌸" },
  { id: "7", name: "Pedicure Classic", nameTh: "เพดิเกียร์คลาสสิก", category: "pedicure", price: 350, duration: 60, popular: false, description: "ดูแลเล็บเท้าพร้อมทาสี", emoji: "🦶" },
  { id: "8", name: "Gel Pedicure", nameTh: "เจลเพดิเกียร์", category: "pedicure", price: 480, duration: 75, popular: true, description: "เจลเล็บเท้าติดทนนาน", emoji: "👣" },
  { id: "9", name: "Nail Removal", nameTh: "ถอดเจล / ถอดต่อเล็บ", category: "care", price: 150, duration: 30, popular: false, description: "ถอดเจลหรือเล็บต่อด้วยความระมัดระวัง", emoji: "🧹" },
  { id: "10", name: "Nail Spa", nameTh: "สปาเล็บ", category: "care", price: 350, duration: 60, popular: false, description: "ดูแลมือและเล็บด้วยครีมบำรุง", emoji: "🌿" },
]

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "manicure", label: "เมนิเกียร์" },
  { value: "pedicure", label: "เพดิเกียร์" },
  { value: "art", label: "เพนท์ลวดลาย" },
  { value: "extension", label: "ต่อเล็บ" },
  { value: "care", label: "ดูแลเล็บ" },
]

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900">
      {service.popular && (
        <div className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          <Star className="h-2.5 w-2.5 fill-white" />
          ยอดนิยม
        </div>
      )}

      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-2xl dark:bg-rose-950/30">
          {service.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-neutral-900 dark:text-white">{service.nameTh}</h3>
          <p className="text-xs text-neutral-400">{service.name}</p>
        </div>
      </div>

      <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {service.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {service.duration} น.
          </span>
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {CATEGORIES.find((c) => c.value === service.category)?.label}
          </span>
        </div>
        <span className="text-lg font-bold text-rose-500">฿{service.price.toLocaleString()}</span>
      </div>

      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 transition-colors">
          แก้ไข
        </button>
        <button className="flex-1 rounded-xl bg-rose-50 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 transition-colors">
          เพิ่มนัดหมาย
        </button>
      </div>
    </div>
  )
}

// ─── Services Page ────────────────────────────────────────────────────────────

export function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = MOCK_SERVICES.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory
    const matchSearch =
      s.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">บริการ</h1>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {MOCK_SERVICES.length} บริการ
          </p>
        </div>
        <Button className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:from-rose-600 hover:to-pink-600 text-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">เพิ่มบริการ</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="ค้นหาบริการ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === value
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "บริการทั้งหมด", value: MOCK_SERVICES.length, icon: Scissors, color: "text-rose-500" },
          { label: "ราคาเฉลี่ย", value: `฿${Math.round(MOCK_SERVICES.reduce((s, sv) => s + sv.price, 0) / MOCK_SERVICES.length)}`, icon: Tag, color: "text-violet-500" },
          { label: "ยอดนิยม", value: MOCK_SERVICES.filter((s) => s.popular).length, icon: Star, color: "text-amber-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <Icon className={cn("mx-auto mb-1.5 h-5 w-5", color)} />
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{value}</p>
            <p className="text-xs text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Service Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
          <Scissors className="mb-3 h-12 w-12 opacity-30" />
          <p className="text-sm">ไม่พบบริการที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((svc) => <ServiceCard key={svc.id} service={svc} />)}
        </div>
      )}
    </>
  )
}
