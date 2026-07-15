import { useState, useEffect, useMemo } from "react"
import { AlertCircle, ChevronLeft, RefreshCw } from "lucide-react"
import { BookingHeader } from "@/components/booking/BookingHeader"
import { BookingSummaryBanner } from "@/components/booking/BookingSummaryBanner"
import { ShopClosedScreen } from "@/components/booking/ShopClosedScreen"
import { MyBookingsScreen } from "@/components/booking/MyBookingsScreen"
import { LoadingPopup } from "@/components/LoadingPopup"
import { getApiErrorMessage } from "@/lib/apiError"
import { Y2KModal } from "@/components/Y2KModal"
import { generateTimeSlots } from "@/lib/utils"
import {
  GreetingStep,
  ServiceSelectionStep,
  StaffSelectionStep,
  DateTimeStep,
  ContactDetailStep,
  SuccessStep,
} from "@/components/booking/BookingSteps"
import { fetchServices } from "@/services/serviceService"
import { fetchTechnicians, type Technician } from "@/services/technicianService"
import { createBooking, fetchBookings, fetchBusySlots } from "@/services/bookingService"
import type { Service, Staff, Appointment } from "@/types"

const ANY_STAFF: Staff = {
  id: "any",
  name: "ใครก็ได้ (สุ่มช่าง)",
  role: "เลือกช่างที่ว่างเร็วที่สุด",
  img: "💅",
  rate: 0,
}

function mapTechnicianToStaff(technician: Technician): Staff {
  return {
    id: technician.id,
    name: technician.name,
    role: technician.specialties.join(", ") || technician.role,
    img: technician.profileImg || technician.name.trim().charAt(0) || "ช",
    rate: technician.rate,
  }
}



const STATUS_MAP = {
  pending: { label: "รอยืนยัน", class: "bg-secondary-container text-on-secondary-container border-secondary" },
  confirmed: { label: "ยืนยันแล้ว", class: "bg-primary-container text-primary border-primary" },
  done: { label: "เสร็จสิ้น", class: "bg-neutral-100 text-neutral-600 border-neutral-400" },
  active: { label: "กำลังรับบริการ", class: "bg-tertiary-container text-tertiary border-tertiary" },
  cancelled: { label: "ยกเลิกแล้ว", class: "bg-red-100 text-red-600 border-red-300" },
}

const todayDateString = new Date().toISOString().split("T")[0]

export function CustomerBookingPage() {
  const [activeTab, setActiveTab] = useState<"book" | "my-bookings">("book")
  const [step, setStep] = useState(0) // 0: Greeting, 1: Service, 2: Staff, 3: Date/Time, 4: Contact, 5: Success
  const [loading, setLoading] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogOffline, setCatalogOffline] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [staffs, setStaffs] = useState<Staff[]>([])

  // State values
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [selectedDate, setSelectedDate] = useState(todayDateString)
  const [selectedTime, setSelectedTime] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerNote, setCustomerNote] = useState("")

  // List of bookings from localStorage
  const [myBookings, setMyBookings] = useState<Appointment[]>([])
  const [searchPhone, setSearchPhone] = useState("")
  const [isShopOpen, setIsShopOpen] = useState(true)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [busySlots, setBusySlots] = useState<string[]>([])

  const timeSlots = useMemo(() => {
    const open = localStorage.getItem("nailly_shop_open_time") || "10:00"
    const close = localStorage.getItem("nailly_shop_close_time") || "20:00"
    return generateTimeSlots(open, close)
  }, [activeTab])

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  const loadBookingCatalog = async () => {
    setCatalogLoading(true)

    const [serviceResult, technicianResult] = await Promise.all([
      fetchServices({ page: 1, limit: 100 }),
      fetchTechnicians({ page: 1, limit: 100 }),
    ])

    setServices(serviceResult.services)
    setStaffs([
      ANY_STAFF,
      ...technicianResult.technicians
        .filter((technician) => technician.status === "active")
        .map(mapTechnicianToStaff),
    ])
    setCatalogOffline(serviceResult.isOffline || technicianResult.isOffline)
    setCatalogLoading(false)
  }

  // Fetch bookings on mount or when tab changes
  const loadBookings = async (phoneToSearch?: string) => {
    const queryPhone = phoneToSearch || searchPhone
    if (!queryPhone) {
      setMyBookings([])
      return
    }

    try {
      const result = await fetchBookings({
        page: 1,
        limit: 100,
        phone: queryPhone,
        status: "all",
      })
      setMyBookings(result.bookings)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    setLoading(true)
    const status = localStorage.getItem("nailly_shop_status") || "open"
    setIsShopOpen(status === "open")

    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    if (activeTab === "my-bookings" && searchPhone) {
      const timer = setTimeout(() => {
        void loadBookings(searchPhone)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchPhone, activeTab])

  useEffect(() => {
    void loadBookingCatalog()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const techId = selectedStaff && selectedStaff.id !== "any" ? Number(selectedStaff.id) : null
      const serviceId = selectedService ? Number(selectedService.id) : null
      void fetchBusySlots(selectedDate, techId, serviceId).then((slots) => {
        setBusySlots(slots)
      })
    } else {
      setBusySlots([])
    }
  }, [selectedDate, selectedStaff, selectedService])

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setLoading(true)

    try {
      const startAt = `${selectedDate}T${selectedTime}:00+07:00` // assume local Thai time offset

      await createBooking({
        userId: 1, // Mock user ID 1 for now (until LINE Login is integrated)
        serviceId: Number(selectedService?.id) || 0,
        technicianId: selectedStaff && selectedStaff.id !== "any" ? Number(selectedStaff.id) : null,
        startAt,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        note: customerNote.trim() || undefined,
      })

      // Set phone number to filter history easily later
      setSearchPhone(customerPhone)
      await loadBookings(customerPhone)

      setLoading(false)
      nextStep()
    } catch (error) {
      console.error("Unable to submit booking.", error)
      const errorMsg = getApiErrorMessage(error, "เกิดข้อผิดพลาดในการส่งข้อมูลการจองคิว กรุณาลองใหม่อีกครั้ง")
      setErrorMessage(errorMsg)
      setShowErrorModal(true)
      setLoading(false)
    }
  }

  // Filter bookings based on phone input
  const filteredBookings = myBookings.filter((b) => {
    if (!searchPhone) return true // Show all by default
    if (!b || !b.phone) return false // Prevent crashes if phone is missing
    return b.phone.replace(/[^0-9]/g, "").includes(searchPhone.replace(/[^0-9]/g, ""))
  })

  const shopPhone = localStorage.getItem("nailly_shop_phone")

  return (
    <div className="min-h-screen bg-mesh text-on-surface flex flex-col">
      <LoadingPopup
        isOpen={loading || catalogLoading}
        message={catalogLoading ? "กำลังโหลดบริการและช่าง..." : "กำลังดำเนินการ..."}
      />

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
                  {catalogOffline && step > 0 && step < 3 && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg border-2 border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="flex-1">โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่</span>
                      <button
                        type="button"
                        onClick={() => void loadBookingCatalog()}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-white"
                        title="ลองโหลดข้อมูลใหม่"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* STEP 0: GREETING SCREEN */}
                  {step === 0 && <GreetingStep onNext={nextStep} />}

                  {/* STEP 1: SELECT SERVICE */}
                  {step === 1 && (
                    <ServiceSelectionStep
                      services={services}
                      selectedService={selectedService}
                      onSelectService={setSelectedService}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 2: SELECT STAFF */}
                  {step === 2 && (
                    <StaffSelectionStep
                      staffs={staffs}
                      selectedStaff={selectedStaff}
                      onSelectStaff={setSelectedStaff}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 3: DATE & TIME SELECT */}
                  {step === 3 && (
                    <DateTimeStep
                      timeSlots={timeSlots}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onChangeDate={setSelectedDate}
                      onChangeTime={setSelectedTime}
                      todayDateString={todayDateString}
                      onNext={nextStep}
                      busySlots={busySlots}
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

      {/* ── ERROR MODAL ── */}
      <Y2KModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="เกิดข้อผิดพลาด"
        footer={
          <button
            onClick={() => setShowErrorModal(false)}
            className="h-10 rounded-xl border-2 border-on-surface bg-primary text-white font-bold px-6 hover:bg-primary/95 active:scale-95 transition-all text-xs shadow-[2px_2px_0px_#1e1b4b]"
          >
            ตกลง
          </button>
        }
      >
        <div className="flex flex-col items-center justify-center text-center p-2">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3 animate-bounce" />
          <p className="text-sm font-bold text-neutral-800 leading-relaxed">{errorMessage}</p>
        </div>
      </Y2KModal>
    </div>
  )
}
