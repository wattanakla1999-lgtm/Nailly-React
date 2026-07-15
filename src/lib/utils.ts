import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTimeSlots(openTime: string, closeTime: string): string[] {
  if (!openTime || !closeTime) {
    return ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
  }

  const slots: string[] = []
  try {
    const [openHour] = openTime.split(":").map(Number)
    const [closeHour] = closeTime.split(":").map(Number)

    if (openHour >= closeHour) {
      return ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
    }

    for (let hour = openHour; hour < closeHour; hour++) {
      const hh = String(hour).padStart(2, "0")
      slots.push(`${hh}:00`)
    }
  } catch (e) {
    console.error("Failed to generate time slots", e)
    return ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
  }

  return slots
}
