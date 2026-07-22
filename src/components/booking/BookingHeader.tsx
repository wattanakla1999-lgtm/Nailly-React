import { Calendar, History } from "lucide-react"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { cn } from "@/lib/utils"

interface BookingHeaderProps {
  activeTab: "book" | "my-bookings"
  setActiveTab: (tab: "book" | "my-bookings") => void
  setStep: (step: number) => void
}

export function BookingHeader({ activeTab, setActiveTab, setStep }: BookingHeaderProps) {
  return (
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
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex shadow-none" />
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
      <div className="flex justify-end px-6 pb-3 sm:hidden">
        <LanguageSwitcher className="shadow-none" />
      </div>
    </header>
  )
}
