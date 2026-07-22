import { SUPPORTED_LANGUAGES } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/useLanguage"

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn("inline-flex rounded-xl border-2 border-outline-variant bg-white p-0.5 shadow-[2px_2px_0px_#c7d2fe]", className)}
    >
      {SUPPORTED_LANGUAGES.map((item) => {
        const isActive = language === item.code

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            aria-pressed={isActive}
            className={cn(
              "h-8 min-w-9 rounded-lg px-2 text-[10px] font-black transition-all",
              isActive
                ? "bg-primary text-white shadow-[1px_1px_0px_#1e1b4b]"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-primary"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
