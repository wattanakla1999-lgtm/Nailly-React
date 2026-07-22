import type { Service, Staff } from "@/types"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export interface BookingDraft {
  services: Service[]
  staffs: Staff[]
  timeSlots: string[]
  busySlots: string[]
  selectedService: Service | null
  selectedStaff: Staff | null
  selectedDate: string
  selectedTime: string
  customerName: string
  customerPhone: string
  customerNote?: string
  allowPast?: boolean
}

export interface ValidBookingDraft {
  service: Service
  staff: Staff
  startAt: string
  customerName: string
  customerPhone: string
  note?: string
}

export function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "")
}

function isValidDateValue(value: string) {
  if (!DATE_PATTERN.test(value)) return false

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function isPositiveIntegerId(value: string) {
  const numberValue = Number(value)
  return Number.isInteger(numberValue) && numberValue > 0
}

export function isValidTimeValue(value: string) {
  return TIME_PATTERN.test(value)
}

export function buildBangkokStartAt(date: string, time: string) {
  return `${date}T${time}:00+07:00`
}

export function validateBookingDraft(draft: BookingDraft) {
  const errors: string[] = []
  const customerName = draft.customerName.trim()
  const customerPhone = normalizePhone(draft.customerPhone)
  const note = draft.customerNote?.trim()
  const today = getLocalDateValue()

  const service = draft.selectedService
    ? draft.services.find((item) => item.id === draft.selectedService?.id)
    : undefined
  const staff = draft.selectedStaff
    ? draft.staffs.find((item) => item.id === draft.selectedStaff?.id)
    : undefined

  if (!service) errors.push("กรุณาเลือกบริการจากรายการของร้าน")
  if (service && !isPositiveIntegerId(service.id)) errors.push("รหัสบริการไม่ถูกต้อง")
  if (!staff) errors.push("กรุณาเลือกช่างจากรายการของร้าน")
  if (staff && staff.id !== "any" && !isPositiveIntegerId(staff.id)) errors.push("รหัสช่างไม่ถูกต้อง")

  if (!isValidDateValue(draft.selectedDate)) {
    errors.push("กรุณาเลือกวันที่ให้ถูกต้อง")
  } else if (!draft.allowPast && draft.selectedDate < today) {
    errors.push("ไม่สามารถจองย้อนหลังได้")
  }

  if (!isValidTimeValue(draft.selectedTime) || !draft.timeSlots.includes(draft.selectedTime)) {
    errors.push("กรุณาเลือกเวลาจากช่วงเวลาที่ร้านเปิดรับจอง")
  } else if (draft.busySlots.includes(draft.selectedTime)) {
    errors.push("ช่วงเวลานี้มีคิวแล้ว กรุณาเลือกเวลาใหม่")
  }

  if (!customerName) errors.push("กรุณากรอกชื่อผู้จอง")
  if (customerName.length > 100) errors.push("ชื่อผู้จองต้องไม่เกิน 100 ตัวอักษร")

  if (!customerPhone) {
    errors.push("กรุณากรอกเบอร์โทรศัพท์")
  } else if (customerPhone.length < 9 || customerPhone.length > 10) {
    errors.push("กรุณากรอกเบอร์โทรศัพท์ 9-10 หลัก")
  }

  if (note && note.length > 500) errors.push("หมายเหตุต้องไม่เกิน 500 ตัวอักษร")

  if (errors.length > 0 || !service || !staff) {
    return { ok: false as const, errors }
  }

  return {
    ok: true as const,
    value: {
      service,
      staff,
      startAt: buildBangkokStartAt(draft.selectedDate, draft.selectedTime),
      customerName,
      customerPhone,
      note: note || undefined,
    } satisfies ValidBookingDraft,
  }
}
