import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DropdownOption<T extends string = string> {
  value: T
  label: string
}

interface DropdownProps<T extends string = string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  placement?: "bottom" | "top"
  className?: string
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  placeholder = "เลือกข้อมูล",
  disabled = false,
  placement = "bottom",
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selectedOption = options[selectedIndex]

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const openMenu = () => {
    if (disabled) return
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  const selectOption = (index: number) => {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === "Escape") {
      setOpen(false)
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }

      const direction = event.key === "ArrowDown" ? 1 : -1
      setHighlightedIndex((current) => (current + direction + options.length) % options.length)
      return
    }

    if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault()
      selectOption(highlightedIndex)
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border-2 border-outline-variant bg-surface px-3 text-left text-xs font-bold text-on-surface outline-none transition-colors hover:border-primary/60 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={cn("truncate", !selectedOption && "text-outline")}>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-outline transition-transform", open && "rotate-180 text-primary")} />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 z-[120] max-h-56 w-full overflow-y-auto rounded-xl border-2 border-on-surface bg-white p-1.5 shadow-[4px_4px_0px_#FB923C]",
            placement === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5"
          )}
        >
          {options.map((option, index) => {
            const selected = option.value === value
            const highlighted = index === highlightedIndex

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectOption(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors",
                  highlighted && "bg-primary-container",
                  selected ? "text-primary" : "text-on-surface"
                )}
              >
                <span className="truncate">{option.label}</span>
                {selected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
