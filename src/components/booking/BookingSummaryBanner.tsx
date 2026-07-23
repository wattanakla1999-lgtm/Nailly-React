import { useTranslation } from "@/hooks/useTranslation"
import type { Service, Staff } from "@/types"

interface BookingSummaryBannerProps {
  selectedService: Service | null
  selectedStaff: Staff | null
  selectedDate: string
  selectedTime: string
}

export function BookingSummaryBanner({
  selectedService,
  selectedStaff,
  selectedDate,
  selectedTime,
}: BookingSummaryBannerProps) {
  const { t } = useTranslation()

  return (
    <div className="hidden md:flex md:w-80 bg-gradient-to-br from-primary to-secondary p-8 text-white flex-col justify-between border-r-4 border-on-surface relative shrink-0">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="relative space-y-4">
        <span className="text-4xl">✨</span>
        <h2 className="text-2xl font-black tracking-tight">Nailly Salon</h2>
        <p className="text-xs font-semibold leading-relaxed text-indigo-50">
          {t("booking.banner.description", "ดูแลเล็บของคุณด้วยทีมงานมืออาชีพและสีเจลนำเข้าคุณภาพสูง สะอาด ปลอดภัย 100%")}
        </p>
      </div>

      {selectedService && (
        <div className="relative mt-8 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 space-y-2 text-xs font-semibold">
          <p className="font-bold border-b border-white/20 pb-1.5 mb-1.5 text-secondary">
            {t("booking.banner.selected", "รายการที่เลือก")}
          </p>
          <p className="flex justify-between gap-2">
            <span>{t("booking.banner.service", "บริการ:")}</span> <span className="truncate max-w-[120px]">{selectedService.nameTh || selectedService.name}</span>
          </p>
          {selectedStaff && (
            <p className="flex justify-between gap-2">
              <span>{t("booking.banner.staff", "ช่าง:")}</span> <span className="truncate max-w-[120px]">{selectedStaff.name}</span>
            </p>
          )}
          {selectedDate && (
            <p className="flex justify-between gap-2">
              <span>{t("booking.banner.date", "วันที่:")}</span> <span>{selectedDate}</span>
            </p>
          )}
          {selectedTime && (
            <p className="flex justify-between gap-2">
              <span>{t("booking.banner.time", "เวลา:")}</span> <span>{selectedTime}</span>
            </p>
          )}
          <p className="flex justify-between border-t border-dashed border-white/20 pt-2 font-black text-sm text-white">
            <span>{t("booking.banner.total", "ราคารวม:")}</span> <span>฿{selectedService.price}</span>
          </p>
        </div>
      )}

      <p className="relative mt-8 text-[10px] text-indigo-100 font-bold uppercase tracking-wider">
        {t("booking.banner.location", "📍 ซอยประเสริฐมนูกิจ · เปิด 10:00 - 20:00 น.")}
      </p>
    </div>
  )
}
