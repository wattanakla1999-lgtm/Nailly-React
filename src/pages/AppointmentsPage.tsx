import React, { useState, useEffect } from "react"
import { Calendar, Plus, Search, Edit, Check, MoreVertical, Sparkles, User, Phone, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Y2KModal } from "@/components/Y2KModal"

// ─── Types ───────────────────────────────────────────────────────────────────

type AppStatus = "confirmed" | "pending" | "done" | "cancelled"

interface Appointment {
  id: string
  customerName: string
  name?: string // Backwards compatibility for booking flow
  phone: string
  service: string
  staff: string
  staffImg?: string
  date: string
  time: string
  duration: number
  price: number
  status: AppStatus
  iconType?: "dry_cleaning" | "brush" | "spa"
  cancelReason?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "คุณ อลิสา",
    service: "Classic Gel Manicure",
    staff: "พี่แนน",
    staffImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100",
    date: "วันนี้",
    time: "10:00",
    duration: 60,
    price: 550,
    status: "confirmed",
    phone: "081-234-5678",
    iconType: "dry_cleaning",
  },
  {
    id: "2",
    customerName: "คุณ เมย์",
    service: "Spa Pedicure & Nail Art",
    staff: "น้องมายด์",
    staffImg: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=100",
    date: "วันนี้",
    time: "13:30",
    duration: 90,
    price: 800,
    status: "pending",
    phone: "089-345-6789",
    iconType: "brush",
  },
  {
    id: "3",
    customerName: "คุณ เจน",
    service: "Hand Spa & Mask",
    staff: "พี่แนน",
    staffImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100",
    date: "พรุ่งนี้",
    time: "11:00",
    duration: 60,
    price: 350,
    status: "confirmed",
    phone: "062-456-7890",
    iconType: "spa",
  },
]

const FILTER_TABS: { label: string; value: AppStatus | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "ยืนยันแล้ว", value: "confirmed" },
  { label: "รอยืนยัน", value: "pending" },
  { label: "เสร็จสิ้น", value: "done" },
  { label: "ยกเลิก", value: "cancelled" },
]

const STATUS_CONFIG: Record<AppStatus, { label: string; styles: string }> = {
  confirmed: { label: "ยืนยันแล้ว", styles: "bg-tertiary-container text-tertiary border-tertiary" },
  pending:   { label: "รอยืนยัน",  styles: "bg-secondary-container text-on-secondary-container border-secondary" },
  done:      { label: "เสร็จสิ้น", styles: "bg-neutral-100 text-neutral-500 border-neutral-300" },
  cancelled: { label: "ยกเลิก",    styles: "bg-red-100 text-red-600 border-red-300" },
}

// ─── Add Appointment Modal ───────────────────────────────────────────────────

interface AddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (apt: Appointment) => void
}

function AddAppointmentModal({ isOpen, onClose, onSave }: AddModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("เจลเมนิเกียร์")
  const [staff, setStaff] = useState("พี่แนน")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState("10:00")
  const [price, setPrice] = useState(550)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !phone) {
      alert("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]

    let displayDate = date
    if (date === todayStr) displayDate = "วันนี้"
    else if (date === tomorrowStr) displayDate = "พรุ่งนี้"

    onSave({
      id: String(Date.now()),
      customerName,
      name: customerName,
      phone,
      service,
      staff,
      staffImg: staff === "พี่แนน" ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100" : "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=100",
      date: displayDate,
      time,
      duration: 60,
      price,
      status: "pending",
    })
  }

  return (
    <Y2KModal isOpen={isOpen} onClose={onClose} title="เพิ่มการนัดหมายใหม่">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อลูกค้า *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ระบุชื่อลูกค้า"
              className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เบอร์โทรศัพท์ *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="เช่น 0812345678"
              className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">บริการ</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
          >
            <option value="เมนิเกียร์คลาสสิก">เมนิเกียร์คลาสสิก (฿250)</option>
            <option value="เจลเมนิเกียร์">เจลเมนิเกียร์ (฿550)</option>
            <option value="เฟรนช์เมนิเกียร์">เฟรนช์เมนิเกียร์ (฿450)</option>
            <option value="เพนท์ลวดลาย">เพนท์ลวดลาย (฿150)</option>
            <option value="ต่อเล็บ PVC/เจล">ต่อเล็บ PVC/เจล (฿900)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">วันที่สะดวก</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เวลา</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ช่างผู้ให้บริการ</label>
            <select
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            >
              <option value="พี่แนน">พี่แนน</option>
              <option value="น้องมายด์">น้องมายด์</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ราคาพิเศษ (บาท)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border-2 border-on-surface bg-white text-neutral-700 font-bold hover:bg-neutral-50 active:scale-95 transition-all text-xs"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex-1 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            บันทึกการนัดหมาย
          </button>
        </div>
      </form>
    </Y2KModal>
  )
}

// ─── Edit Appointment Modal ──────────────────────────────────────────────────

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (apt: Appointment) => void
  appointment: Appointment | null
}

function EditAppointmentModal({ isOpen, onClose, onSave, appointment }: EditModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")
  const [staff, setStaff] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [price, setPrice] = useState(0)

  useEffect(() => {
    if (appointment) {
      setCustomerName(appointment.customerName || appointment.name || "")
      setPhone(appointment.phone)
      setService(appointment.service)
      setStaff(appointment.staff)
      
      let formattedDate = appointment.date
      const todayStr = new Date().toISOString().split("T")[0]
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split("T")[0]

      if (appointment.date === "วันนี้") formattedDate = todayStr
      else if (appointment.date === "พรุ่งนี้") formattedDate = tomorrowStr

      setDate(formattedDate)
      setTime(appointment.time)
      setPrice(appointment.price)
    }
  }, [appointment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointment) return

    const todayStr = new Date().toISOString().split("T")[0]
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]

    let displayDate = date
    if (date === todayStr) displayDate = "วันนี้"
    else if (date === tomorrowStr) displayDate = "พรุ่งนี้"

    onSave({
      ...appointment,
      customerName,
      name: customerName,
      phone,
      service,
      staff,
      date: displayDate,
      time,
      price,
    })
  }

  return (
    <Y2KModal isOpen={isOpen} onClose={onClose} title="แก้ไขการนัดหมาย">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อลูกค้า *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เบอร์โทรศัพท์ *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">บริการ</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
          >
            <option value="เมนิเกียร์คลาสสิก">เมนิเกียร์คลาสสิก (฿250)</option>
            <option value="เจลเมนิเกียร์">เจลเมนิเกียร์ (฿550)</option>
            <option value="เฟรนช์เมนิเกียร์">เฟรนช์เมนิเกียร์ (฿450)</option>
            <option value="เพนท์ลวดลาย">เพนท์ลวดลาย (฿150)</option>
            <option value="ต่อเล็บ PVC/เจล">ต่อเล็บ PVC/เจล (฿900)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">วันที่นัด</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เวลา</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ช่างผู้ให้บริการ</label>
            <select
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              className="w-full h-10 px-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            >
              <option value="พี่แนน">พี่แนน</option>
              <option value="น้องมายด์">น้องมายด์</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ราคาพิเศษ (บาท)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border-2 border-on-surface bg-white text-neutral-700 font-bold hover:bg-neutral-50 active:scale-95 transition-all text-xs"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex-1 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>
    </Y2KModal>
  )
}

// ─── Appointments Page ────────────────────────────────────────────────────────

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activeFilter, setActiveFilter] = useState<AppStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Modal display states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Working appointment slots
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Load from localStorage or merge with mock on mount
  useEffect(() => {
    const stored = localStorage.getItem("nailly_custom_appointments")
    if (stored) {
      try {
        setAppointments(JSON.parse(stored))
      } catch (e) {
        console.error(e)
      }
    } else {
      localStorage.setItem("nailly_custom_appointments", JSON.stringify(MOCK_APPOINTMENTS))
      setAppointments(MOCK_APPOINTMENTS)
    }
  }, [])

  const saveAppointmentsList = (updated: Appointment[]) => {
    setAppointments(updated)
    localStorage.setItem("nailly_custom_appointments", JSON.stringify(updated))
  }

  // Action: Add appointment
  const handleAddAppointment = (newApt: Appointment) => {
    const updated = [newApt, ...appointments]
    saveAppointmentsList(updated)
    setShowAddModal(false)
    setSuccessMessage("บันทึกการนัดหมายใหม่เรียบร้อยแล้ว!")
    setShowSuccessModal(true)
  }

  // Action: Edit appointment
  const handleEditAppointment = (editedApt: Appointment) => {
    const updated = appointments.map((apt) => (apt.id === editedApt.id ? editedApt : apt))
    saveAppointmentsList(updated)
    setShowEditModal(false)
    setSuccessMessage("แก้ไขรายละเอียดการนัดหมายเรียบร้อยแล้ว!")
    setShowSuccessModal(true)
  }

  // Action: Update status directly (e.g. confirm/done)
  const handleStatusUpdate = (id: string, nextStatus: AppStatus) => {
    const updated = appointments.map((apt) => 
      apt.id === id ? { ...apt, status: nextStatus } : apt
    )
    saveAppointmentsList(updated)
    
    let msg = "อัปเดตสถานะนัดหมายเรียบร้อยแล้ว!"
    if (nextStatus === "confirmed") msg = "ยืนยันการนัดหมายเรียบร้อยแล้ว! 🟢"
    if (nextStatus === "done") msg = "เสร็จสิ้นบริการทำเล็บเรียบร้อยแล้ว! 🎉"

    setSuccessMessage(msg)
    setShowSuccessModal(true)
  }

  // Action: Cancel appointment with reason
  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApt) return

    const updated = appointments.map((apt) => 
      apt.id === selectedApt.id 
        ? { ...apt, status: "cancelled" as AppStatus, cancelReason } 
        : apt
    )
    saveAppointmentsList(updated)
    setShowCancelModal(false)
    setCancelReason("")
    setSuccessMessage("ยกเลิกการนัดหมาย และบันทึกสาเหตุเรียบร้อยแล้ว! 🔴")
    setShowSuccessModal(true)
  }

  // Filter logic
  const filtered = appointments.filter((apt) => {
    const matchStatus = activeFilter === "all" || apt.status === activeFilter
    
    const clientName = apt.customerName || apt.name || ""
    const matchSearch =
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  // Group by date
  const grouped = filtered.reduce<Record<string, Appointment[]>>((acc, apt) => {
    acc[apt.date] = [...(acc[apt.date] ?? []), apt]
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface flex items-baseline gap-3 tracking-tight">
            การนัดหมาย
            <span className="text-xl text-outline font-normal">({filtered.length})</span>
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all flex items-center gap-2 justify-center w-full sm:w-auto text-sm"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มนัดหมาย
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, บริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold transition-all outline-none placeholder:text-outline-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {FILTER_TABS.map(({ label, value }) => {
          const isActive = activeFilter === value
          return (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={cn(
                "px-5 py-2.5 rounded-full font-bold text-xs whitespace-nowrap transition-all border-2",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b]"
                  : "bg-white border-outline-variant text-on-surface hover:bg-surface-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Grid rendering by date */}
      {Object.keys(grouped).length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <Calendar className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">ไม่พบนัดหมายในขณะนี้</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, apts]) => (
            <section key={date} className="space-y-4">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-3 tracking-tight">
                {date}
                <span className="h-0.5 flex-grow bg-outline-variant" />
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {apts.map((apt) => (
                  <div
                    key={apt.id}
                    className="glass-card rounded-[24px] p-4 flex flex-col sm:flex-row items-stretch gap-4 relative overflow-hidden"
                  >
                    {/* Left Time Block */}
                    <div
                      className={cn(
                        "w-full sm:w-28 rounded-[20px] flex flex-row sm:flex-col items-center justify-center p-4 sm:p-0 gap-2 border-2",
                        apt.status === "confirmed"
                          ? "bg-primary-container border-primary/20 text-primary"
                          : "bg-surface-variant border-outline-variant text-on-surface"
                      )}
                    >
                      <span className="text-xl font-bold leading-none">{apt.time}</span>
                      <span className="text-xs font-semibold opacity-75">{apt.duration} นาที</span>
                    </div>

                    {/* Middle Details */}
                    <div className="flex-grow flex flex-col justify-center text-xs space-y-1.5 font-bold text-neutral-600">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-black text-on-surface">{apt.customerName || apt.name}</h4>
                        <span className={cn("px-3 py-0.5 rounded-full font-bold text-[10px] tracking-wide border-2", STATUS_CONFIG[apt.status].styles)}>
                          {STATUS_CONFIG[apt.status].label}
                        </span>
                      </div>
                      
                      <p className="text-on-surface-variant font-black text-sm flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        {apt.service}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {apt.phone && <p>📞 โทร: <span className="text-neutral-800 font-bold">{apt.phone}</span></p>}
                        <p>👤 ช่าง: <span className="text-neutral-800 font-bold">{apt.staff}</span></p>
                        <p>💰 ราคา: <span className="text-primary font-black">฿{apt.price}</span></p>
                      </div>

                      {apt.status === "cancelled" && apt.cancelReason && (
                        <div className="mt-2 p-2 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg text-[10px] w-fit">
                          ❌ สาเหตุที่ยกเลิก: {apt.cancelReason}
                        </div>
                      )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex sm:flex-col items-center justify-center gap-2 pr-2 pl-2 sm:pl-0 pb-2 sm:pb-0 shrink-0">
                      {apt.status === "pending" && (
                        <button
                          onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                          className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white border-2 border-on-surface hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all flex items-center justify-center shadow-[2px_2px_0px_0px_#1e1b4b]"
                          title="ยืนยันคิวจอง"
                        >
                          <Check className="h-5 w-5 stroke-[2.5px]" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedApt(apt)
                          setShowEditModal(true)
                        }}
                        className="w-10 h-10 rounded-xl bg-surface hover:bg-neutral-50 border-2 border-on-surface transition-all active:scale-95 flex items-center justify-center shadow-[2px_2px_0px_0px_#1e1b4b]"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit className="h-4 w-4 text-neutral-700" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedApt(apt)
                          setShowOptionsMenu(true)
                        }}
                        className="w-10 h-10 rounded-xl bg-surface hover:bg-neutral-50 border-2 border-on-surface transition-all active:scale-95 flex items-center justify-center shadow-[2px_2px_0px_0px_#1e1b4b]"
                        title="ตัวเลือกการนัดหมาย"
                      >
                        <MoreVertical className="h-4 w-4 text-neutral-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddAppointment}
      />

      {/* Edit Modal */}
      <EditAppointmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        appointment={selectedApt}
        onSave={handleEditAppointment}
      />

      {/* Options Menu Modal */}
      <Y2KModal
        isOpen={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        title="จัดการการนัดหมาย"
      >
        <div className="flex flex-col gap-2.5">
          {selectedApt?.status === "pending" && (
            <button
              onClick={() => {
                if (selectedApt) handleStatusUpdate(selectedApt.id, "confirmed")
                setShowOptionsMenu(false)
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 font-bold border-2 border-on-surface shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-xs"
            >
              🟢 ยืนยันการนัดหมายคิว
            </button>
          )}

          {selectedApt?.status === "confirmed" && (
            <button
              onClick={() => {
                if (selectedApt) handleStatusUpdate(selectedApt.id, "done")
                setShowOptionsMenu(false)
              }}
              className="w-full bg-emerald-500 text-white rounded-xl py-3 font-bold border-2 border-on-surface shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-xs"
            >
              🎉 ลูกค้าทำเล็บเสร็จสิ้น
            </button>
          )}

          {selectedApt?.status !== "cancelled" && (
            <button
              onClick={() => {
                setShowOptionsMenu(false)
                setShowCancelModal(true)
              }}
              className="w-full bg-red-500 text-white rounded-xl py-3 font-bold border-2 border-on-surface shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-xs"
            >
              🔴 ยกเลิกคิว (แจ้งเหตุผลลูกค้า)
            </button>
          )}

          <button
            onClick={() => setShowOptionsMenu(false)}
            className="w-full bg-white text-neutral-700 rounded-xl py-3 font-bold border-2 border-on-surface hover:bg-neutral-50 transition-all text-xs"
          >
            ย้อนกลับ
          </button>
        </div>
      </Y2KModal>

      {/* Cancellation Reason Modal */}
      <Y2KModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setCancelReason("")
        }}
        title="ยกเลิกการจองคิวลูกค้า"
      >
        <form onSubmit={handleCancelSubmit} className="space-y-4">
          <div className="space-y-2 text-neutral-800">
            <p className="font-bold text-xs">คุณต้องการยกเลิกคิวของ <span className="text-primary font-black">{selectedApt?.customerName || selectedApt?.name}</span> ใช่หรือไม่?</p>
            <p className="text-[10px] text-neutral-400">กรุณาระบุสาเหตุที่ทำการยกเลิก เพื่อเป็นประวัติการแจ้งเตือนส่งกลับไปยังลูกค้า</p>
          </div>

          <div className="space-y-1">
            <label htmlFor="cancel-text" className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">สาเหตุที่ยกเลิก *</label>
            <textarea
              id="cancel-text"
              required
              rows={3}
              placeholder="เช่น ช่างแนนป่วยกะทันหัน หรือ ร้านปิดปรับปรุงระบบค่ะ"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 py-2 text-xs outline-none focus:border-primary focus:ring-0"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowCancelModal(false)
                setCancelReason("")
              }}
              className="flex-1 h-10 rounded-xl border-2 border-on-surface bg-white text-neutral-700 font-bold hover:bg-neutral-50 active:scale-95 transition-all text-xs"
            >
              ย้อนกลับ
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-red-500 text-white rounded-xl font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
            >
              ยืนยันการยกเลิกคิว
            </button>
          </div>
        </form>
      </Y2KModal>

      {/* Success Notification Modal */}
      <Y2KModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="ดำเนินการสำเร็จ"
        footer={
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-2 px-5 font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            ตกลง
          </button>
        }
      >
        <div className="text-center py-4 space-y-3">
          <div className="text-5xl">✨</div>
          <p className="text-sm font-black text-neutral-800">{successMessage}</p>
        </div>
      </Y2KModal>
    </div>
  )
}
