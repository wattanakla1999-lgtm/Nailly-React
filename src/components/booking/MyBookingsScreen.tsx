import { Phone, History, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/types"

interface MyBookingsScreenProps {
  searchPhone: string
  onChangeSearchPhone: (phone: string) => void
  filteredBookings: Appointment[]
  statusMap: Record<string, { label: string; class: string }>
  onBackToBooking: () => void
}

export function MyBookingsScreen({
  searchPhone,
  onChangeSearchPhone,
  filteredBookings,
  statusMap,
  onBackToBooking,
}: MyBookingsScreenProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full flex-grow bg-white p-6 sm:p-12 space-y-6 min-h-[calc(100vh-80px)]">
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">{t("booking.history.title", "ดูการจองของฉัน")}</h2>
        <p className="text-xs text-neutral-400 font-semibold mt-1">{t("booking.history.subtitle", "ระบุเบอร์โทรศัพท์ที่คุณใช้ทำการจองคิว")}</p>
      </div>

      {/* Filter Search Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow max-w-md">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5" />
          <input
            type="text"
            placeholder={t("booking.history.placeholder", "ใส่เบอร์โทรศัพท์เพื่อค้นหาคิวจอง...")}
            value={searchPhone}
            onChange={(e) => onChangeSearchPhone(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={20}
            className="w-full h-12 pl-12 pr-4 bg-surface border-2 border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-bold text-sm outline-none placeholder:text-outline-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
          />
        </div>
        {searchPhone && (
          <button
            onClick={() => onChangeSearchPhone("")}
            className="h-12 px-5 bg-surface border-2 border-outline-variant rounded-xl text-xs font-bold hover:bg-neutral-50 shadow-[2px_2px_0px_#c7d2fe]"
          >
            {t("booking.history.clear", "ล้างคำค้นหา")}
          </button>
        )}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="py-16 text-center text-neutral-400 border-2 border-dashed border-outline-variant rounded-2xl">
          <History className="mx-auto mb-3 h-12 w-12 opacity-30 text-primary" />
          <p className="font-bold text-sm">{t("booking.history.emptyTitle", "ไม่พบประวัติคิวจองสำหรับเบอร์โทรนี้")}</p>
          <p className="text-[10px] mt-1">{t("booking.history.emptySubtitle", "กรุณาลองกรอกเบอร์โทรใหม่อีกครั้ง หรือกลับไปทำรายการจองใหม่ค่ะ")}</p>
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
                <span className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wide border-2", statusMap[b.status]?.class || statusMap.pending.class)}>
                  {statusMap[b.status]?.label || t("booking.history.statusPending", "รอยืนยัน")}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-700 font-bold border-t border-dashed border-outline-variant/60 pt-3">
                <div className="flex justify-between">
                  <span>{t("booking.history.staff", "ช่างผู้ให้บริการ:")}</span>
                  <span className="text-neutral-900">{b.staff}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("booking.history.date", "วันนัดหมาย:")}</span>
                  <span className="text-neutral-900">{b.date} ({b.time})</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("booking.history.customer", "ผู้จอง:")}</span>
                  <span className="text-neutral-900">{b.name || b.customerName} ({b.phone || t("booking.history.noPhone", "ไม่มีเบอร์")})</span>
                </div>
                <div className="flex justify-between border-t border-dashed pt-2 font-black text-sm text-primary">
                  <span>{t("booking.history.price", "ราคาบริการ:")}</span>
                  <span>฿{b.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBackToBooking}
        className="mt-4 px-6 py-3 border-2 border-outline-variant bg-surface text-neutral-700 hover:bg-neutral-50 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#c7d2fe] max-w-max"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("booking.history.back", "กลับไปหน้าจองคิวใหม่")}
      </button>
    </div>
  )
}
