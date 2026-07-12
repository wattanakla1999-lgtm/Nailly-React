
interface LoadingPopupProps {
  isOpen: boolean
  message?: string
}

export function LoadingPopup({ isOpen, message = "กำลังโหลด..." }: LoadingPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-64 bg-white border-3 border-on-surface rounded-3xl shadow-[6px_6px_0px_#FB923C] p-6 flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary animate-spin" />
          {/* Inner pulsating icon */}
        </div>
        <div className="text-center">
          <p className="font-black text-sm text-primary tracking-tight">{message}</p>
          <p className="text-[10px] text-neutral-400 font-semibold mt-1">กรุณารอสักครู่</p>
        </div>
      </div>
    </div>
  )
}
