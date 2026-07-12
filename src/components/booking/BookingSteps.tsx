import React from "react"
import { Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Service, Staff } from "@/types"

// ─── Step 0: Greeting Step ──────────────────────────────────────────────────────

interface GreetingStepProps {
  onNext: () => void
}

export function GreetingStep({ onNext }: GreetingStepProps) {
  return (
    <div className="py-8 space-y-6 flex flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white border-3 border-primary shadow-[4px_4px_0px_#FB923C] text-4xl animate-bounce">
        💅
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-primary tracking-tighter">จองคิวทำเล็บออนไลน์</h1>
        <p className="text-sm font-semibold text-neutral-500">จองด่วนใน 4 ขั้นตอน ไม่ต้องรอคิวที่ร้าน</p>
      </div>

      <div className="w-full max-w-sm space-y-3 bg-primary-container/20 border-2 border-dashed border-outline-variant p-5 rounded-xl text-left text-xs font-semibold text-neutral-700">
        <p className="flex items-center gap-2">✨ เลือกลายเพ้นท์และต่อเล็บตามชอบ</p>
        <p className="flex items-center gap-2">⏰ เลือกช่างและวันเวลาที่สะดวกที่สุด</p>
        <p className="flex items-center gap-2">📱 บันทึกข้อมูล และดูสถานะคิวได้ตลอดเวลา</p>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-sm bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-4 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all text-sm uppercase tracking-wider"
      >
        เริ่มทำการจองคิวเล็บ →
      </button>
    </div>
  )
}

// ─── Step 1: Service Selection Step ─────────────────────────────────────────────────

interface ServiceSelectionStepProps {
  services: Service[]
  selectedService: Service | null
  onSelectService: (service: Service) => void
  onNext: () => void
}

export function ServiceSelectionStep({
  services,
  selectedService,
  onSelectService,
  onNext,
}: ServiceSelectionStepProps) {
  return (
    <div className="space-y-6 w-full mx-auto h-full flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">เลือกประเภทบริการ</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">ราคาและจำนวนเวลาจะคำนวณตามจริง</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-grow my-2">
        {services.map((svc) => (
          <div
            key={svc.id}
            onClick={() => onSelectService(svc)}
            className={cn(
              "p-3 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-48 border-3",
              selectedService?.id === svc.id
                ? "bg-white border-primary shadow-[4px_4px_0px_#FB923C] -translate-x-[2px] -translate-y-[2px]"
                : "bg-surface border-neutral-200 hover:border-outline hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#FB923C] shadow-none"
            )}
          >
            <div className="space-y-2">
              {svc.img && (
                <img
                  src={svc.img}
                  alt={svc.name}
                  className="w-full h-20 object-cover rounded-xl border-2 border-outline-variant"
                />
              )}
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-neutral-800 truncate">{svc.nameTh || svc.name}</h4>
                <p className="text-[10px] text-neutral-400 font-semibold">{svc.duration} นาที</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 border-t border-dashed border-outline-variant/60 pt-2 shrink-0">
              <span className="text-[10px] text-neutral-400 font-bold">ราคา</span>
              <span className="text-xs sm:text-sm font-black text-primary">฿{svc.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t-2 border-outline-variant/60 w-full z-10 shrink-0">
        <button
          disabled={!selectedService}
          onClick={onNext}
          className={cn(
            "w-full rounded-xl py-3.5 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] transition-all flex items-center justify-center gap-2 text-sm",
            selectedService
              ? "bg-gradient-to-r from-primary to-secondary text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b]"
              : "bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed shadow-none"
          )}
        >
          เลือกช่างทำเล็บต่อ
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Staff Selection Step ───────────────────────────────────────────────────

interface StaffSelectionStepProps {
  staffs: Staff[]
  selectedStaff: Staff | null
  onSelectStaff: (staff: Staff) => void
  onNext: () => void
}

export function StaffSelectionStep({
  staffs,
  selectedStaff,
  onSelectStaff,
  onNext,
}: StaffSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">เลือกช่างทำเล็บคนโปรด</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">เราคัดช่างฝีมือดีมาคอยบริการคุณ</p>
      </div>

      <div className="space-y-3">
        {staffs.map((stf) => (
          <div
            key={stf.id}
            onClick={() => onSelectStaff(stf)}
            className={cn(
              "p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 border-3",
              selectedStaff?.id === stf.id
                ? "bg-white border-primary shadow-[4px_4px_0px_#FB923C] -translate-x-[2px] -translate-y-[2px]"
                : "bg-surface border-neutral-200 hover:border-outline hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#FB923C]"
            )}
          >
            {stf.img.startsWith("http") ? (
              <img src={stf.img} alt={stf.name} className="w-12 h-12 rounded-full object-cover border-2 border-outline-variant" />
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-outline-variant flex items-center justify-center text-xl bg-neutral-100">{stf.img}</div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-neutral-800">{stf.name}</h4>
              <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{stf.role}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-amber-500 text-xs font-bold">
              <Star className="h-3 w-3 fill-amber-500" /> {stf.rate}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!selectedStaff}
        onClick={onNext}
        className={cn(
          "w-full rounded-xl py-3.5 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] transition-all flex items-center justify-center gap-2 text-sm",
          selectedStaff
            ? "bg-gradient-to-r from-primary to-secondary text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b]"
            : "bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed shadow-none"
        )}
      >
        เลือกเวลาที่สะดวกต่อ
      </button>
    </div>
  )
}

// ─── Step 3: Date & Time Step ─────────────────────────────────────────────────────

interface DateTimeStepProps {
  timeSlots: string[]
  selectedDate: string
  selectedTime: string
  onChangeDate: (date: string) => void
  onChangeTime: (time: string) => void
  todayDateString: string
  onNext: () => void
}

export function DateTimeStep({
  timeSlots,
  selectedDate,
  selectedTime,
  onChangeDate,
  onChangeTime,
  todayDateString,
  onNext,
}: DateTimeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">เลือกวัน/เวลารับบริการ</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">ร้านเปิดให้บริการทุกวัน</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="booking-date" className="text-xs font-bold uppercase tracking-wider text-neutral-600">วันที่สะดวก</label>
          <input
            id="booking-date"
            type="date"
            min={todayDateString}
            value={selectedDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-0 shadow-[2px_2px_0px_#c7d2fe]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">ช่วงเวลา</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onChangeTime(time)}
                className={cn(
                  "py-2.5 rounded-lg font-bold text-xs transition-all border-3",
                  selectedTime === time
                    ? "bg-white text-on-surface border-primary shadow-[4px_4px_0px_#FB923C] -translate-x-[2px] -translate-y-[2px]"
                    : "bg-surface border-neutral-200 text-neutral-700 hover:border-outline hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#FB923C]"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={!selectedDate || !selectedTime}
        onClick={onNext}
        className={cn(
          "w-full rounded-xl py-3.5 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] transition-all flex items-center justify-center gap-2 text-sm",
          selectedDate && selectedTime
            ? "bg-gradient-to-r from-primary to-secondary text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b]"
            : "bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed shadow-none"
        )}
      >
        กรอกข้อมูลลูกค้าต่อ
      </button>
    </div>
  )
}

// ─── Step 4: Contact Detail Step ────────────────────────────────────────────────────

interface ContactDetailStepProps {
  customerName: string
  customerPhone: string
  customerNote: string
  onChangeName: (name: string) => void
  onChangePhone: (phone: string) => void
  onChangeNote: (note: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ContactDetailStep({
  customerName,
  customerPhone,
  customerNote,
  onChangeName,
  onChangePhone,
  onChangeNote,
  onSubmit,
}: ContactDetailStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">ยืนยันข้อมูลการติดต่อ</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">ใช้ข้อมูลนี้ในการส่งคิวและประวัติการจอง</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="book-cust-name" className="text-xs font-bold uppercase tracking-wider text-neutral-600">ชื่อผู้จอง</label>
          <input
            id="book-cust-name"
            type="text"
            required
            placeholder="กรุณากรอกชื่อจริง/ชื่อเล่น"
            value={customerName}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-0 shadow-[2px_2px_0px_#c7d2fe]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="book-cust-phone" className="text-xs font-bold uppercase tracking-wider text-neutral-600">เบอร์โทรศัพท์ติดต่อ</label>
          <input
            id="book-cust-phone"
            type="tel"
            required
            placeholder="กรอกเบอร์มือถือ เช่น 089-1234567"
            value={customerPhone}
            onChange={(e) => onChangePhone(e.target.value)}
            className="w-full rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-0 shadow-[2px_2px_0px_#c7d2fe]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="book-cust-note" className="text-xs font-bold uppercase tracking-wider text-neutral-600">หมายเหตุถึงช่าง (ถ้ามี)</label>
          <textarea
            id="book-cust-note"
            rows={2}
            placeholder="ต้องการสีโทนไหนเป็นพิเศษแจ้งช่างได้เลยค่ะ"
            value={customerNote}
            onChange={(e) => onChangeNote(e.target.value)}
            className="w-full rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-0 shadow-[2px_2px_0px_#c7d2fe]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3.5 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] transition-all flex items-center justify-center gap-2 text-sm"
      >
        ยืนยันการจองคิวทำเล็บ
      </button>
    </form>
  )
}

// ─── Step 5: Success Step ─────────────────────────────────────────────────────────

interface SuccessStepProps {
  customerName: string
  customerPhone: string
  selectedService: Service | null
  selectedStaff: Staff | null
  selectedDate: string
  selectedTime: string
  onViewMyBookings: () => void
  onReset: () => void
}

export function SuccessStep({
  customerName,
  customerPhone,
  selectedService,
  selectedStaff,
  selectedDate,
  selectedTime,
  onViewMyBookings,
  onReset,
}: SuccessStepProps) {
  return (
    <div className="py-8 space-y-6 flex flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-500 text-3xl shadow-[3px_3px_0px_#10B981]">
        <Check className="h-8 w-8 stroke-[3px]" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-on-surface tracking-tight">ส่งคำขอจองคิวสำเร็จ!</h1>
        <p className="text-xs text-neutral-500 font-semibold">คุณสามารถติดตามสถานะการจองได้ที่แท็บ "การจองของฉัน"</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border-3 border-primary bg-primary-container/20 p-5 shadow-[4px_4px_0px_#FB923C] text-left text-xs font-bold text-neutral-700 space-y-3 relative overflow-hidden">
        <div className="absolute right-3 top-3 text-4xl opacity-15">💅</div>
        <p className="text-center text-sm font-black border-b-2 border-outline-variant/50 pb-2 mb-2 uppercase text-primary">ข้อมูลการจองของคุณ</p>
        <div className="flex justify-between"><span>ผู้จอง:</span> <span>คุณ {customerName}</span></div>
        <div className="flex justify-between"><span>เบอร์โทร:</span> <span>{customerPhone}</span></div>
        <div className="flex justify-between"><span>บริการ:</span> <span>{selectedService?.nameTh || selectedService?.name}</span></div>
        <div className="flex justify-between"><span>ช่าง:</span> <span>{selectedStaff?.name}</span></div>
        <div className="flex justify-between"><span>วัน/เวลา:</span> <span>{selectedDate} ({selectedTime} น.)</span></div>
        <div className="flex justify-between border-t border-dashed pt-3 font-black text-base text-primary">
          <span>ราคารวม:</span> <span>฿{selectedService?.price}</span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onViewMyBookings}
          className="flex-1 bg-gradient-to-r from-primary to-secondary text-white border-2 border-on-surface rounded-xl py-3 font-bold shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1e1b4b] transition-all text-xs"
        >
          ดูการจองของฉัน
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gradient-to-r from-primary to-secondary text-white border-2 border-on-surface rounded-xl py-3 font-bold shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1e1b4b] transition-all text-xs"
        >
          จองคิวใหม่อีกครั้ง
        </button>
      </div>
    </div>
  )
}
