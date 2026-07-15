import api from "@/lib/api"

export interface ShopSettings {
  shopStatus: "open" | "closed"
  openTime: string
  closeTime: string
  shopPhone: string
  isOffline?: boolean
}

const STORAGE_KEYS = {
  status: "nailly_shop_status",
  open: "nailly_shop_open_time",
  close: "nailly_shop_close_time",
  phone: "nailly_shop_phone",
}

export async function fetchSettings(): Promise<ShopSettings> {
  try {
    const response = await api.get<ShopSettings>("/settings")
    const data = response.data
    
    // Sync with localStorage for client-side pages
    localStorage.setItem(STORAGE_KEYS.status, data.shopStatus)
    localStorage.setItem(STORAGE_KEYS.open, data.openTime)
    localStorage.setItem(STORAGE_KEYS.close, data.closeTime)
    localStorage.setItem(STORAGE_KEYS.phone, data.shopPhone)
    
    return { ...data, isOffline: false }
  } catch (error) {
    console.warn("Unable to fetch settings from API, falling back to localStorage.", error)
    return {
      shopStatus: (localStorage.getItem(STORAGE_KEYS.status) as "open" | "closed") || "open",
      openTime: localStorage.getItem(STORAGE_KEYS.open) || "10:00",
      closeTime: localStorage.getItem(STORAGE_KEYS.close) || "20:00",
      shopPhone: localStorage.getItem(STORAGE_KEYS.phone) || "02-123-4567",
      isOffline: true,
    }
  }
}

export async function updateSettings(settings: ShopSettings): Promise<ShopSettings> {
  // Sync locally first so changes reflect instantly offline
  localStorage.setItem(STORAGE_KEYS.status, settings.shopStatus)
  localStorage.setItem(STORAGE_KEYS.open, settings.openTime)
  localStorage.setItem(STORAGE_KEYS.close, settings.closeTime)
  localStorage.setItem(STORAGE_KEYS.phone, settings.shopPhone)

  try {
    const response = await api.put<ShopSettings>("/settings", settings)
    return { ...response.data, isOffline: false }
  } catch (error) {
    console.warn("Unable to save settings to API, saved locally.", error)
    return { ...settings, isOffline: true }
  }
}
