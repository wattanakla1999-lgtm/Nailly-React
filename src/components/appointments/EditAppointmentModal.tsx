import React, { useState, useEffect } from "react"
import { User, Phone, DollarSign } from "lucide-react"
import { Y2KModal } from "@/components/Y2KModal"
import type { Appointment } from "@/types"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (apt: Appointment) => void
  appointment: Appointment | null
}

export function EditAppointmentModal({ isOpen, onClose, onSave, appointment }: EditModalProps) {
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
