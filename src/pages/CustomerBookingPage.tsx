import { useState, useEffect } from "react"
import { Check, ChevronLeft, Star, Calendar, Phone, History, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
  id: string
  name: string
  price: number
  duration: number
  img: string
  category: string
}

interface Staff {
  id: string
  name: string
  role: string
  img: string
  rate: number
}

interface Appointment {
  name: string
  phone: string
  service: string
  price: number
  staff: string
  date: string
  time: string
  status: "pending" | "confirmed" | "done"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  { id: "1", name: "เมนิเกียร์คลาสสิก", price: 250, duration: 45, img: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400", category: "manicure" },
  { id: "2", name: "เจลเมนิเกียร์", price: 550, duration: 75, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400", category: "manicure" },
  { id: "3", name: "เฟรนช์เมนิเกียร์", price: 450, duration: 60, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400", category: "manicure" },
  { id: "4", name: "เพนท์ลวดลาย", price: 150, duration: 30, img: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400", category: "art" },
  { id: "5", name: "เพนท์ลายพรีเมียม", price: 800, duration: 120, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400", category: "art" },
  { id: "6", name: "ต่อเล็บ PVC/เจล", price: 900, duration: 120, img: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400", category: "extension" },
  { id: "7", name: "เพดิเกียร์คลาสสิก", price: 350, duration: 60, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400", category: "pedicure" },
  { id: "8", name: "เจลเพดิเกียร์", price: 480, duration: 75, img: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400", category: "pedicure" },
]

const STAFFS: Staff[] = [
  { id: "any", name: "ใครก็ได้ (สุ่มช่าง)", role: "รวดเร็วที่สุด", img: "🔮", rate: 5.0 },
  {
    id: "1",
    name: "พี่แนน",
    role: "ผู้เชี่ยวชาญการสปา",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7QAGMLUQp8lXavTAhCH_8Kwgy2BCtbAx2MVSrr8nAaIV05XpoFZhMWnBTFLEn7vs3dB83G3Ox-nAR5zNINOJTjDtsNJz-Soe-4yRkcQ9a-XPcViqPp-Fn_lm6rtUEMmtY6AZ1E_pcrRZ5CL_SY0ycnPAVGJqXp5Nj2-ONvlzv1C_d5stavDpmVcJNVQjw4y5QnNaYNWXdGx8G5tsaaH3F13SRbjiEahPIMTrOKnqZorLdi3eocl4df92SLqZwrNCXsMcFzkUWiZ4",
    rate: 4.9,
  },
  {
    id: "2",
    name: "น้องมายด์",
    role: "มือเพ้นท์ลายศิลปะ",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSAh0ZD8Z3OWmftpMzXdcVcHr7UR5OmAKt2Gx8Qw39lvFd2FGQ7SCniXtinNSggIsRKilR3we0ZyAQsNLo9dLYirupmuHyuDs88Uk7K6fAybWPuWD81QjkOxR-TDlPsahC0tW9xhL5P9RNlxBK6MZcl3q7gam9IZmk7bUmbXsx9-d4B7xM-iI6jo4TSZgRv7_xEwiwX-0xrz09D1I9MJHZP5ITzu2IpxOjb9Tt-raoDorUI4_6i5MonJKu_IGE-6zZIHfAyHP69Xs",
    rate: 4.8,
  },
]

const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

const STATUS_MAP = {
  pending: { label: "รอยืนยัน", class: "bg-secondary-container text-on-secondary-container border-secondary" },
  confirmed: { label: "ยืนยันแล้ว", class: "bg-primary-container text-primary border-primary" },
  done: { label: "เสร็จสิ้น", class: "bg-neutral-100 text-neutral-600 border-neutral-400" },
}

export function CustomerBookingPage() {
  const [activeTab, setActiveTab] = useState<"book" | "my-bookings">("book")
  const [step, setStep] = useState(0) // 0: Greeting, 1: Service, 2: Staff, 3: Date/Time, 4: Contact, 5: Success

  // State values
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerNote, setCustomerNote] = useState("")

  // List of bookings from localStorage
  const [myBookings, setMyBookings] = useState<Appointment[]>([])
  const [searchPhone, setSearchPhone] = useState("")
  const [isShopOpen, setIsShopOpen] = useState(true)

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  // Fetch bookings on mount or when tab changes
  const loadBookings = () => {
    try {
      const stored = localStorage.getItem("nailly_custom_appointments")
      if (stored) {
        setMyBookings(JSON.parse(stored))
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadBookings()
    const status = localStorage.getItem("nailly_shop_status") || "open"
    setIsShopOpen(status === "open")
  }, [activeTab])

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    const newApt: Appointment = {
      name: customerName,
      phone: customerPhone,
      service: selectedService?.name || "สปาเล็บ",
      price: selectedService?.price || 0,
      staff: selectedStaff?.name || "ใครก็ได้",
      date: selectedDate,
      time: selectedTime,
      status: "pending",
    }

    const currentListStr = localStorage.getItem("nailly_custom_appointments") || "[]"
    const currentList = JSON.parse(currentListStr)
    const updatedList = [...currentList, newApt]
    localStorage.setItem("nailly_custom_appointments", JSON.stringify(updatedList))

    // Set phone number to filter history easily later
    setSearchPhone(customerPhone)
    loadBookings()
    nextStep()
  }

  // Filter bookings based on phone input
  const filteredBookings = myBookings.filter((b) => {
    if (!searchPhone) return true // Show all by default
    if (!b || !b.phone) return false // Prevent crashes if phone is missing
    return b.phone.replace(/[^0-9]/g, "").includes(searchPhone.replace(/[^0-9]/g, ""))
  })

  const todayDateString = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-mesh text-on-surface flex flex-col">
      {/* ── Immersive Sticky Header ── */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 w-full z-50 border-b-4 border-outline shadow-sm">
        <div className="flex justify-between items-center h-20 px-6 sm:px-12 w-full">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💅</span>
            <div>
              <span className="block text-2xl font-black text-primary tracking-tighter leading-none">Nailly</span>
              <span className="block text-[10px] text-secondary font-bold uppercase tracking-wider mt-1">คิวบอร์ดลูกค้า</span>
            </div>
          </div>

          {/* Toggle buttons for Book vs My Bookings */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("book")
                setStep(0)
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-1.5",
                activeTab === "book"
                  ? "bg-gradient-to-r from-primary to-secondary text-white border-on-surface shadow-[2px_2px_0px_#1e1b4b]"
                  : "bg-white border-outline-variant text-on-surface hover:bg-neutral-50"
              )}
            >
              <Calendar className="h-4 w-4" />
              จองคิวใหม่
            </button>
            <button
              onClick={() => {
                setActiveTab("my-bookings")
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center gap-1.5",
                activeTab === "my-bookings"
                  ? "bg-gradient-to-r from-primary to-secondary text-white border-on-surface shadow-[2px_2px_0px_#1e1b4b]"
                  : "bg-white border-outline-variant text-on-surface hover:bg-neutral-50"
              )}
            >
              <History className="h-4 w-4" />
              การจองของฉัน
            </button>
          </div>
        </div>
      </header>

      {/* ── Full Screen Immersive Layout ── */}
      <main className="flex-grow flex flex-col w-full bg-white">
        {activeTab === "book" ? (
          !isShopOpen ? (
            /* ── SHOP CLOSED SCREEN ── */
            <div className="w-full flex-grow bg-white flex flex-col items-center justify-center text-center p-8 space-y-6 min-h-[calc(100vh-80px)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 border-3 border-red-500 shadow-[4px_4px_0px_#ef4444] text-4xl animate-pulse">
                🚪
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-red-500 tracking-tighter">ขออภัย ร้านปิดให้บริการชั่วคราว</h1>
                <p className="text-sm font-semibold text-neutral-500 max-w-md mx-auto">
                  ขณะนี้ทางร้านปรับปรุงหรือปิดให้บริการชั่วคราวค่ะ ขออภัยในความไม่สะดวกเป็นอย่างสูง คุณสามารถตรวจสอบประวัติคิวจองของคุณได้ทางเมนู "การจองของฉัน" ด้านบนค่ะ
                </p>
              </div>
              {localStorage.getItem("nailly_shop_phone") && (
                <div className="text-xs font-bold text-neutral-700 bg-neutral-100 px-5 py-3 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_#1e1b4b]">
                  📞 โทรสอบถาม: {localStorage.getItem("nailly_shop_phone")}
                </div>
              )}
            </div>
          ) : (
            /* ── STEPPED BOOKING FLOW ── */
            <div className="w-full flex-grow flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
            {/* Left Brand Area (Responsive Side Banner) */}
            <div className="hidden md:flex md:w-80 bg-gradient-to-br from-primary to-secondary p-8 text-white flex-col justify-between border-r-4 border-on-surface relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
              <div className="relative space-y-4">
                <span className="text-4xl">✨</span>
                <h2 className="text-2xl font-black tracking-tight">Nailly Salon</h2>
                <p className="text-xs font-semibold leading-relaxed text-indigo-50">
                  ดูแลเล็บของคุณด้วยทีมงานมืออาชีพและสีเจลนำเข้าคุณภาพสูง สะอาด ปลอดภัย 100%
                </p>
              </div>

              {selectedService && (
                <div className="relative mt-8 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 space-y-2 text-xs font-semibold">
                  <p className="font-bold border-b border-white/20 pb-1.5 mb-1.5 text-secondary">รายการที่เลือก</p>
                  <p className="flex justify-between"><span>บริการ:</span> <span>{selectedService.name}</span></p>
                  {selectedStaff && <p className="flex justify-between"><span>ช่าง:</span> <span>{selectedStaff.name}</span></p>}
                  {selectedDate && <p className="flex justify-between"><span>วันที่:</span> <span>{selectedDate}</span></p>}
                  {selectedTime && <p className="flex justify-between"><span>เวลา:</span> <span>{selectedTime} น.</span></p>}
                  <p className="flex justify-between border-t border-dashed border-white/20 pt-2 font-black text-sm text-white">
                    <span>ราคารวม:</span> <span>฿{selectedService.price}</span>
                  </p>
                </div>
              )}

              <p className="relative mt-8 text-[10px] text-indigo-100 font-bold uppercase tracking-wider hidden md:block">
                📍 ซอยประเสริฐมนูกิจ · เปิด 10:00 - 20:00 น.
              </p>
            </div>

            {/* Right Interactive Booking Wizard */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Top back/nav bar */}
              {step > 0 && step < 5 && (
                <div className="p-4 border-b-2 border-outline-variant bg-surface-variant/30 flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 text-primary font-bold text-xs hover:text-secondary"
                  >
                    <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
                  </button>
                  <span className="text-xs font-bold text-outline">ขั้นตอนที่ {step} จาก 4</span>
                </div>
              )}

              <div className="p-6 sm:p-8 flex-grow">
                {/* STEP 0: GREETING SCREEN */}
                {step === 0 && (
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
                      onClick={nextStep}
                      className="w-full max-w-sm bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-4 font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all text-sm uppercase tracking-wider"
                    >
                      เริ่มทำการจองคิวเล็บ →
                    </button>
                  </div>
                )}

                {/* STEP 1: SELECT SERVICE */}
                {step === 1 && (
                  <div className="space-y-6 w-full mx-auto h-full flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-on-surface tracking-tight">เลือกประเภทบริการ</h2>
                      <p className="text-xs text-neutral-400 font-semibold mt-1">ราคาและจำนวนเวลาจะคำนวณตามจริง</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-grow my-2">
                      {SERVICES.map((svc) => (
                        <div
                          key={svc.id}
                          onClick={() => setSelectedService(svc)}
                          className={cn(
                            "p-3 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-48 border-3",
                            selectedService?.id === svc.id
                              ? "bg-white border-primary shadow-[4px_4px_0px_#FB923C] -translate-x-[2px] -translate-y-[2px]"
                              : "bg-surface border-neutral-200 hover:border-outline hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#FB923C] shadow-none"
                          )}
                        >
                          <div className="space-y-2">
                            <img
                              src={svc.img}
                              alt={svc.name}
                              className="w-full h-20 object-cover rounded-xl border-2 border-outline-variant"
                            />
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-neutral-800 truncate">{svc.name}</h4>
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
                        onClick={nextStep}
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
                )}

                {/* STEP 2: SELECT STAFF */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-on-surface tracking-tight">เลือกช่างทำเล็บคนโปรด</h2>
                      <p className="text-xs text-neutral-400 font-semibold mt-1">เราคัดช่างฝีมือดีมาคอยบริการคุณ</p>
                    </div>

                    <div className="space-y-3">
                      {STAFFS.map((stf) => (
                        <div
                          key={stf.id}
                          onClick={() => setSelectedStaff(stf)}
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
                      onClick={nextStep}
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
                )}

                {/* STEP 3: DATE & TIME SELECT */}
                {step === 3 && (
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
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-xl border-2 border-outline-variant bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-0 shadow-[2px_2px_0px_#c7d2fe]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">ช่วงเวลา</label>
                        <div className="grid grid-cols-3 gap-2">
                          {TIME_SLOTS.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
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
                      onClick={nextStep}
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
                )}

                {/* STEP 4: CONTACT DETAIL FORM */}
                {step === 4 && (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
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
                          onChange={(e) => setCustomerName(e.target.value)}
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
                          onChange={(e) => setCustomerPhone(e.target.value)}
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
                          onChange={(e) => setCustomerNote(e.target.value)}
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
                )}

                {/* STEP 5: SUCCESS CONFIRMATION SCREEN */}
                {step === 5 && (
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
                      <div className="flex justify-between"><span>บริการ:</span> <span>{selectedService?.name}</span></div>
                      <div className="flex justify-between"><span>ช่าง:</span> <span>{selectedStaff?.name}</span></div>
                      <div className="flex justify-between"><span>วัน/เวลา:</span> <span>{selectedDate} ({selectedTime} น.)</span></div>
                      <div className="flex justify-between border-t border-dashed pt-3 font-black text-base text-primary">
                        <span>ราคารวม:</span> <span>฿{selectedService?.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full max-w-sm">
                      <button
                        onClick={() => {
                          setActiveTab("my-bookings")
                        }}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white border-2 border-on-surface rounded-xl py-3 font-bold shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1e1b4b] transition-all text-xs"
                      >
                        ดูการจองของฉัน
                      </button>
                      <button
                        onClick={() => {
                          setSelectedService(null)
                          setSelectedStaff(null)
                          setSelectedDate("")
                          setSelectedTime("")
                          setCustomerName("")
                          setCustomerPhone("")
                          setCustomerNote("")
                          setStep(0)
                        }}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white border-2 border-on-surface rounded-xl py-3 font-bold shadow-[3px_3px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1e1b4b] transition-all text-xs"
                      >
                        จองคิวใหม่อีกครั้ง
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
          /* ── MY BOOKINGS SCREEN ── */
          <div className="w-full flex-grow bg-white p-6 sm:p-12 space-y-6 min-h-[calc(100vh-80px)]">
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">ดูการจองของฉัน</h2>
              <p className="text-xs text-neutral-400 font-semibold mt-1">ระบุเบอร์โทรศัพท์ที่คุณใช้ทำการจองคิว</p>
            </div>

            {/* Filter Search Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow max-w-md">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
                <input
                  type="text"
                  placeholder="ใส่เบอร์โทรศัพท์เพื่อค้นหาคิวจอง..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-sm outline-none placeholder:text-outline-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
                />
              </div>
              {searchPhone && (
                <button
                  onClick={() => setSearchPhone("")}
                  className="h-12 px-5 bg-surface border-2 border-outline-variant rounded-xl text-xs font-bold hover:bg-neutral-50 shadow-[2px_2px_0px_#c7d2fe]"
                >
                  ล้างคำค้นหา
                </button>
              )}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 border-2 border-dashed border-outline-variant rounded-2xl">
                <History className="mx-auto mb-3 h-12 w-12 opacity-30 text-primary" />
                <p className="font-bold text-sm">ไม่พบประวัติคิวจองสำหรับเบอร์โทรนี้</p>
                <p className="text-[10px] mt-1">กรุณาลองกรอกเบอร์โทรใหม่อีกครั้ง หรือกลับไปทำรายการจองใหม่ค่ะ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
                {filteredBookings.map((b, idx) => (
                  <div
                    key={`${b.phone || ""}-${idx}`}
                    className="glass-card rounded-[24px] p-4 flex flex-col gap-3 relative overflow-hidden hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-black text-primary text-base sm:text-lg flex items-center gap-1.5">
                        💅 {b.service}
                      </span>
                      <span className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wide border-2", STATUS_MAP[b.status]?.class || STATUS_MAP.pending.class)}>
                        {STATUS_MAP[b.status]?.label || "รอยืนยัน"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-neutral-700 font-bold border-t border-dashed border-outline-variant/60 pt-3">
                      <div className="flex justify-between">
                        <span>ช่างผู้ให้บริการ:</span>
                        <span className="text-neutral-900">{b.staff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>วันนัดหมาย:</span>
                        <span className="text-neutral-900">{b.date} ({b.time} น.)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ผู้จอง:</span>
                        <span className="text-neutral-900">{b.name} ({b.phone || "ไม่มีเบอร์"})</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed pt-2 font-black text-sm text-primary">
                        <span>ราคาบริการ:</span>
                        <span>฿{b.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setActiveTab("book")
                setStep(0)
              }}
              className="mt-4 px-6 py-3 border-2 border-outline-variant bg-surface text-neutral-700 hover:bg-neutral-50 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#c7d2fe] max-w-max"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าจองคิวใหม่
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
