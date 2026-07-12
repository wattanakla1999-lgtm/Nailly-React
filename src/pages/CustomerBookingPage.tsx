import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { BookingHeader } from "@/components/booking/BookingHeader"
import { BookingSummaryBanner } from "@/components/booking/BookingSummaryBanner"
import { ShopClosedScreen } from "@/components/booking/ShopClosedScreen"
import { MyBookingsScreen } from "@/components/booking/MyBookingsScreen"
import { LoadingPopup } from "@/components/LoadingPopup"
import {
  GreetingStep,
  ServiceSelectionStep,
  StaffSelectionStep,
  DateTimeStep,
  ContactDetailStep,
  SuccessStep,
} from "@/components/booking/BookingSteps"
import type { Service, Staff, Appointment } from "@/types"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  { id: "1", name: "เมนิเกียร์คลาสสิก", nameTh: "เมนิเกียร์คลาสสิก", price: 250, duration: 45, img: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400", category: "manicure" },
  { id: "2", name: "เจลเมนิเกียร์", nameTh: "เจลเมนิเกียร์", price: 550, duration: 75, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400", category: "manicure" },
  { id: "3", name: "เฟรนช์เมนิเกียร์", nameTh: "เฟรนช์เมนิเกียร์", price: 450, duration: 60, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400", category: "manicure" },
  { id: "4", name: "เพนท์ลวดลาย", nameTh: "เพนท์ลวดลาย", price: 150, duration: 30, img: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400", category: "art" },
  { id: "5", name: "เพนท์ลายพรีเมียม", nameTh: "เพนท์ลายพรีเมียม", price: 800, duration: 120, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400", category: "art" },
  { id: "6", name: "ต่อเล็บ PVC/เจล", nameTh: "ต่อเล็บ PVC/เจล", price: 900, duration: 120, img: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400", category: "extension" },
  { id: "7", name: "เพดิเกียร์คลาสสิก", nameTh: "เพดิเกียร์คลาสสิก", price: 350, duration: 60, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400", category: "pedicure" },
  { id: "8", name: "เจลเพดิเกียร์", nameTh: "เจลเพดิเกียร์", price: 480, duration: 75, img: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400", category: "pedicure" },
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
  active: { label: "กำลังรับบริการ", class: "bg-tertiary-container text-tertiary border-tertiary" },
  cancelled: { label: "ยกเลิกแล้ว", class: "bg-red-100 text-red-600 border-red-300" },
}

export function CustomerBookingPage() {
  const [activeTab, setActiveTab] = useState<"book" | "my-bookings">("book")
  const [step, setStep] = useState(0) // 0: Greeting, 1: Service, 2: Staff, 3: Date/Time, 4: Contact, 5: Success
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    loadBookings()
    const status = localStorage.getItem("nailly_shop_status") || "open"
    setIsShopOpen(status === "open")

    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setLoading(true)

    const newApt: Appointment = {
      name: customerName,
      customerName: customerName,
      phone: customerPhone,
      service: selectedService?.nameTh || selectedService?.name || "สปาเล็บ",
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

    setTimeout(() => {
      setLoading(false)
      nextStep()
    }, 600)
  }

  // Filter bookings based on phone input
  const filteredBookings = myBookings.filter((b) => {
    if (!searchPhone) return true // Show all by default
    if (!b || !b.phone) return false // Prevent crashes if phone is missing
    return b.phone.replace(/[^0-9]/g, "").includes(searchPhone.replace(/[^0-9]/g, ""))
  })

  const todayDateString = new Date().toISOString().split("T")[0]
  const shopPhone = localStorage.getItem("nailly_shop_phone")

  return (
    <div className="min-h-screen bg-mesh text-on-surface flex flex-col">
      <LoadingPopup isOpen={loading} message="กำลังดำเนินการ..." />

      {/* ── Immersive Sticky Header ── */}
      <BookingHeader activeTab={activeTab} setActiveTab={setActiveTab} setStep={setStep} />

      {/* ── Full Screen Immersive Layout ── */}
      <main className="flex-grow flex flex-col w-full bg-white">
        {activeTab === "book" ? (
          !isShopOpen ? (
            /* ── SHOP CLOSED SCREEN ── */
            <ShopClosedScreen phone={shopPhone} />
          ) : (
            /* ── STEPPED BOOKING FLOW ── */
            <div className="w-full flex-grow flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
              {/* Left Brand Area (Responsive Side Banner) */}
              <BookingSummaryBanner
                selectedService={selectedService}
                selectedStaff={selectedStaff}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />

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
                  {step === 0 && <GreetingStep onNext={nextStep} />}

                  {/* STEP 1: SELECT SERVICE */}
                  {step === 1 && (
                    <ServiceSelectionStep
                      services={SERVICES}
                      selectedService={selectedService}
                      onSelectService={setSelectedService}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 2: SELECT STAFF */}
                  {step === 2 && (
                    <StaffSelectionStep
                      staffs={STAFFS}
                      selectedStaff={selectedStaff}
                      onSelectStaff={setSelectedStaff}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 3: DATE & TIME SELECT */}
                  {step === 3 && (
                    <DateTimeStep
                      timeSlots={TIME_SLOTS}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onChangeDate={setSelectedDate}
                      onChangeTime={setSelectedTime}
                      todayDateString={todayDateString}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 4: CONTACT DETAIL FORM */}
                  {step === 4 && (
                    <ContactDetailStep
                      customerName={customerName}
                      customerPhone={customerPhone}
                      customerNote={customerNote}
                      onChangeName={setCustomerName}
                      onChangePhone={setCustomerPhone}
                      onChangeNote={setCustomerNote}
                      onSubmit={handleBookingSubmit}
                    />
                  )}

                  {/* STEP 5: SUCCESS CONFIRMATION SCREEN */}
                  {step === 5 && (
                    <SuccessStep
                      customerName={customerName}
                      customerPhone={customerPhone}
                      selectedService={selectedService}
                      selectedStaff={selectedStaff}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onViewMyBookings={() => setActiveTab("my-bookings")}
                      onReset={() => {
                        setSelectedService(null)
                        setSelectedStaff(null)
                        setSelectedDate("")
                        setSelectedTime("")
                        setCustomerName("")
                        setCustomerPhone("")
                        setCustomerNote("")
                        setStep(0)
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* ── MY BOOKINGS SCREEN ── */
          <MyBookingsScreen
            searchPhone={searchPhone}
            onChangeSearchPhone={setSearchPhone}
            filteredBookings={filteredBookings}
            statusMap={STATUS_MAP}
            onBackToBooking={() => {
              setActiveTab("book")
              setStep(0)
            }}
          />
        )}
      </main>
    </div>
  )
}
