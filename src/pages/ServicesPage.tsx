import { useState, useEffect } from "react"
import { Plus, Search, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ServiceCard } from "@/components/services/ServiceCard"
import { LoadingPopup } from "@/components/LoadingPopup"
import type { Service } from "@/types"

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
]

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "manicure", label: "เมนิเกียร์" },
  { value: "pedicure", label: "เพดิเกียร์" },
  { value: "art", label: "เพนท์ลวดลาย" },
  { value: "extension", label: "ต่อเล็บ" },
]

export function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [activeCategory, searchQuery])

  const filtered = MOCK_SERVICES.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory
    const nameThSearch = s.nameTh || ""
    const matchSearch =
      nameThSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-8">
      <LoadingPopup isOpen={loading} message="กำลังค้นหาข้อมูลบริการ..." />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface flex items-baseline gap-3 tracking-tight">
            บริการ
            <span className="text-xl text-outline font-normal">({MOCK_SERVICES.length})</span>
          </h1>
        </div>
        <Button className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] text-sm font-bold">
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มบริการ
        </Button>
      </div>

      {/* 3 Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "บริการทั้งหมด", value: MOCK_SERVICES.length, color: "bg-primary-container border-primary text-primary" },
          { label: "ราคาเฉลี่ย", value: `฿${Math.round(MOCK_SERVICES.reduce((s, sv) => s + sv.price, 0) / MOCK_SERVICES.length)}`, color: "bg-secondary-container border-secondary text-secondary" },
          { label: "บริการยอดนิยม", value: MOCK_SERVICES.filter((s) => s.popular).length, color: "bg-tertiary-container border-tertiary text-tertiary" },
        ].map(({ label, value }) => (
          <div key={label} className="y2k-card p-4 text-center flex flex-col items-center justify-center gap-1">
            <p className="text-2xl font-black text-on-surface">{value}</p>
            <p className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
        <input
          type="text"
          placeholder="ค้นหาบริการ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-medium transition-all outline-none placeholder:text-outline-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = activeCategory === value
          return (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={cn(
                "px-5 py-2.5 rounded-full font-bold text-xs whitespace-nowrap transition-all border-2",
                isActive
                  ? "bg-primary text-on-primary border-primary shadow-[2px_2px_0px_0px_#1e1b4b]"
                  : "bg-surface border-outline-variant text-on-surface hover:bg-surface-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Service Cards Grid */}
      {filtered.length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <Scissors className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">ไม่พบบริการที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      )}
    </div>
  )
}
