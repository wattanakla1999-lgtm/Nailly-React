import { useState, useEffect, useMemo, useCallback } from "react"
import { AlertCircle, ChevronLeft, RefreshCw } from "lucide-react"
import { BookingHeader } from "@/components/booking/BookingHeader"
import { BookingSummaryBanner } from "@/components/booking/BookingSummaryBanner"
import { ShopClosedScreen } from "@/components/booking/ShopClosedScreen"
import { MyBookingsScreen } from "@/components/booking/MyBookingsScreen"
import { LoadingPopup } from "@/components/LoadingPopup"
import { getApiErrorMessage } from "@/lib/apiError"
import { Y2KModal } from "@/components/Y2KModal"
import { generateTimeSlots } from "@/lib/utils"
import { getLocalDateValue, normalizePhone, validateBookingDraft } from "@/lib/bookingValidation"
import { buildStaffOptions } from "@/lib/bookingOptions"
import {
  GreetingStep,
  ServiceSelectionStep,
  StaffSelectionStep,
  DateTimeStep,
  ContactDetailStep,
  SuccessStep,
} from "@/components/booking/BookingSteps"
import { fetchServices } from "@/services/serviceService"
import { fetchTechnicians } from "@/services/technicianService"
import { createBooking, fetchBookings, fetchBusySlotAvailability } from "@/services/bookingService"
import { fetchSettings, type ShopSettings } from "@/services/settingService"
import type { Service, Staff, Appointment } from "@/types"

const STATUS_MAP = {
  pending: { label: "รอยืนยัน", class: "bg-secondary-container text-on-secondary-container border-secondary" },
  confirmed: { label: "ยืนยันแล้ว", class: "bg-primary-container text-primary border-primary" },
  done: { label: "เสร็จสิ้น", class: "bg-neutral-100 text-neutral-600 border-neutral-400" },
  active: { label: "กำลังรับบริการ", class: "bg-tertiary-container text-tertiary border-tertiary" },
  cancelled: { label: "ยกเลิกแล้ว", class: "bg-red-100 text-red-600 border-red-300" },
}

const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shopStatus: "open",
  openTime: "10:00",
  closeTime: "20:00",
  shopPhone: "02-123-4567",
}

const todayDateString = getLocalDateValue()

export function CustomerBookingPage() {
  const [activeTab, setActiveTab] = useState<"book" | "my-bookings">("book")
  const [step, setStep] = useState(0) // 0: Greeting, 1: Service, 2: Staff, 3: Date/Time, 4: Contact, 5: Success
  const [loading, setLoading] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogOffline, setCatalogOffline] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SHOP_SETTINGS)
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
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [busySlots, setBusySlots] = useState<string[]>([])
  const [busySlotsLoading, setBusySlotsLoading] = useState(false)
  const [busySlotsOffline, setBusySlotsOffline] = useState(false)

  const timeSlots = useMemo(() => {
    return generateTimeSlots(shopSettings.openTime, shopSettings.closeTime)
  }, [shopSettings.closeTime, shopSettings.openTime])

  const isShopOpen = shopSettings.shopStatus === "open"

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  const showBookingError = (message: string) => {
    setErrorMessage(message)
    setShowErrorModal(true)
  }

  const loadBookingCatalog = async () => {
    setCatalogLoading(true)
    try {
      const [serviceResult, technicianResult] = await Promise.all([
        fetchServices({ page: 1, limit: 100 }),
        fetchTechnicians({ page: 1, limit: 100 }),
      ])

      setServices(serviceResult.services)
      setStaffs(buildStaffOptions(technicianResult.technicians))
      setCatalogOffline(serviceResult.isOffline || technicianResult.isOffline)
    } finally {
      setCatalogLoading(false)
    }
  }

  const loadShopSettings = async () => {
    setSettingsLoading(true)
    try {
      const settings = await fetchSettings()
      setShopSettings(settings)
    } finally {
      setSettingsLoading(false)
    }
  }

  // Fetch bookings on mount or when tab changes
  const loadBookings = useCallback(async (phoneToSearch?: string) => {
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
  }, [searchPhone])

  useEffect(() => {
    setLoading(true)
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
  }, [searchPhone, activeTab, loadBookings])

  useEffect(() => {
    void loadBookingCatalog()
    void loadShopSettings()
  }, [])

  useEffect(() => {
    if (!selectedDate) {
      setBusySlots([])
      setBusySlotsLoading(false)
      setBusySlotsOffline(false)
      return
    }

    let cancelled = false
    const techId = selectedStaff && selectedStaff.id !== "any" ? Number(selectedStaff.id) : null
    const serviceId = selectedService ? Number(selectedService.id) : null

    setBusySlotsLoading(true)
    setBusySlotsOffline(false)

    void fetchBusySlotAvailability(selectedDate, techId, serviceId)
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
  }, [selectedDate, selectedStaff, selectedService])

  useEffect(() => {
    if (selectedTime && (busySlots.includes(selectedTime) || !timeSlots.includes(selectedTime))) {
      setSelectedTime("")
    }
  }, [busySlots, selectedTime, timeSlots])

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (catalogLoading || settingsLoading || busySlotsLoading) {
      showBookingError("ระบบกำลังตรวจสอบข้อมูลการจอง กรุณารอสักครู่แล้วลองอีกครั้ง")
      return
    }

    if (!isShopOpen) {
      showBookingError("ขณะนี้ร้านปิดรับจองคิวออนไลน์")
      return
    }

    if (catalogOffline) {
      showBookingError("ยังโหลดรายการบริการหรือช่างจากเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
      return
    }

    if (busySlotsOffline) {
      showBookingError("ยังตรวจสอบเวลาว่างจากเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
      return
    }

    const validation = validateBookingDraft({
      services,
      staffs,
      timeSlots,
      busySlots,
      selectedService,
      selectedStaff,
      selectedDate,
      selectedTime,
      customerName,
      customerPhone,
      customerNote,
    })

    if (!validation.ok) {
      showBookingError(validation.errors.join(" / "))
      return
    }

    setLoading(true)

    try {
      await createBooking({
        userId: null,
        serviceId: Number(validation.value.service.id),
        technicianId: validation.value.staff.id !== "any" ? Number(validation.value.staff.id) : null,
        startAt: validation.value.startAt,
        customerName: validation.value.customerName,
        customerPhone: validation.value.customerPhone,
        note: validation.value.note,
      })

      // Set phone number to filter history easily later
      setSearchPhone(validation.value.customerPhone)
      await loadBookings(validation.value.customerPhone)

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
    return normalizePhone(b.phone).includes(normalizePhone(searchPhone))
  })

  const shopPhone = shopSettings.shopPhone

  return (
    <div className="min-h-screen bg-mesh text-on-surface flex flex-col">
      <LoadingPopup
        isOpen={loading || catalogLoading || settingsLoading}
        message={catalogLoading ? "กำลังโหลดบริการและช่าง..." : settingsLoading ? "กำลังโหลดข้อมูลร้าน..." : "กำลังดำเนินการ..."}
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
                      onSelectService={(service) => {
                        setSelectedService(service)
                        setSelectedTime("")
                      }}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 2: SELECT STAFF */}
                  {step === 2 && (
                    <StaffSelectionStep
                      staffs={staffs}
                      selectedStaff={selectedStaff}
                      onSelectStaff={(staff) => {
                        setSelectedStaff(staff)
                        setSelectedTime("")
                      }}
                      onNext={nextStep}
                    />
                  )}

                  {/* STEP 3: DATE & TIME SELECT */}
                  {step === 3 && (
                    <DateTimeStep
                      timeSlots={timeSlots}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onChangeDate={(date) => {
                        setSelectedDate(date)
                        setSelectedTime("")
                      }}
                      onChangeTime={setSelectedTime}
                      todayDateString={todayDateString}
                      onNext={nextStep}
                      busySlots={busySlots}
                      busySlotsLoading={busySlotsLoading}
                      busySlotsOffline={busySlotsOffline}
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
                        setSelectedDate(todayDateString)
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
