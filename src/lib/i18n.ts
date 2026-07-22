import type { Language } from "@/contexts/LanguageContext"

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: "th", label: "TH" },
  { code: "en", label: "EN" },
]

type TranslationMap = Record<string, Partial<Record<Language, string>>>

const translations: TranslationMap = {}

export function translate(key: string, language: Language, fallback: string) {
  return translations[key]?.[language] ?? fallback
}
