import { translate } from "@/lib/i18n"
import { useLanguage } from "@/hooks/useLanguage"

export function useTranslation() {
  const { language } = useLanguage()

  return {
    language,
    t: (key: string, fallback: string) => translate(key, language, fallback),
  }
}
