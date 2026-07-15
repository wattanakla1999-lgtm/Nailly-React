import { useState, useEffect } from "react"
import { Save, ToggleLeft, ToggleRight, Clock, AlertTriangle } from "lucide-react"
import { Y2KModal } from "@/components/Y2KModal"
import { fetchSettings, updateSettings } from "@/services/settingService"
import { cn } from "@/lib/utils"

export function SettingsPage() {
  const [shopStatus, setShopStatus] = useState<"open" | "closed">("open")
  const [openTime, setOpenTime] = useState("10:00")
  const [closeTime, setCloseTime] = useState("20:00")
  const [shopPhone, setShopPhone] = useState("02-123-4567")
  const [showModal, setShowModal] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    void fetchSettings().then((data) => {
      setShopStatus(data.shopStatus)
      setOpenTime(data.openTime)
      setCloseTime(data.closeTime)
      setShopPhone(data.shopPhone)
      setIsOffline(!!data.isOffline)
      setIsPageLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSettings({
        shopStatus,
        openTime,
        closeTime,
        shopPhone,
      })
      setIsOffline(!!result.isOffline)
      setShowModal(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
          <p className="text-xs text-neutral-400 font-bold">กำลังโหลดข้อมูลตั้งค่า...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black text-on-surface flex items-baseline gap-3 tracking-tight">
          ตั้งค่าร้านค้า
          <span className="text-xl text-outline font-normal">Settings</span>
        </h1>
        <p className="text-xs text-neutral-500 font-semibold mt-1">ตั้งค่าเปิด-ปิดให้บริการ และรายละเอียดต่างๆ ของร้าน</p>
      </div>

      {isOffline && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800">
          ⚠️ กำลังแสดงข้อมูลแบบออฟไลน์ (เชื่อมต่อเซิร์ฟเวอร์ไม่ได้)
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-2 bg-white border-3 border-primary rounded-3xl shadow-[6px_6px_0px_#FB923C] p-6 space-y-6">
          {/* Status Section */}
          <div className="border-b-2 border-outline-variant/60 pb-6 space-y-3">
            <h3 className="text-sm font-black text-primary uppercase tracking-wider flex items-center gap-2">
              🚥 สถานะเปิด-ปิดร้านค้า
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-outline-variant bg-neutral-50">
              <div>
                <p className="font-bold text-sm text-neutral-800">
                  {shopStatus === "open" ? "🟢 ขณะนี้ร้านเปิดให้บริการ" : "🔴 ขณะนี้ร้านปิดบริการชั่วคราว"}
                </p>
                <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                  {shopStatus === "open" 
                    ? "ลูกค้าภายนอกสามารถเข้ามาเลือกสเต็ปจองคิวออนไลน์ได้ตามปกติ" 
                    : "ลูกค้าจะไม่สามารถจองคิวได้ และหน้าแรกจะแสดงป้ายร้านปิดชั่วคราว"}
                </p>
              </div>

              <button
                onClick={() => setShopStatus(prev => prev === "open" ? "closed" : "open")}
                className="transition-all hover:scale-105 active:scale-95"
              >
                {shopStatus === "open" ? (
                  <ToggleRight className="h-12 w-12 text-primary stroke-[1.5]" />
                ) : (
                  <ToggleLeft className="h-12 w-12 text-neutral-400 stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-primary uppercase tracking-wider flex items-center gap-2">
              ⏰ เวลาทำการและข้อมูลติดต่อ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เวลาเปิดร้าน</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เวลาปิดร้าน</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เบอร์โทรศัพท์ของร้าน</label>
                <input
                  type="text"
                  value={shopPhone}
                  onChange={(e) => setShopPhone(e.target.value)}
                  placeholder="เช่น 02-123-4567"
                  maxLength={20}
                  className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t-2 border-outline-variant/60 pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold border-2 border-on-surface shadow-[4px_4px_0px_0px_#1e1b4b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e1b4b] active:scale-95 transition-all flex items-center gap-2 text-xs",
                isSaving && "opacity-80 cursor-not-allowed"
              )}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </button>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="bg-white border-3 border-on-surface rounded-3xl shadow-[6px_6px_0px_#818CF8] p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2.5 text-amber-500">
            <AlertTriangle className="h-5 w-5 fill-amber-100" />
            <h4 className="font-black text-sm text-neutral-800">คำเตือนสำหรับผู้ดูแลระบบ</h4>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-500 font-semibold">
            หากเปลี่ยนสถานะร้านค้าเป็น <strong className="text-red-500 font-black">ปิดบริการชั่วคราว</strong> ลูกค้าภายนอกจะไม่สามารถกดเริ่มจองคิวใหม่ได้ จนกว่าคุณจะเปลี่ยนสถานะกลับมาเป็น <strong className="text-emerald-500 font-black">เปิดให้บริการ</strong> อีกครั้ง
          </p>
        </div>
      </div>

      {/* Success Modal */}
      <Y2KModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="บันทึกการตั้งค่าสำเร็จ"
        footer={
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-2 px-5 font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            ตกลง
          </button>
        }
      >
        <div className="text-center py-4 space-y-3">
          <div className="text-5xl">💾</div>
          <p className="text-sm font-black text-neutral-800">ระบบได้ทำการบันทึกข้อมูลเวลาทำการ และสถานะเปิด-ปิดร้านค้าลงเครื่องสำเร็จแล้ว!</p>
        </div>
      </Y2KModal>
    </div>
  )
}
