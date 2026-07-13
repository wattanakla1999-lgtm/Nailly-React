import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  className?: string
}

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

function toDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "เลือกวันที่",
  disabled = false,
  allowClear = true,
  className,
}: DatePickerProps) {
  const selectedDate = parseDate(value)
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate || new Date())
  const todayValue = toDateValue(new Date())

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return [
      ...Array.from<null>({ length: firstWeekday }).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ]
  }, [visibleMonth])

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
    : ""

  const chooseDate = (date: Date) => {
    onChange(toDateValue(date))
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setVisibleMonth(selectedDate || new Date())
          setOpen(true)
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border-2 border-outline-variant bg-surface px-3 text-left text-xs font-bold outline-none transition-colors hover:border-primary/60 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className={cn("truncate", !displayValue && "text-outline")}>{displayValue || placeholder}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
      </button>

      {open && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
          className="fixed inset-0 z-[140] flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm"
        >
          <div role="dialog" aria-modal="true" aria-label="เลือกวันที่" className="w-full max-w-xs rounded-2xl border-3 border-on-surface bg-white p-4 shadow-[6px_6px_0px_#FB923C]">
            <div className="mb-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                aria-label="เดือนก่อนหน้า"
                title="เดือนก่อนหน้า"
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-outline-variant hover:border-primary hover:bg-primary-container"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-black text-on-surface">
                {visibleMonth.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
              </p>
              <button
                type="button"
                onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                aria-label="เดือนถัดไป"
                title="เดือนถัดไป"
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-outline-variant hover:border-primary hover:bg-primary-container"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className="flex h-7 items-center justify-center text-[10px] font-black text-outline">
                  {weekday}
                </span>
              ))}
              {days.map((date, index) => {
                if (!date) return <span key={`empty-${index}`} className="h-8" />

                const dateValue = toDateValue(date)
                const selected = dateValue === value
                const today = dateValue === todayValue
                const unavailable = Boolean((min && dateValue < min) || (max && dateValue > max))

                return (
                  <button
                    key={dateValue}
                    type="button"
                    disabled={unavailable}
                    onClick={() => chooseDate(date)}
                    className={cn(
                      "flex h-8 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-transparent text-on-surface hover:border-primary hover:bg-primary-container",
                      today && !selected && "border-secondary text-secondary",
                      unavailable && "cursor-not-allowed text-neutral-300 hover:border-transparent hover:bg-transparent"
                    )}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-3">
              {allowClear ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("")
                    setOpen(false)
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" /> ล้างค่า
                </button>
              ) : <span />}
              <button
                type="button"
                disabled={Boolean((min && todayValue < min) || (max && todayValue > max))}
                onClick={() => chooseDate(new Date())}
                className="rounded-lg bg-primary-container px-3 py-1.5 text-[10px] font-black text-primary hover:bg-primary/15 disabled:opacity-40"
              >
                วันนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
