import api from "@/lib/api"
import type { PaginationResponse } from "@/types"

export type TechnicianStatus = "active" | "break" | "inactive"

export interface Technician {
  id: string
  name: string
  nickname: string
  phone: string
  role: string
  specialties: string[]
  status: TechnicianStatus
  rate: number
  bookingsToday: number
  workHours: string
  avatar: string
  profileImg?: string
  bio?: string
  experienceYears?: number
}

interface FetchTechniciansParams {
  page: number
  limit: number
}

interface FetchTechniciansResult {
  technicians: Technician[]
  total: number
  isOffline: boolean
}

export interface TechnicianPayload {
  technicianName: string
  phone: string
  experienceYears: number
  specialty: string
  profileImg?: string
  active: boolean
  bio?: string
}

type TechnicianApiRecord = {
  technicianId: string | number
  technicianName: string
  phone: string
  experienceYears: number
  specialty: string
  profileImg?: string
  active: boolean
  bio?: string
  createdAt?: string
  updatedAt?: string
}

export const AVATAR_OPTIONS = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-teal-400 to-cyan-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-500",
]

function mapTechnician(item: TechnicianApiRecord): Technician {
  return {
    id: String(item.technicianId),
    name: item.technicianName || "ไม่ระบุชื่อ",
    nickname: item.technicianName || "ช่างทำเล็บ",
    phone: item.phone || "-",
    role: item.experienceYears > 3 ? "Senior Nail Technician" : "Nail Technician",
    specialties: item.specialty ? [item.specialty] : [],
    status: item.active ? "active" : "inactive",
    rate: 0,
    bookingsToday: 0,
    workHours: item.updatedAt ? `อัปเดต ${new Date(item.updatedAt).toLocaleDateString("th-TH")}` : "-",
    avatar: AVATAR_OPTIONS[0],
    profileImg: item.profileImg,
    bio: item.bio,
    experienceYears: item.experienceYears,
  }
}

export async function fetchTechnicians({
  page,
  limit,
}: FetchTechniciansParams): Promise<FetchTechniciansResult> {
  try {
    const response = await api.get<PaginationResponse<TechnicianApiRecord>>("/nail_technician", {
      params: { page, limit },
    })
    const technicians = response.data.data.map(mapTechnician)

    return {
      technicians,
      total: response.data.total,
      isOffline: false,
    }
  } catch (error) {
    console.warn("Unable to fetch nail technicians from backend.", error)

    return {
      technicians: [],
      total: 0,
      isOffline: true,
    }
  }
}

export async function fetchTechnicianById(id: string) {
  const response = await api.get<TechnicianApiRecord>(`/nail_technician/${id}`)
  return mapTechnician(response.data)
}

export async function createTechnician(payload: TechnicianPayload) {
  const response = await api.post<TechnicianApiRecord>("/nail_technician", payload)
  return mapTechnician(response.data)
}

export async function updateTechnician(id: string, payload: TechnicianPayload) {
  const response = await api.put<TechnicianApiRecord>(`/nail_technician/${id}`, payload)
  return mapTechnician(response.data)
}

export async function deleteTechnician(id: string) {
  await api.delete(`/nail_technician/${id}`)
}
