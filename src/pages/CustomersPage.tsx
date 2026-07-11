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
  avatar: string // initials color
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "สมใจ รักสวย", phone: "081-234-5678", email: "somjai@email.com", totalVisits: 24, totalSpend: 18500, lastVisit: "3 วันที่แล้ว", lastService: "Gel Manicure + Nail Art", tag: "vip", avatar: "from-rose-400 to-pink-500" },
  { id: "2", name: "นิดา มีสุข", phone: "089-345-6789", email: "nida@email.com", totalVisits: 12, totalSpend: 7200, lastVisit: "1 สัปดาห์ที่แล้ว", lastService: "Pedicure Classic", tag: "regular", avatar: "from-violet-400 to-purple-500" },
  { id: "3", name: "วรรณา สวยงาม", phone: "062-456-7890", email: "wanna@email.com", totalVisits: 8, totalSpend: 4800, lastVisit: "2 สัปดาห์ที่แล้ว", lastService: "French Manicure", tag: "regular", avatar: "from-teal-400 to-cyan-500" },
  { id: "4", name: "พิมพ์ใจ รุ่งเรือง", phone: "095-567-8901", email: "pimjai@email.com", totalVisits: 31, totalSpend: 28900, lastVisit: "วันนี้", lastService: "Nail Extension", tag: "vip", avatar: "from-amber-400 to-orange-500" },
  { id: "5", name: "กนกวรรณ ดาวแดง", phone: "083-678-9012", email: "kanok@email.com", totalVisits: 3, totalSpend: 1400, lastVisit: "1 เดือนที่แล้ว", lastService: "Gel Pedicure", tag: "new", avatar: "from-emerald-400 to-green-500" },
  { id: "6", name: "มาลี สดใส", phone: "091-789-0123", email: "malee@email.com", totalVisits: 18, totalSpend: 13200, lastVisit: "5 วันที่แล้ว", lastService: "Nail Art Premium", tag: "vip", avatar: "from-blue-400 to-indigo-500" },
  { id: "7", name: "ปิยะมาศ ดีงาม", phone: "086-890-1234", email: "piyamas@email.com", totalVisits: 6, totalSpend: 3100, lastVisit: "3 สัปดาห์ที่แล้ว", lastService: "Manicure Classic", tag: "regular", avatar: "from-pink-400 to-rose-500" },
  { id: "8", name: "สุภาพร ใจดี", phone: "094-901-2345", email: "supaporn@email.com", totalVisits: 2, totalSpend: 800, lastVisit: "2 เดือนที่แล้ว", lastService: "Gel Manicure", tag: "new", avatar: "from-fuchsia-400 to-pink-500" },
]

const TAG_CONFIG: Record<Customer["tag"], { label: string; styles: string }> = {
  vip:     { label: "VIP", styles: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  regular: { label: "ประจำ", styles: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" },
  new:     { label: "ใหม่", styles: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
}

const FILTER_TAGS: { label: string; value: Customer["tag"] | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "VIP", value: "vip" },
  { label: "ประจำ", value: "regular" },
  { label: "ใหม่", value: "new" },
]

// ─── Customer Card ────────────────────────────────────────────────────────────

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer dark:border-neutral-800 dark:bg-neutral-900">
      {/* Avatar */}
      <div className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white text-base font-bold shadow-sm",
        customer.avatar
      )}>
        {customer.name.charAt(0)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-neutral-900 dark:text-white">{customer.name}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", TAG_CONFIG[customer.tag].styles)}>
            {TAG_CONFIG[customer.tag].label}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {customer.phone}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {customer.lastVisit}
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
          บริการล่าสุด: {customer.lastService}
        </p>
      </div>

      {/* Stats */}
      <div className="shrink-0 text-right hidden sm:block">
        <p className="text-sm font-bold text-rose-500">฿{customer.totalSpend.toLocaleString()}</p>
        <p className="text-xs text-neutral-400">{customer.totalVisits} ครั้ง</p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600" />
    </div>
  )
}

// ─── Customers Page ───────────────────────────────────────────────────────────

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
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">ลูกค้า</h1>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {MOCK_CUSTOMERS.length} คน
          </p>
        </div>
        <Button className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:from-rose-600 hover:to-pink-600 text-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">เพิ่มลูกค้า</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Button>
      </div>

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "ลูกค้าทั้งหมด", value: MOCK_CUSTOMERS.length, color: "text-violet-500" },
          { label: "รายได้รวม", value: `฿${(totalRevenue / 1000).toFixed(1)}K`, color: "text-rose-500" },
          { label: "ค่าเฉลี่ย/คน", value: `฿${avgSpend.toLocaleString()}`, color: "text-amber-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className={cn("text-lg font-bold", color)}>{value}</p>
            <p className="text-xs text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="ค้นหาชื่อหรือเบอร์โทร..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Tag Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TAGS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveTag(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeTag === value
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
          <Users className="mb-3 h-12 w-12 opacity-30" />
          <p className="text-sm">ไม่พบลูกค้าที่ค้นหา</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </>
  )
}
