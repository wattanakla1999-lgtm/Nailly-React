import api from "@/lib/api"
import type { AppStatus } from "@/types"

export interface DashboardAppointment {
  id: string
  name: string
  service: string
  time: string
  status: AppStatus
  imgUrl?: string
  avatarText?: string
}

export interface PopularService {
  name: string
  rate: number
  count: number
  percent: number
  color: string
}

export interface DashboardData {
  todayAppointments: number
  todayAppointmentsChange: number
  totalCustomers: number
  totalCustomersChange: string
  activeServicesCount: number
  todayRevenue: number
  appointments: DashboardAppointment[]
  popularServices: PopularService[]
  isOffline?: boolean
}

const MOCK_DASHBOARD_DATA: DashboardData = {
  todayAppointments: 12,
  todayAppointmentsChange: 3,
  totalCustomers: 248,
  totalCustomersChange: "+5 ใหม่",
  activeServicesCount: 8,
  todayRevenue: 3200,
  appointments: [
    {
      id: "pim",
      name: "คุณพิม พิมประภา",
      service: "ต่อเล็บเจล + เพ้นท์ลาย",
      time: "10:00",
      status: "active",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhNpXZyacwG5q2S5HlwjiZ5Mr-kBxeh9rY_oUy58fKAWSFtkjevptHv8BZrlthTr6wg7GGomNMCZQTfThLURSNaBXGhfZZJROnvTIP2ntFy4C6Ki45ZQIbBf5QOswezsekhCTgNbSzCTFdRG1OnKpYLlrtZcQPsW-r7RFD-Jb4mLUjd9-04tEk0pivo5BZMJwYqbM23DDZBKa2jmAEYE83YpYioDWqJWG6a7OeZqZA_E-gtCgxHg4d0Brc9NeXivDDo1v127RIdQ0",
    },
    {
      id: "aranya",
      name: "คุณอรัญญา",
      service: "สปามือและเท้า + ทาสีเจล",
      time: "13:30",
      status: "pending",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQAdLpKVRx3Ilt3FqqiqbjG-RzEzl7HlLcLasPv7TGtAuv9KATFEynIMpQOWpsDXxY5iS7ARBNMX_U0_5cqobN45jvBS4DC27DlwJUYafl1YgAGu73S0Zqc5lDQTcwVeVVyBH50jdAw1pTiUBXclHUTfuLyEf7Ktyrnb2Jnn8ANLWxTI9yjk6VjbcxeL5DSBK9SxuaTXQu_FP3C3UmMRcQ0-R8IWvtm3dCN6sxTlVkrtfpFfjY8uqISUTI0Zkbs85UMJuLYgy_ncU",
    },
    {
      id: "jennifer",
      name: "คุณเจนนิเฟอร์",
      service: "ถอดเล็บเจล",
      time: "15:00",
      status: "confirmed",
      avatarText: "จ",
    },
    {
      id: "lukson",
      name: "คุณลูกศร",
      service: "ทาสีเจลมือ (สีพื้น)",
      time: "16:30",
      status: "confirmed",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaeplGl0eg0XDgBHNcLjjTKmTkE9MaJ7D28RnajVemY6abga4I7eDODXu_WoAVgNZinJJL5pH4yn-bFtRPSZTta3I2jnRerFLE-jQBxz7jJ5fXBBjX42MKq3TrXFXuI2ZA52SUoMHEm5ABUNCo_tiKnx8I4YuOEiyi6CqCr-u4O7FV_AuXjxjYdw_2u7-gBNJtUoMhVMYPV-8fWmCC46lgSqjThCweVOAXBLmP0R4_RE9sBy4PBuldTabvod1hemYU3w2bGCARW_Y",
    },
  ],
  popularServices: [
    { name: "ทาสีเจลมือ", rate: 4.9, count: 124, percent: 45, color: "from-[#818CF8] to-[#FB923C]" },
    { name: "สปามือ-เท้า", rate: 4.8, count: 89, percent: 30, color: "bg-[#FB923C]" },
    { name: "ต่อเล็บ PVC", rate: 4.7, count: 56, percent: 15, color: "bg-[#a78bfa]" },
    { name: "เพ้นท์ลายศิลปะ", rate: 4.9, count: 42, percent: 10, color: "bg-[#818CF8]" },
  ],
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await api.get<DashboardData>("/dashboard/stats")
    return { ...response.data, isOffline: false }
  } catch (error) {
    console.warn("Unable to fetch dashboard statistics, using mock data.", error)
    return { ...MOCK_DASHBOARD_DATA, isOffline: true }
  }
}
