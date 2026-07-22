import React, { useEffect, useMemo, useState } from "react"
import { User, Phone } from "lucide-react"
import { Y2KModal } from "@/components/Y2KModal"
import { DatePicker } from "@/components/forms/DatePicker"
import { Dropdown, type DropdownOption } from "@/components/forms/Dropdown"
import { fetchBusySlotAvailability, type UpdateBookingPayload } from "@/services/bookingService"
import type { Technician } from "@/services/technicianService"
import type { Appointment, Customer, Service } from "@/types"
import { cn, generateTimeSlots } from "@/lib/utils"
import { buildStaffOptions } from "@/lib/bookingOptions"
import { getLocalDateValue, normalizePhone, validateBookingDraft } from "@/lib/bookingValidation"



interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, payload: UpdateBookingPayload) => Promise<void>
  appointment: Appointment | null
  customers: Customer[]
  services: Service[]
  technicians: Technician[]
}

export function EditAppointmentModal({ isOpen, onClose, onSave, appointment, customers, services, technicians }: EditModalProps) {
  const [userId, setUserId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [busySlots, setBusySlots] = useState<string[]>([])
  const [busySlotsLoading, setBusySlotsLoading] = useState(false)
  const [busySlotsOffline, setBusySlotsOffline] = useState(false)
  const [originalDate, setOriginalDate] = useState("")
  const [originalTime, setOriginalTime] = useState("")
  const [customerType, setCustomerType] = useState<"existing" | "new">("existing")

  const openTime = localStorage.getItem("nailly_shop_open_time") || "10:00"
  const closeTime = localStorage.getItem("nailly_shop_close_time") || "20:00"
  const timeSlots = useMemo(() => generateTimeSlots(openTime, closeTime), [closeTime, openTime])

  const customerOptions = useMemo<DropdownOption[]>(() => customers.map((customer) => ({
    value: customer.id,
    label: `${customer.name} (${customer.email})`,
  })), [customers])
  const serviceOptions = useMemo<DropdownOption[]>(() => services.filter((service) => service.id && service.id !== "0").map((service) => ({
    value: service.id,
    label: `${service.name} (฿${service.price.toLocaleString()})`,
  })), [services])
  const technicianOptions = useMemo<DropdownOption[]>(() => [
    { value: "", label: "ใครก็ได้" },
    ...technicians.filter((technician) => technician.status === "active" && technician.id).map((technician) => ({ value: technician.id, label: technician.name })),
  ], [technicians])
  const staffOptions = useMemo(() => buildStaffOptions(technicians), [technicians])
  const selectedService = services.find((service) => service.id === serviceId) || null
  const selectedStaff = staffOptions.find((staff) => staff.id === (technicianId || "any")) || null

  useEffect(() => {
    if (appointment) {
      setUserId(appointment.userId || "")
      setCustomerType(appointment.userId ? "existing" : "new")
      setCustomerName(appointment.customerName || appointment.name || "")
      setPhone(appointment.phone)
      setServiceId(appointment.serviceId || "")
      setTechnicianId(appointment.technicianId || "")
      setNote(appointment.note || "")

      let originalD = appointment.date
      let originalT = appointment.time

      if (appointment.startAt) {
        const startAt = new Date(appointment.startAt)
        originalD = startAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" })
        originalT = startAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Bangkok" })
        setDate(originalD)
        setTime(originalT)
      } else {
        setDate(appointment.date)
        setTime(appointment.time)
      }

      setOriginalDate(originalD)
      setOriginalTime(originalT)
    }
  }, [appointment])

  useEffect(() => {
    if (!date) {
      setBusySlots([])
      setBusySlotsLoading(false)
      setBusySlotsOffline(false)
      return
    }

    let cancelled = false
    const techId = technicianId ? Number(technicianId) : null
    const svcId = serviceId ? Number(serviceId) : null

    setBusySlotsLoading(true)
    setBusySlotsOffline(false)

    void fetchBusySlotAvailability(date, techId, svcId)
      .then((result) => {
        if (cancelled) return
        setBusySlots(result.busySlots)
        setBusySlotsOffline(result.isOffline)
      })
      .finally(() => {
        if (!cancelled) setBusySlotsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [date, technicianId, serviceId])

  useEffect(() => {
    const isOwnTime = date === originalDate && time === originalTime
    if (time && ((busySlots.includes(time) && !isOwnTime) || !timeSlots.includes(time))) {
      setTime("")
    }
  }, [busySlots, date, originalDate, originalTime, time, timeSlots])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (customerType === "existing" && !userId) {
      alert("กรุณาเลือกบัญชีลูกค้า")
      return
    }
    if (!appointment?.id) return

    if (busySlotsLoading) {
      alert("ระบบกำลังตรวจสอบเวลาว่าง กรุณารอสักครู่")
      return
    }

    if (busySlotsOffline) {
      alert("ยังตรวจสอบเวลาว่างไม่ได้ กรุณาลองใหม่อีกครั้ง")
      return
    }

    const isOverlapping = busySlots.includes(time) && !(date === originalDate && time === originalTime)
    if (isOverlapping) {
      alert("ช่วงเวลานี้คิวซ้อนกัน กรุณาเลือกเวลาใหม่ค่ะ")
      return
    }

    const validation = validateBookingDraft({
      services,
      staffs: staffOptions,
      timeSlots,
      busySlots: date === originalDate && time === originalTime ? [] : busySlots,
      selectedService,
      selectedStaff,
      selectedDate: date,
      selectedTime: time,
      customerName,
      customerPhone: phone,
      customerNote: note,
      allowPast: date === originalDate && originalDate < getLocalDateValue(),
    })

    if (!validation.ok) {
      alert(validation.errors.join("\n"))
      return
    }

    setSaving(true)
    try {
      await onSave(appointment.id, {
        userId: customerType === "existing" ? Number(userId) : null,
        serviceId: Number(validation.value.service.id),
        technicianId: validation.value.staff.id !== "any" ? Number(validation.value.staff.id) : null,
        startAt: validation.value.startAt,
        customerName: validation.value.customerName,
        customerPhone: validation.value.customerPhone,
        note: validation.value.note,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Y2KModal isOpen={isOpen} onClose={onClose} title="แก้ไขการนัดหมาย">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Type Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-variant/30 rounded-xl border-2 border-outline-variant">
          <button
            type="button"
            onClick={() => {
              setCustomerType("existing")
              setUserId("")
              setCustomerName("")
              setPhone("")
            }}
            className={cn(
              "py-1.5 rounded-lg text-xs font-bold transition-all text-center",
              customerType === "existing"
                ? "bg-primary text-white border-2 border-on-surface shadow-[1px_1px_0px_#1e1b4b]"
                : "text-neutral-600 hover:text-neutral-800"
            )}
          >
            ลูกค้าเก่า (มีบัญชีแล้ว)
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomerType("new")
              setUserId("")
              setCustomerName("")
              setPhone("")
            }}
            className={cn(
              "py-1.5 rounded-lg text-xs font-bold transition-all text-center",
              customerType === "new"
                ? "bg-primary text-white border-2 border-on-surface shadow-[1px_1px_0px_#1e1b4b]"
                : "text-neutral-600 hover:text-neutral-800"
            )}
          >
            ลูกค้าใหม่ (ยังไม่มีบัญชี)
          </button>
        </div>

        {customerType === "existing" && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">บัญชีลูกค้า *</label>
            <Dropdown
              value={userId}
              options={customerOptions}
              placeholder="เลือกลูกค้า"
              onChange={(value) => {
                setUserId(value)
                const customer = customers.find((item) => item.id === value)
                if (customer) {
                  setCustomerName(customer.name)
                  if (customer.phone !== "-") setPhone(customer.phone)
                }
              }}
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อลูกค้า *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              maxLength={100}
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
              onChange={(e) => setPhone(normalizePhone(e.target.value))}
              maxLength={20}
              className="w-full h-10 pl-9 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">บริการ</label>
          <Dropdown
            value={serviceId}
            options={serviceOptions}
            placeholder="เลือกบริการ"
            onChange={(value) => {
              setServiceId(value)
              setTime("")
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ช่างผู้ให้บริการ</label>
            <Dropdown
              value={technicianId}
              options={technicianOptions}
              onChange={(value) => {
                setTechnicianId(value)
                setTime("")
              }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ราคาบริการ</label>
            <div className="flex h-10 items-center rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 text-xs font-black text-primary">
              ฿{(services.find((service) => service.id === serviceId)?.price || appointment?.price || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">วันที่นัด *</label>
            <DatePicker
              value={date}
              onChange={(value) => {
                setDate(value)
                setTime("")
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ช่วงเวลาบริการ *</label>
            {date ? (
              <>
                {busySlotsLoading && (
                  <p className="text-[10px] text-neutral-400 font-bold italic py-1">กำลังตรวจสอบเวลาว่าง...</p>
                )}
                {busySlotsOffline && (
                  <p className="text-[10px] text-red-500 font-bold italic py-1">ยังตรวจสอบเวลาว่างไม่ได้ กรุณาลองใหม่อีกครั้ง</p>
                )}
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isOwnTime = slot === originalTime && date === originalDate
                  const isBusy = busySlots.includes(slot) && !isOwnTime
                  const isSelected = time === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBusy || busySlotsLoading || busySlotsOffline}
                      onClick={() => setTime(slot)}
                      className={cn(
                        "py-2 rounded-lg font-bold text-[10px] transition-all border-2 text-center",
                        isBusy || busySlotsLoading || busySlotsOffline
                          ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary text-white border-primary shadow-[2px_2px_0px_#1e1b4b] -translate-x-[1px] -translate-y-[1px]"
                          : "bg-surface border-neutral-200 text-neutral-700 hover:border-outline hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[2px_2px_0px_#1e1b4b]"
                      )}
                    >
                      {slot} น.
                    </button>
                  )
                })}
              </div>
              </>
            ) : (
              <p className="text-[10px] text-neutral-400 font-bold italic py-1">กรุณาเลือกวันที่ก่อนเพื่อตรวจสอบเวลาว่าง</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">หมายเหตุ</label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-xl border-2 border-outline-variant bg-surface px-3 py-2 text-xs font-bold outline-none focus:border-primary"
          />
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
            disabled={saving || busySlotsLoading || busySlotsOffline}
            className="flex-1 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </form>
    </Y2KModal>
  )
}
