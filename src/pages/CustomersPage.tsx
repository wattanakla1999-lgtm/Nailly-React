import { useState } from "react"
import { Search, Plus, Phone, Calendar, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalVisits: number
  totalSpend: number
  lastVisit: string
  lastService: string
  tag: "vip" | "regular" | "new"
  avatar: string // gradient colors
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "สมใจ รักสวย", phone: "081-234-5678", email: "somjai@email.com", totalVisits: 24, totalSpend: 18500, lastVisit: "3 วันที่แล้ว", lastService: "Gel Manicure + Nail Art", tag: "vip", avatar: "from-rose-400 to-pink-500" },
  { id: "2", name: "นิดา มีสุข", phone: "089-345-6789", email: "nida@email.com", totalVisits: 12, totalSpend: 7200, lastVisit: "1 สัปดาห์ที่แล้ว", lastService: "Pedicure Classic", tag: "regular", avatar: "from-violet-400 to-purple-500" },
  { id: "3", name: "วรรณา สวยงาม", phone: "062-456-7890", email: "wanna@email.com", totalVisits: 8, totalSpend: 4800, lastVisit: "2 สัปดาห์ที่แล้ว", lastService: "French Manicure", tag: "regular", avatar: "from-teal-400 to-cyan-500" },
  { id: "4", name: "พิมพ์ใจ รุ่งเรือง", phone: "095-567-8901", email: "pimjai@email.com", totalVisits: 31, totalSpend: 28900, lastVisit: "วันนี้", lastService: "Nail Extension", tag: "vip", avatar: "from-amber-400 to-orange-500" },
  { id: "5", name: "กนกวรรณ ดาวแดง", phone: "083-678-9012", email: "kanok@email.com", totalVisits: 3, totalSpend: 1400, lastVisit: "1 เดือนที่แล้ว", lastService: "Gel Pedicure", tag: "new", avatar: "from-emerald-400 to-green-500" },
]

const TAG_CONFIG: Record<Customer["tag"], { label: string; styles: string }> = {
  vip:     { label: "VIP", styles: "bg-secondary-container text-on-secondary-container border-secondary shadow-[2px_2px_0px_#FB923C]" },
  regular: { label: "ประจำ", styles: "bg-tertiary-container text-on-tertiary-container border-tertiary shadow-[2px_2px_0px_#a78bfa]" },
  new:     { label: "ใหม่", styles: "bg-emerald-100 text-emerald-700 border-emerald-500 shadow-[2px_2px_0px_#10B981]" },
}

const FILTER_TAGS: { label: string; value: Customer["tag"] | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "VIP", value: "vip" },
  { label: "ประจำ", value: "regular" },
  { label: "ใหม่", value: "new" },
]

function CustomerRow({ customer }: { customer: Customer }) {
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

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<Customer["tag"] | "all">("all")

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchTag = activeTag === "all" || c.tag === activeTag
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    return matchTag && matchSearch
  })

  const totalRevenue = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpend, 0)
  const avgSpend = Math.round(totalRevenue / MOCK_CUSTOMERS.length)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface flex items-baseline gap-3 tracking-tight">
            ลูกค้า
            <span className="text-xl text-outline font-normal">({MOCK_CUSTOMERS.length})</span>
          </h1>
        </div>
        <Button className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] text-sm font-bold">
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มลูกค้า
        </Button>
      </div>

      {/* 3 Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "ลูกค้าทั้งหมด", value: MOCK_CUSTOMERS.length, color: "bg-primary-container border-primary text-primary" },
          { label: "รายได้รวม", value: `฿${(totalRevenue / 1000).toFixed(1)}K`, color: "bg-secondary-container border-secondary text-secondary" },
          { label: "เฉลี่ยต่อคน", value: `฿${avgSpend.toLocaleString()}`, color: "bg-tertiary-container border-tertiary text-tertiary" },
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
          placeholder="ค้นหาชื่อหรือเบอร์โทร..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-medium transition-all outline-none placeholder:text-outline-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
        />
      </div>

      {/* Tag pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {FILTER_TAGS.map(({ label, value }) => {
          const isActive = activeTag === value
          return (
            <button
              key={value}
              onClick={() => setActiveTag(value)}
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

      {/* List */}
      {filtered.length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <Users className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">ไม่พบรายชื่อลูกค้าที่ค้นหา</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  )
}
