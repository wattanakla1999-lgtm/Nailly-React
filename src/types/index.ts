export type AppStatus = "confirmed" | "pending" | "done" | "cancelled" | "active"

export interface PaginationResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
}

export interface Appointment {
  id?: string
  customerName?: string // Used in admin/appointments dashboard
  name?: string // Backwards compatibility / customer bookings
  phone: string
  service: string
  price: number
  staff: string
  staffImg?: string
  date: string
  time: string
  duration?: number
  status: AppStatus
  iconType?: "dry_cleaning" | "brush" | "spa"
  cancelReason?: string
}

export interface Service {
  id: string
  name: string
  nameTh?: string
  price: number
  duration: number
  img?: string
  category: string
  popular?: boolean
  description?: string
  emoji?: string
}

export interface Staff {
  id: string
  name: string
  role: string
  img: string
  rate: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  age?: number
  totalVisits: number
  totalSpend: number
  lastVisit: string
  lastService: string
  tag: "vip" | "regular" | "new"
  avatar: string // CSS gradient classes
}

export interface DayRevenue {
  day: string
  revenue: number
  appointments: number
}

export interface Transaction {
  id: string
  customer: string
  service: string
  amount: number
  time: string
  staff: string
  method: "cash" | "transfer" | "card"
}
