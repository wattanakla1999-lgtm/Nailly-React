import React, { useState } from "react"
import { User, Phone, DollarSign } from "lucide-react"
import { Y2KModal } from "@/components/Y2KModal"
import { DatePicker } from "@/components/forms/DatePicker"
import { Dropdown } from "@/components/forms/Dropdown"
import { SERVICE_OPTIONS, STAFF_OPTIONS } from "@/components/appointments/appointmentOptions"
import type { Appointment } from "@/types"

interface AddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (apt: Appointment) => void
}

export function AddAppointmentModal({ isOpen, onClose, onSave }: AddModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("เจลเมนิเกียร์")
  const [staff, setStaff] = useState("พี่แนน")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [price, setPrice] = useState(550)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !phone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
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
          <Dropdown
            value={service}
            options={SERVICE_OPTIONS}
            onChange={setService}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">วันที่สะดวก</label>
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
              value={staff}
              options={STAFF_OPTIONS}
              onChange={setStaff}
              placement="top"
            />
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
