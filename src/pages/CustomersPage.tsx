import { useState, useEffect } from "react"
import { Search, Plus, Users, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CustomerRow } from "@/components/customers/CustomerRow"
import { LoadingPopup } from "@/components/LoadingPopup"
import api from "@/lib/api"
import type { Customer } from "@/types"

// ─── Mock Data (Fallback) ────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "สมใจ รักสวย", phone: "081-234-5678", email: "somjai@email.com", totalVisits: 24, totalSpend: 18500, lastVisit: "3 วันที่แล้ว", lastService: "Gel Manicure + Nail Art", tag: "vip", avatar: "from-rose-400 to-pink-500" },
  { id: "2", name: "นิดา มีสุข", phone: "089-345-6789", email: "nida@email.com", totalVisits: 12, totalSpend: 7200, lastVisit: "1 สัปดาห์ที่แล้ว", lastService: "Pedicure Classic", tag: "regular", avatar: "from-violet-400 to-purple-500" },
  { id: "3", name: "วรรณา สวยงาม", phone: "062-456-7890", email: "wanna@email.com", totalVisits: 8, totalSpend: 4800, lastVisit: "2 สัปดาห์ที่แล้ว", lastService: "French Manicure", tag: "regular", avatar: "from-teal-400 to-cyan-500" },
  { id: "4", name: "พิมพ์ใจ รุ่งเรือง", phone: "095-567-8901", email: "pimjai@email.com", totalVisits: 31, totalSpend: 28900, lastVisit: "วันนี้", lastService: "Nail Extension", tag: "vip", avatar: "from-amber-400 to-orange-500" },
  { id: "5", name: "กนกวรรณ ดาวแดง", phone: "083-678-9012", email: "kanok@email.com", totalVisits: 3, totalSpend: 1400, lastVisit: "1 เดือนที่แล้ว", lastService: "Gel Pedicure", tag: "new", avatar: "from-emerald-400 to-green-500" },
]

const FILTER_TAGS: { label: string; value: Customer["tag"] | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "VIP", value: "vip" },
  { label: "ประจำ", value: "regular" },
  { label: "ใหม่", value: "new" },
]

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<Customer["tag"] | "all">("all")
  
  // API States
  const [customers, setCustomers] = useState<Customer[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  // Fetch from Backend /users
  useEffect(() => {
    let isMounted = true
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        // Construct query parameters
        const isEmail = searchQuery.includes("@")
        const params: Record<string, any> = {
          page,
          limit,
        }

        if (searchQuery) {
          if (isEmail) {
            params.email = searchQuery
          } else {
            params.name = searchQuery
          }
        }

        const response = await api.get("/users", { params })
        
        if (isMounted) {
          const resData = response.data
          setIsOffline(false)
          
          let parsedData: any[] = []
          let parsedTotal = 0

          if (Array.isArray(resData)) {
            parsedData = resData
            parsedTotal = resData.length
          } else if (resData && Array.isArray(resData.data)) {
            parsedData = resData.data
            parsedTotal = resData.total || resData.data.length
          }

          // Map data to match Customer model (snake_case and case conversions)
          const mapped: Customer[] = parsedData.map((user: any) => ({
            id: String(user.id || user.ID || Math.random()),
            name: user.name || user.Name || "ไม่ระบุชื่อ",
            phone: user.phone || user.Phone || "ไม่มีเบอร์โทร",
            email: user.email || user.Email || "-",
            totalVisits: user.totalVisits ?? user.total_visits ?? user.TotalVisits ?? 0,
            totalSpend: user.totalSpend ?? user.total_spend ?? user.TotalSpend ?? 0,
            lastVisit: user.lastVisit || user.last_visit || user.LastVisit || "ไม่มีประวัติ",
            lastService: user.lastService || user.last_service || user.LastService || "ไม่มีข้อมูล",
            tag: (user.tag || user.Tag || "new").toLowerCase() as Customer["tag"],
            avatar: user.avatar || user.Avatar || "from-rose-400 to-pink-500",
          }))

          // Apply client-side tag filter if activeTag is not 'all'
          const filteredByTag = activeTag === "all" 
            ? mapped 
            : mapped.filter((c) => c.tag === activeTag)

          setCustomers(filteredByTag)
          setTotal(parsedTotal)
        }
      } catch (error) {
        console.warn("Backend API offline, falling back to mock data.", error)
        if (isMounted) {
          setIsOffline(true)
          // Client-side search and tag filtering of mock data
          const filteredMock = MOCK_CUSTOMERS.filter((c) => {
            const matchTag = activeTag === "all" || c.tag === activeTag
            const matchSearch =
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.phone.includes(searchQuery) ||
              c.email.toLowerCase().includes(searchQuery.toLowerCase())
            return matchTag && matchSearch
          })

          // Paginate mock data
          const offset = (page - 1) * limit
          const paginatedMock = filteredMock.slice(offset, offset + limit)

          setCustomers(paginatedMock)
          setTotal(filteredMock.length)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(() => {
      fetchCustomers()
    }, 300)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery, activeTag, page, limit])

  // Reset page when search or tag changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeTag])

  const totalRevenue = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpend, 0)
  const avgSpend = Math.round(totalRevenue / MOCK_CUSTOMERS.length)
  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="space-y-8">
      <LoadingPopup isOpen={loading} message="กำลังดึงข้อมูลลูกค้าจากเซิร์ฟเวอร์..." />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface flex items-baseline gap-3 tracking-tight">
            ลูกค้า
            <span className="text-xl text-outline font-normal">({total})</span>
          </h1>
          {isOffline && (
            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ แสดงข้อมูลจำลอง (Offline Mode)
            </p>
          )}
        </div>
        <Button className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] text-sm font-bold">
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มลูกค้า
        </Button>
      </div>

      {/* 3 Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "ลูกค้าทั้งหมด", value: total, color: "bg-primary-container border-primary text-primary" },
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
          placeholder="ค้นหาชื่อ, เบอร์โทร หรืออีเมล..."
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
      {customers.length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <Users className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">ไม่พบรายชื่อลูกค้าที่ค้นหา</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}

          {/* Senior Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-outline-variant">
            <span className="text-xs font-bold text-neutral-400">
              หน้า {page} จาก {totalPages} (ทั้งหมด {total} คน)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "p-2 rounded-xl border-2 transition-all",
                  page <= 1
                    ? "bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "bg-white border-on-surface text-on-surface hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#1e1b4b]"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  "p-2 rounded-xl border-2 transition-all",
                  page >= totalPages
                    ? "bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "bg-white border-on-surface text-on-surface hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#1e1b4b]"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
