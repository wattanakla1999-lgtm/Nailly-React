import React, { useEffect, useMemo, useState } from "react"
import { User, Phone } from "lucide-react"
import { Y2KModal } from "@/components/Y2KModal"
import { DatePicker } from "@/components/forms/DatePicker"
import { Dropdown, type DropdownOption } from "@/components/forms/Dropdown"
import type { UpdateBookingPayload } from "@/services/bookingService"
import type { Technician } from "@/services/technicianService"
import type { Appointment, Customer, Service } from "@/types"

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
    ...technicians.filter((technician) => technician.id).map((technician) => ({ value: technician.id, label: technician.name })),
  ], [technicians])

  useEffect(() => {
    if (appointment) {
      setUserId(appointment.userId || "")
      setCustomerName(appointment.customerName || appointment.name || "")
      setPhone(appointment.phone)
      setServiceId(appointment.serviceId || "")
      setTechnicianId(appointment.technicianId || "")
      setNote(appointment.note || "")

      if (appointment.startAt) {
        const startAt = new Date(appointment.startAt)
        setDate(startAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" }))
        setTime(startAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }))
      } else {
        setDate(appointment.date)
        setTime(appointment.time)
      }
    }
  }, [appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointment?.id || !userId || !serviceId || !customerName || !phone || !date || !time) return

    setSaving(true)
    try {
      await onSave(appointment.id, {
        userId: Number(userId),
        serviceId: Number(serviceId),
        technicianId: technicianId ? Number(technicianId) : null,
        startAt: `${date}T${time}:00+07:00`,
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        note: note.trim() || undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Y2KModal isOpen={isOpen} onClose={onClose} title="แก้ไขการนัดหมาย">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">บัญชีลูกค้า *</label>
          <Dropdown
            value={userId}
            options={customerOptions}
            placeholder="เลือกลูกค้า"
            onChange={(value) => {
              setUserId(value)
              const customer = customers.find((item) => item.id === value)
              if (customer) setCustomerName(customer.name)
            }}
          />
        </div>

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
          <Dropdown
            value={serviceId}
            options={serviceOptions}
            placeholder="เลือกบริการ"
            onChange={setServiceId}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">วันที่นัด</label>
            <DatePicker
              value={date}
              onChange={setDate}
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
            <Dropdown
              value={technicianId}
              options={technicianOptions}
              onChange={setTechnicianId}
              placement="top"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ราคาบริการ</label>
            <div className="flex h-10 items-center rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 text-xs font-black text-primary">
              ฿{(services.find((service) => service.id === serviceId)?.price || appointment?.price || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">หมายเหตุ</label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
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
            disabled={saving}
            className="flex-1 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </form>
    </Y2KModal>
  )
}
