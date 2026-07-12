import type { AppStatus } from "@/types"

interface AppointmentRowProps {
  name: string
  service: string
  time: string
  status: AppStatus
  avatarText?: string
  imgUrl?: string
}

const STATUS_CONFIG: Record<string, { label: string; styles: string }> = {
  active: {
    label: "กำลังรับบริการ",
    styles: "bg-tertiary-container text-tertiary border-tertiary shadow-[2px_2px_0px_#a78bfa]",
  },
  pending: {
    label: "รอยืนยัน",
    styles: "bg-surface-variant text-on-surface-variant border-outline-variant shadow-[2px_2px_0px_#c7d2fe]",
  },
  confirmed: {
    label: "ยืนยันแล้ว",
    styles: "bg-primary-container text-primary border-primary shadow-[2px_2px_0px_#818CF8]",
  },
  done: {
    label: "เสร็จสิ้น",
    styles: "bg-neutral-100 text-neutral-500 border-neutral-300 shadow-[2px_2px_0px_#d4d4d8]",
  },
  cancelled: {
    label: "ยกเลิกแล้ว",
    styles: "bg-red-100 text-red-600 border-red-300 shadow-[2px_2px_0px_#fca5a5]",
  },
}

export function AppointmentRow({ name, service, time, status, avatarText, imgUrl }: AppointmentRowProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-surface-variant/40 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-outline-variant group">
      {imgUrl ? (
        <img
          alt={name}
          className="w-14 h-14 rounded-xl object-cover shrink-0 border-2 border-primary shadow-[2px_2px_0px_#818CF8]"
          src={imgUrl}
        />
      ) : (
        <div className="w-14 h-14 rounded-xl shrink-0 border-2 border-primary shadow-[2px_2px_0px_#818CF8] flex items-center justify-center bg-primary-container text-primary font-black text-xl">
          {avatarText || name.charAt(0)}
        </div>
      )}
      <div className="flex-grow min-w-0">
        <h4 className="font-bold text-base sm:text-lg text-on-surface truncate">{name}</h4>
        <p className="font-medium text-xs text-on-surface-variant truncate mt-0.5">{service}</p>
      </div>
      <div className="text-right shrink-0 flex flex-col items-end">
        <p className="font-black text-base sm:text-lg text-on-surface">{time} น.</p>
        <span className={`inline-block mt-2 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg border-2 uppercase ${config.styles}`}>
          {config.label}
        </span>
      </div>
    </div>
  )
}
