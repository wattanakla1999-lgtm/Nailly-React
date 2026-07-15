import api from "@/lib/api"
import type { DayRevenue, Transaction } from "@/types"

export interface SummaryMetrics {
  todayRevenue: number
  todayAppointments: number
  avgPerBill: number
  targetPercent: number
  revenueChange: number
}

export interface PaymentBreakdownItem {
  method: "cash" | "transfer" | "card"
  percent: number
  amount: number
}

export interface ReportData {
  summary: SummaryMetrics
  chartData: DayRevenue[]
  paymentBreakdown: PaymentBreakdownItem[]
  recentTransactions: Transaction[]
}

interface FetchReportParams {
  period: "week" | "month"
}

interface FetchReportResult extends ReportData {
  isOffline: boolean
}

// ─── Beautiful static mock data for offline fallback ──────────────────────────

const WEEKLY_CHART_DATA: DayRevenue[] = [
  { day: "จ.", revenue: 2800, appointments: 8 },
  { day: "อ.", revenue: 4200, appointments: 12 },
  { day: "พ.", revenue: 3500, appointments: 10 },
  { day: "พฤ.", revenue: 5100, appointments: 15 },
  { day: "ศ.", revenue: 6200, appointments: 18 },
  { day: "ส.", revenue: 7800, appointments: 22 },
  { day: "อา.", revenue: 3200, appointments: 9 },
]

// Generate fixed seed-like monthly data so it remains consistent on render
const MONTHLY_CHART_DATA: DayRevenue[] = Array.from({ length: 30 }, (_, i) => {
  // Simple pseudo-random function for consistent mock values
  const seed = ((i + 5) * 17) % 100
  return {
    day: `${i + 1}`,
    revenue: 1500 + (seed * 45),
    appointments: 3 + (seed % 13),
  }
})

const MOCK_RECENT_TRANSACTIONS: Transaction[] = [
  { id: "1", customer: "คุณสมใจ รักสวย", service: "Gel Manicure + Nail Art", amount: 650, time: "10:45", staff: "น้องนุ่น", method: "transfer" },
  { id: "2", customer: "คุณวรรณา สวยงาม", service: "French Manicure", amount: 450, time: "14:00", staff: "น้องนุ่น", method: "cash" },
  { id: "3", customer: "คุณพิมพ์ใจ รุ่งเรือง", service: "Nail Extension", amount: 900, time: "16:00", staff: "น้องแนน", method: "card" },
  { id: "4", customer: "คุณมาลี สดใส", service: "Pedicure Classic", amount: 350, time: "09:30", staff: "น้องแนน", method: "transfer" },
  { id: "5", customer: "คุณกนกวรรณ ดาวแดง", service: "Gel Pedicure", amount: 480, time: "11:00", staff: "น้องนุ่น", method: "cash" },
]

const MOCK_PAYMENT_BREAKDOWN: PaymentBreakdownItem[] = [
  { method: "transfer", percent: 55, amount: 1760 },
  { method: "cash", percent: 30, amount: 960 },
  { method: "card", percent: 15, amount: 480 },
]

const MOCK_SUMMARY: SummaryMetrics = {
  todayRevenue: 3200,
  todayAppointments: 12,
  avgPerBill: 267,
  targetPercent: 64,
  revenueChange: 8.5,
}

export async function fetchReportData({ period }: FetchReportParams): Promise<FetchReportResult> {
  try {
    const response = await api.get<ReportData>("/reports", {
      params: { period },
    })

    return {
      ...response.data,
      isOffline: false,
    }
  } catch (error) {
    console.warn("Unable to fetch report data from backend, falling back to mock data.", error)

    const chartData = period === "week" ? WEEKLY_CHART_DATA : MONTHLY_CHART_DATA

    return {
      summary: MOCK_SUMMARY,
      chartData,
      paymentBreakdown: MOCK_PAYMENT_BREAKDOWN,
      recentTransactions: MOCK_RECENT_TRANSACTIONS,
      isOffline: true,
    }
  }
}
