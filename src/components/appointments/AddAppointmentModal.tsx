import React, { useEffect, useMemo, useState } from "react"
import { User, Phone } from "lucide-react"
import { Y2KModal } from "@/components/Y2KModal"
import { DatePicker } from "@/components/forms/DatePicker"
import { Dropdown, type DropdownOption } from "@/components/forms/Dropdown"
import { fetchBusySlots, type BookingPayload } from "@/services/bookingService"
import type { Technician } from "@/services/technicianService"
import type { Customer, Service } from "@/types"
import { cn, generateTimeSlots } from "@/lib/utils"



interface AddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: BookingPayload) => Promise<void>
  customers: Customer[]
  services: Service[]
  technicians: Technician[]
}

export function AddAppointmentModal({ isOpen, onClose, onSave, customers, services, technicians }: AddModalProps) {
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
  const [customerType, setCustomerType] = useState<"existing" | "new">("existing")

  const timeSlots = useMemo(() => {
    const open = localStorage.getItem("nailly_shop_open_time") || "10:00"
    const close = localStorage.getItem("nailly_shop_close_time") || "20:00"
    return generateTimeSlots(open, close)
  }, [isOpen])

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
    if (!isOpen) return
    setCustomerType("existing")
    setUserId("")
    setCustomerName("")
    setPhone("")
    setServiceId(services.find((service) => service.id && service.id !== "0")?.id || "")
    setTechnicianId("")
    setDate("")
    setTime("")
    setNote("")
    setBusySlots([])
  }, [isOpen, services])

  useEffect(() => {
    if (date) {
      const techId = technicianId ? Number(technicianId) : null
      const svcId = serviceId ? Number(serviceId) : null
      void fetchBusySlots(date, techId, svcId).then((slots) => {
        setBusySlots(slots)
      })
    } else {
      setBusySlots([])
    }
  }, [date, technicianId, serviceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (customerType === "existing" && !userId) {
      alert("กรุณาเลือกบัญชีลูกค้า")
      return
    }
    if (!customerName || !phone || !date || !time) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    if (busySlots.includes(time)) {
      alert("ช่วงเวลานี้คิวซ้อนกัน กรุณาเลือกเวลาใหม่ค่ะ")
      return
    }

    setSaving(true)
    try {
      await onSave({
        userId: customerType === "existing" ? Number(userId) : null,
        serviceId: Number(serviceId),
        technicianId: technicianId ? Number(technicianId) : null,
        startAt: `${date}T${time}:00+07:00`,
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        note: note.trim() || undefined,
        status: "confirmed",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Y2KModal isOpen={isOpen} onClose={onClose} title="เพิ่มการนัดหมายใหม่">
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
          <Dropdown
            value={serviceId}
            options={serviceOptions}
            placeholder="เลือกบริการ"
            onChange={setServiceId}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ช่างผู้ให้บริการ</label>
            <Dropdown
              value={technicianId}
              options={technicianOptions}
              onChange={setTechnicianId}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ราคาบริการ</label>
            <div className="flex h-10 items-center rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 text-xs font-black text-primary">
              ฿{(services.find((service) => service.id === serviceId)?.price || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">วันที่สะดวก *</label>
            <DatePicker
              value={date}
              onChange={setDate}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ช่วงเวลาบริการ *</label>
            {date ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isBusy = busySlots.includes(slot)
                  const isSelected = time === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setTime(slot)}
                      className={cn(
                        "py-2 rounded-lg font-bold text-[10px] transition-all border-2 text-center",
                        isBusy
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
            {saving ? "กำลังบันทึก..." : "บันทึกการนัดหมาย"}
          </button>
        </div>
      </form>
    </Y2KModal>
  )
}
