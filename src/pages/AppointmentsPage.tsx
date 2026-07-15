import { useCallback, useEffect, useState } from "react"
import { AlertCircle, Calendar, Check, ChevronLeft, ChevronRight, Edit, MoreVertical, Plus, Search, Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Y2KModal } from "@/components/Y2KModal"
import { AddAppointmentModal } from "@/components/appointments/AddAppointmentModal"
import { EditAppointmentModal } from "@/components/appointments/EditAppointmentModal"
import { LoadingPopup } from "@/components/LoadingPopup"
import { getApiErrorMessage } from "@/lib/apiError"
import {
  createBooking,
  deleteBooking,
  fetchBookings,
  updateBooking,
  updateBookingStatus,
  type BookingPayload,
  type UpdateBookingPayload,
} from "@/services/bookingService"
import { fetchCustomers } from "@/services/customerService"
import { fetchServices } from "@/services/serviceService"
import { fetchTechnicians, type Technician } from "@/services/technicianService"
import type { Appointment, AppStatus, Customer, Service } from "@/types"

const FILTER_TABS: { label: string; value: AppStatus | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "ยืนยันแล้ว", value: "confirmed" },
  { label: "รอยืนยัน", value: "pending" },
  { label: "เสร็จสิ้น", value: "done" },
  { label: "ยกเลิก", value: "cancelled" },
]

const STATUS_CONFIG: Record<string, { label: string; styles: string }> = {
  confirmed: { label: "ยืนยันแล้ว", styles: "bg-tertiary-container text-tertiary border-tertiary" },
  pending:   { label: "รอยืนยัน",  styles: "bg-secondary-container text-on-secondary-container border-secondary" },
  done:      { label: "เสร็จสิ้น", styles: "bg-neutral-100 text-neutral-500 border-neutral-300" },
  cancelled: { label: "ยกเลิก",    styles: "bg-red-100 text-red-600 border-red-300" },
  active:    { label: "กำลังรับบริการ", styles: "bg-purple-100 text-purple-600 border-purple-300" },
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [activeFilter, setActiveFilter] = useState<AppStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  // Modal display states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Working appointment slots
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const loadBookings = useCallback(async () => {
    setLoading(true)
    const result = await fetchBookings({ page, limit, status: activeFilter })
    
    // Resolve technician name from technicians list if missing
    const resolvedBookings = result.bookings.map((apt) => {
      if (apt.technicianId && (apt.staff === "ใครก็ได้" || !apt.staff)) {
        const tech = technicians.find((t) => t.id === apt.technicianId)
        if (tech) {
          return {
            ...apt,
            staff: tech.name,
            staffImg: tech.profileImg,
          }
        }
      }
      return apt
    })

    setAppointments(resolvedBookings)
    setTotal(result.total)
    setIsOffline(result.isOffline)
    setLoading(false)
  }, [activeFilter, limit, page, technicians])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  useEffect(() => {
    void Promise.all([
      fetchCustomers({ page: 1, limit: 100, searchQuery: "", activeTag: "all" }),
      fetchServices({ page: 1, limit: 100 }),
      fetchTechnicians({ page: 1, limit: 100 }),
    ]).then(([customerResult, serviceResult, technicianResult]) => {
      setCustomers(customerResult.customers)
      setServices(serviceResult.services)
      setTechnicians(technicianResult.technicians)
    })
  }, [])

  // Action: Add appointment
  const handleAddAppointment = async (payload: BookingPayload) => {
    try {
      const newBooking = await createBooking(payload)
      // Force confirm status for admin-created appointments if database defaults new records to pending
      if (newBooking.id) {
        try {
          await updateBookingStatus(newBooking.id, "confirmed")
        } catch (statusErr) {
          console.warn("Unable to auto-confirm new booking", statusErr)
        }
      }
      await loadBookings()
      setShowAddModal(false)
      setSuccessMessage("บันทึกการนัดหมายใหม่เรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      setSuccessMessage(getApiErrorMessage(error, "สร้างการนัดหมายไม่สำเร็จ"))
      setShowSuccessModal(true)
      throw error
    }
  }

  // Action: Edit appointment
  const handleEditAppointment = async (id: string, payload: UpdateBookingPayload) => {
    try {
      await updateBooking(id, payload)
      await loadBookings()
      setShowEditModal(false)
      setSuccessMessage("แก้ไขรายละเอียดการนัดหมายเรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      setSuccessMessage(getApiErrorMessage(error, "แก้ไขการนัดหมายไม่สำเร็จ"))
      setShowSuccessModal(true)
      throw error
    }
  }

  // Action: Update status directly (e.g. confirm/done)
  const handleStatusUpdate = async (id: string, nextStatus: AppStatus, reason?: string) => {
    try {
      await updateBookingStatus(id, nextStatus, reason)
      await loadBookings()
      setSuccessMessage("อัปเดตสถานะนัดหมายเรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      setSuccessMessage(getApiErrorMessage(error, "อัปเดตสถานะไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  // Action: Cancel appointment with reason
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApt) return

    if (!selectedApt.id) return
    await handleStatusUpdate(selectedApt.id, "cancelled", cancelReason)
    setShowCancelModal(false)
    setCancelReason("")
  }

  const handleDeleteBooking = async () => {
    if (!selectedApt?.id) return
    try {
      await deleteBooking(selectedApt.id)
      await loadBookings()
      setShowDeleteModal(false)
      setSelectedApt(null)
      setSuccessMessage("ลบการนัดหมายเรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      setSuccessMessage(getApiErrorMessage(error, "ลบการนัดหมายไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
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
  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="space-y-4">
      <LoadingPopup isOpen={loading} message="กำลังเรียกดูข้อมูลคิวนัดหมาย..." />

      {/* Header Section */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-baseline gap-2 text-2xl font-black tracking-tight text-on-surface">
            การนัดหมาย
            <span className="text-base font-normal text-outline">({total})</span>
          </h1>
          {isOffline && (
            <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-500">
              <AlertCircle className="h-3 w-3" /> รอเปิดใช้งาน Booking API จาก backend
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-3 text-xs font-bold text-white shadow-[3px_3px_0px_0px_#1e1b4b] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มนัดหมาย
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, บริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border-2 border-outline-variant bg-surface pl-10 pr-3 text-xs font-bold outline-none shadow-[2px_2px_0px_0px_#c7d2fe] transition-all placeholder:text-outline-variant focus:border-primary focus:ring-0"
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
              onClick={() => {
                setActiveFilter(value)
                setPage(1)
              }}
              className={cn(
                "whitespace-nowrap rounded-full border-2 px-4 py-2 text-[10px] font-bold transition-all",
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
        <div className="space-y-5">
          {Object.entries(grouped).map(([date, apts]) => (
            <section key={date} className="space-y-3">
              <h3 className="flex items-center gap-3 text-base font-black tracking-tight text-on-surface">
                {date}
                <span className="h-0.5 flex-grow bg-outline-variant" />
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {apts.map((apt) => (
                  <div
                    key={apt.id}
                    className="glass-card relative flex min-w-0 flex-col items-stretch gap-3 overflow-hidden rounded-[20px] p-3"
                  >
                    {/* Left Time Block */}
                    <div
                      className={cn(
                        "flex w-full flex-row items-center justify-center gap-2 rounded-xl border-2 p-2",
                        apt.status === "confirmed"
                          ? "bg-primary-container border-primary/20 text-primary"
                          : "bg-surface-variant border-outline-variant text-on-surface"
                      )}
                    >
                      <span className="text-base font-bold leading-none">{apt.time}</span>
                      <span className="text-[10px] font-semibold opacity-75">{apt.duration} นาที</span>
                    </div>

                    {/* Middle Details */}
                    <div className="flex min-w-0 flex-grow flex-col justify-center space-y-1.5 text-[10px] font-bold text-neutral-600">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <h4 className="truncate text-sm font-black text-on-surface">{apt.customerName || apt.name}</h4>
                        <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold", (STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending).styles)}>
                          {(STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending).label}
                        </span>
                      </div>
                      
                      <p className="flex min-w-0 items-center gap-1.5 font-black text-on-surface-variant">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">{apt.service}</span>
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
                    <div className="mt-auto flex shrink-0 items-center justify-end gap-1.5 border-t border-dashed border-outline-variant pt-2">
                      {apt.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(apt.id!, "confirmed")}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-primary text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                          title="ยืนยันคิวจอง"
                          aria-label={`ยืนยันคิวของ ${apt.customerName || apt.name || "ลูกค้า"}`}
                        >
                          <Check className="h-5 w-5 stroke-[2.5px]" />
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApt(apt)
                          setShowEditModal(true)
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/25 bg-white text-primary transition-colors hover:border-primary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                        title="แก้ไขข้อมูล"
                        aria-label={`แก้ไขคิวของ ${apt.customerName || apt.name || "ลูกค้า"}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApt(apt)
                          setShowOptionsMenu(true)
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-outline-variant bg-white text-on-surface transition-colors hover:border-primary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                        title="ตัวเลือกการนัดหมาย"
                        aria-label={`ตัวเลือกคิวของ ${apt.customerName || apt.name || "ลูกค้า"}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="flex items-center justify-between border-t-2 border-dashed border-outline-variant pt-4">
            <span className="text-xs font-bold text-neutral-400">
              หน้า {page} จาก {totalPages} (ทั้งหมด {total} รายการ)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className={cn(
                  "rounded-xl border-2 p-2 transition-all",
                  page <= 1
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-300"
                    : "border-on-surface bg-white text-on-surface shadow-[2px_2px_0px_#1e1b4b]"
                )}
                aria-label="หน้าก่อนหน้า"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className={cn(
                  "rounded-xl border-2 p-2 transition-all",
                  page >= totalPages
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-300"
                    : "border-on-surface bg-white text-on-surface shadow-[2px_2px_0px_#1e1b4b]"
                )}
                aria-label="หน้าถัดไป"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddAppointment}
        customers={customers}
        services={services}
        technicians={technicians}
      />

      {/* Edit Modal */}
      <EditAppointmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        appointment={selectedApt}
        onSave={handleEditAppointment}
        customers={customers}
        services={services}
        technicians={technicians}
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
                if (selectedApt) handleStatusUpdate(selectedApt.id!, "confirmed")
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
                if (selectedApt) handleStatusUpdate(selectedApt.id!, "done")
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
            type="button"
            onClick={() => {
              setShowOptionsMenu(false)
              setShowDeleteModal(true)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" /> ลบการนัดหมาย
          </button>

          <button
            onClick={() => setShowOptionsMenu(false)}
            className="w-full bg-white text-neutral-700 rounded-xl py-3 font-bold border-2 border-on-surface hover:bg-neutral-50 transition-all text-xs"
          >
            ย้อนกลับ
          </button>
        </div>
      </Y2KModal>

      <Y2KModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="ยืนยันการลบนัดหมาย"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl border-2 border-outline-variant bg-white px-4 py-2 text-xs font-bold text-neutral-600"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDeleteBooking}
              className="rounded-xl border-2 border-red-500 bg-red-500 px-4 py-2 text-xs font-bold text-white"
            >
              ลบข้อมูล
            </button>
          </>
        }
      >
        <p className="py-3 text-center text-sm font-black text-neutral-800">
          ต้องการลบนัดหมายของ {selectedApt?.customerName || selectedApt?.name} ใช่ไหม?
        </p>
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
