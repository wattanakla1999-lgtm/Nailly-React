import api from "@/lib/api"
import type { Appointment, AppStatus, PaginationResponse } from "@/types"

export type BookingApiStatus = "pending" | "confirmed" | "in_service" | "completed" | "cancelled" | "no_show"

export interface BookingPayload {
  userId: number
  serviceId: number
  technicianId?: number | null
  startAt: string
  customerName: string
  customerPhone: string
  note?: string
}

export type UpdateBookingPayload = Partial<BookingPayload> & {
  endAt?: string
}

export interface BookingFilters {
  page: number
  limit: number
  status?: AppStatus | "all"
  userId?: number
  serviceId?: number
  technicianId?: number
  dateFrom?: string
  dateTo?: string
  phone?: string
}

interface BookingApiRecord {
  id: string | number
  bookingNo?: string
  userId?: string | number
  serviceId?: string | number
  technicianId?: string | number | null
  startAt: string
  endAt?: string
  customerName: string
  customerPhone: string
  serviceName: string
  price: number
  durationMinutes: number
  status: BookingApiStatus
  note?: string
  cancelReason?: string
  technicianName?: string
  technician?: {
    technicianName?: string
    profileImg?: string
  } | null
  service?: {
    serviceName?: string
  } | null
}

export interface FetchBookingsResult {
  bookings: Appointment[]
  page: number
  limit: number
  total: number
  isOffline: boolean
}

function toApiStatus(status?: AppStatus | "all"): BookingApiStatus | undefined {
  if (!status || status === "all") return undefined
  if (status === "done") return "completed"
  if (status === "active") return "in_service"
  return status
}

function toUiStatus(status: BookingApiStatus): AppStatus {
  if (status === "completed") return "done"
  if (status === "in_service") return "active"
  if (status === "no_show") return "cancelled"
  return status
}

function formatDate(startAt: string) {
  const date = new Date(startAt)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const difference = Math.round((target.getTime() - today.getTime()) / 86_400_000)

  if (difference === 0) return "วันนี้"
  if (difference === 1) return "พรุ่งนี้"
  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
}

function formatTime(startAt: string) {
  return new Date(startAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function mapBooking(booking: BookingApiRecord): Appointment {
  return {
    id: String(booking.id),
    bookingNo: booking.bookingNo,
    userId: booking.userId == null ? undefined : String(booking.userId),
    serviceId: booking.serviceId == null ? undefined : String(booking.serviceId),
    technicianId: booking.technicianId == null ? undefined : String(booking.technicianId),
    startAt: booking.startAt,
    endAt: booking.endAt,
    customerName: booking.customerName,
    name: booking.customerName,
    phone: booking.customerPhone,
    service: booking.serviceName || booking.service?.serviceName || "บริการทำเล็บ",
    price: Number(booking.price) || 0,
    staff: booking.technicianName || booking.technician?.technicianName || "ใครก็ได้",
    staffImg: booking.technician?.profileImg,
    date: formatDate(booking.startAt),
    time: formatTime(booking.startAt),
    duration: Number(booking.durationMinutes) || 0,
    status: toUiStatus(booking.status),
    cancelReason: booking.cancelReason,
    note: booking.note,
  }
}

export async function fetchBookings(filters: BookingFilters): Promise<FetchBookingsResult> {
  try {
    const endpoint = filters.phone ? "/bookings/customer" : "/bookings"
    const response = await api.get<PaginationResponse<BookingApiRecord>>(endpoint, {
      params: {
        page: filters.page,
        limit: filters.limit,
        status: toApiStatus(filters.status),
        userId: filters.userId,
        serviceId: filters.serviceId,
        technicianId: filters.technicianId,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        phone: filters.phone,
      },
    })

    return {
      bookings: response.data.data.map(mapBooking),
      page: response.data.page,
      limit: response.data.limit,
      total: response.data.total,
      isOffline: false,
    }
  } catch (error) {
    console.warn("Booking API is not available yet.", error)
    return {
      bookings: [],
      page: filters.page,
      limit: filters.limit,
      total: 0,
      isOffline: true,
    }
  }
}

export async function fetchBookingById(id: string) {
  const response = await api.get<BookingApiRecord>(`/bookings/${id}`)
  return mapBooking(response.data)
}

export async function createBooking(payload: BookingPayload) {
  const response = await api.post<BookingApiRecord>("/bookings", payload)
  return mapBooking(response.data)
}

export async function updateBooking(id: string, payload: UpdateBookingPayload) {
  const response = await api.put<BookingApiRecord>(`/bookings/${id}`, payload)
  return mapBooking(response.data)
}

export async function updateBookingStatus(id: string, status: AppStatus, cancelReason?: string) {
  const response = await api.patch<BookingApiRecord>(`/bookings/${id}/status`, {
    status: toApiStatus(status),
    cancelReason: cancelReason || "",
  })
  return mapBooking(response.data)
}

export async function deleteBooking(id: string) {
  await api.delete(`/bookings/${id}`)
}

export async function fetchBusySlots(
  date: string,
  technicianId?: number | null,
  serviceId?: number | null,
): Promise<string[]> {
  try {
    const response = await api.get<{ busySlots: string[] }>("/bookings/busy-slots", {
      params: {
        date,
        technicianId: technicianId || undefined,
        serviceId: serviceId || undefined,
      },
    })
    return response.data.busySlots || []
  } catch (error) {
    console.warn("Unable to fetch busy slots from backend, using empty list.", error)
    return []
  }
}
