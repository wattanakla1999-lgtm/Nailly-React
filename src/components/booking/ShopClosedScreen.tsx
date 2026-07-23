import { useTranslation } from "@/hooks/useTranslation"

interface ShopClosedScreenProps {
  phone?: string | null
}

export function ShopClosedScreen({ phone }: ShopClosedScreenProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full flex-grow bg-white flex flex-col items-center justify-center text-center p-8 space-y-6 min-h-[calc(100vh-80px)]">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 border-3 border-red-500 shadow-[4px_4px_0px_#ef4444] text-4xl animate-pulse">
        🚪
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-red-500 tracking-tighter">{t("booking.closed.title", "ขออภัย ร้านปิดให้บริการชั่วคราว")}</h1>
        <p className="text-sm font-semibold text-neutral-500 max-w-md mx-auto">
          {t("booking.closed.description", "ขณะนี้ทางร้านปรับปรุงหรือปิดให้บริการชั่วคราวค่ะ ขออภัยในความไม่สะดวกเป็นอย่างสูง คุณสามารถตรวจสอบประวัติคิวจองของคุณได้ทางเมนู \"การจองของฉัน\" ด้านบนค่ะ")}
        </p>
      </div>
      {phone && (
        <div className="text-xs font-bold text-neutral-700 bg-neutral-100 px-5 py-3 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_#1e1b4b]">
          📞 {t("booking.closed.phone", "โทรสอบถาม:")} {phone}
        </div>
      )}
    </div>
  )
}
