import api from "@/lib/api"
import type { PaginationResponse, Service } from "@/types"

interface FetchServicesParams {
  page: number
  limit: number
}

interface FetchServicesResult {
  services: Service[]
  total: number
  isOffline: boolean
}

export interface ServicePayload {
  serviceName: string
  servicePrice: number
  duration: number
  img?: string
  popular: boolean
  description?: string
}

type ServiceApiRecord = {
  serviceId: string | number
  serviceName: string
  servicePrice: number
  duration: number
  img?: string
  popular?: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

function inferCategory(serviceName: string) {
  const normalizedName = serviceName.toLowerCase()

  if (normalizedName.includes("pedi")) return "pedicure"
  if (normalizedName.includes("art")) return "art"
  if (normalizedName.includes("extension")) return "extension"
  return "manicure"
}

function mapService(service: ServiceApiRecord): Service {
  return {
    id: String(service.serviceId),
    name: service.serviceName || "ไม่ระบุชื่อบริการ",
    nameTh: service.serviceName || "ไม่ระบุชื่อบริการ",
    price: Number(service.servicePrice) || 0,
    duration: Number(service.duration) || 0,
    img: service.img,
    category: inferCategory(service.serviceName || ""),
    popular: Boolean(service.popular),
    description: service.description || "-",
    emoji: "💅",
  }
}

export async function fetchServices({
  page,
  limit,
}: FetchServicesParams): Promise<FetchServicesResult> {
  try {
    const response = await api.get<PaginationResponse<ServiceApiRecord>>("/services", {
      params: { page, limit },
    })

    return {
      services: response.data.data.map(mapService),
      total: response.data.total,
      isOffline: false,
    }
  } catch (error) {
    console.warn("Unable to fetch services from backend.", error)

    return {
      services: [],
      total: 0,
      isOffline: true,
    }
  }
}

export async function fetchServiceById(id: string) {
  const response = await api.get<ServiceApiRecord>(`/services/${id}`)
  return mapService(response.data)
}

export async function createService(payload: ServicePayload) {
  const response = await api.post<ServiceApiRecord>("/services", payload)
  return mapService(response.data)
}

export async function updateService(id: string, payload: ServicePayload) {
  const response = await api.put<ServiceApiRecord>(`/services/${id}`, payload)
  return mapService(response.data)
}

export async function deleteService(id: string) {
  await api.delete(`/services/${id}`)
}
