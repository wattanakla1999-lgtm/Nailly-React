import { useState } from "react"
import { Calendar, Clock, Plus, Search, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

type AppStatus = "confirmed" | "pending" | "done" | "cancelled"

interface Appointment {
  id: string
  customerName: string
  service: string
  staff: string
  date: string
  time: string
  duration: number // minutes
  price: number
  status: AppStatus
  phone: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "1", customerName: "สมใจ รักสวย", service: "Gel Manicure + Nail Art", staff: "น้องนุ่น", date: "วันนี้", time: "10:00", duration: 90, price: 650, status: "confirmed", phone: "081-234-5678" },
  { id: "2", customerName: "นิดา มีสุข", service: "Pedicure Classic", staff: "น้องแนน", date: "วันนี้", time: "11:30", duration: 60, price: 350, status: "pending", phone: "089-345-6789" },
  { id: "3", customerName: "วรรณา สวยงาม", service: "French Manicure", staff: "น้องนุ่น", date: "วันนี้", time: "13:00", duration: 75, price: 450, status: "confirmed", phone: "062-456-7890" },
  { id: "4", customerName: "พิมพ์ใจ รุ่งเรือง", service: "Nail Extension", staff: "น้องแนน", date: "วันนี้", time: "14:30", duration: 120, price: 900, status: "done", phone: "095-567-8901" },
  { id: "5", customerName: "กนกวรรณ ดาวแดง", service: "Gel Pedicure", staff: "น้องนุ่น", date: "วันนี้", time: "15:30", duration: 75, price: 480, status: "pending", phone: "083-678-9012" },
  { id: "6", customerName: "มาลี สดใส", service: "Nail Art Premium", staff: "น้องแนน", date: "พรุ่งนี้", time: "10:00", duration: 120, price: 800, status: "confirmed", phone: "091-789-0123" },
  { id: "7", customerName: "ปิยะมาศ ดีงาม", service: "Manicure Classic", staff: "น้องนุ่น", date: "พรุ่งนี้", time: "11:30", duration: 45, price: 250, status: "pending", phone: "086-890-1234" },
  { id: "8", customerName: "สุภาพร ใจดี", service: "Gel Manicure", staff: "น้องแนน", date: "พรุ่งนี้", time: "14:00", duration: 75, price: 550, status: "cancelled", phone: "094-901-2345" },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_TABS: { label: string; value: AppStatus | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "ยืนยันแล้ว", value: "confirmed" },
  { label: "รอยืนยัน", value: "pending" },
  { label: "เสร็จสิ้น", value: "done" },
  { label: "ยกเลิก", value: "cancelled" },
]

const STATUS_CONFIG: Record<AppStatus, { label: string; styles: string }> = {
  confirmed: { label: "ยืนยันแล้ว", styles: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  pending:   { label: "รอยืนยัน",  styles: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  done:      { label: "เสร็จสิ้น", styles: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400" },
  cancelled: { label: "ยกเลิก",    styles: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" },
}

// ─── Add Appointment Modal (Simple) ──────────────────────────────────────────

interface AddModalProps {
  onClose: () => void
}

function AddAppointmentModal({ onClose }: AddModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">เพิ่มนัดหมายใหม่</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          {[
            { id: "apt-customer", label: "ชื่อลูกค้า", placeholder: "ค้นหาหรือเพิ่มลูกค้า" },
            { id: "apt-service", label: "บริการ", placeholder: "เลือกบริการ" },
            { id: "apt-staff", label: "พนักงาน", placeholder: "เลือกพนักงาน" },
          ].map(({ id, label, placeholder }) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={id} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
              <input
                id={id}
                type="text"
                placeholder={placeholder}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="apt-date" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">วันที่</label>
              <input id="apt-date" type="date" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="apt-time" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">เวลา</label>
              <input id="apt-time" type="time" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600">
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Appointments Page ────────────────────────────────────────────────────────

export function AppointmentsPage() {
  const [activeFilter, setActiveFilter] = useState<AppStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)

  const filtered = MOCK_APPOINTMENTS.filter((apt) => {
    const matchStatus = activeFilter === "all" || apt.status === activeFilter
    const matchSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const groupedByDate = filtered.reduce<Record<string, Appointment[]>>((acc, apt) => {
    acc[apt.date] = [...(acc[apt.date] ?? []), apt]
    return acc
  }, {})

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">นัดหมาย</h1>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {filtered.length} รายการ
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:from-rose-600 hover:to-pink-600 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">เพิ่มนัดหมาย</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Button>
      </div>

      {/* Search + Filter Bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้าหรือบริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
          <Filter className="h-4 w-4" />
          กรองเพิ่มเติม
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === value
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
          <Calendar className="mb-3 h-12 w-12 opacity-30" />
          <p className="text-sm">ไม่พบนัดหมายที่ค้นหา</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, apts]) => (
            <div key={date}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                <Calendar className="h-4 w-4" />
                {date}
                <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
                  {apts.length} นัด
                </span>
              </h2>

              <div className="space-y-3">
                {apts.map((apt) => (
                  <div
                    key={apt.id}
                    className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex items-start gap-3">
                      {/* Time block */}
                      <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-rose-50 py-2 text-center dark:bg-rose-950/30">
                        <Clock className="mb-1 h-3 w-3 text-rose-400" />
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{apt.time}</span>
                        <span className="text-[10px] text-rose-400">{apt.duration}น.</span>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">{apt.customerName}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_CONFIG[apt.status].styles)}>
                            {STATUS_CONFIG[apt.status].label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{apt.service}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-400">
                          <span>👤 {apt.staff}</span>
                          <span>📞 {apt.phone}</span>
                          <span className="font-semibold text-rose-500">฿{apt.price.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-col gap-1.5">
                        {apt.status === "pending" && (
                          <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 transition-colors">
                            ยืนยัน
                          </button>
                        )}
                        <button className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 transition-colors">
                          แก้ไข
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && <AddAppointmentModal onClose={() => setShowModal(false)} />}
    </>
  )
}
