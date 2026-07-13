import api from "@/lib/api"
import type { Customer, PaginationResponse } from "@/types"

type CustomerTagFilter = Customer["tag"] | "all"

interface FetchCustomersParams {
  page: number
  limit: number
  searchQuery: string
  activeTag: CustomerTagFilter
}

interface FetchCustomersResult {
  customers: Customer[]
  total: number
  isOffline: boolean
}

export interface UserPayload {
  name: string
  email: string
  age?: number
}

type UserApiRecord = {
  id: string | number
  name: string
  email: string
  age?: number
  created_at?: string
  updated_at?: string
}

function mapUser(user: UserApiRecord): Customer {
  return {
    id: String(user.id),
    name: user.name || "ไม่ระบุชื่อ",
    phone: "-",
    email: user.email || "-",
    age: user.age,
    totalVisits: 0,
    totalSpend: 0,
    lastVisit: user.updated_at ? new Date(user.updated_at).toLocaleDateString("th-TH") : "ไม่มีประวัติ",
    lastService: user.age ? `อายุ ${user.age} ปี` : "ไม่มีข้อมูล",
    tag: "new",
    avatar: "from-rose-400 to-pink-500",
  }
}

function filterCustomers(customers: Customer[], activeTag: CustomerTagFilter, searchQuery: string) {
  const normalizedSearch = searchQuery.toLowerCase()

  return customers.filter((customer) => {
    const matchTag = activeTag === "all" || customer.tag === activeTag
    const matchSearch =
      customer.name.toLowerCase().includes(normalizedSearch) ||
      customer.email.toLowerCase().includes(normalizedSearch)

    return matchTag && matchSearch
  })
}

export function getCustomerSummary(customers: Customer[]) {
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpend, 0)
  const avgSpend = customers.length ? Math.round(totalRevenue / customers.length) : 0

  return {
    totalRevenue,
    avgSpend,
  }
}

export async function fetchCustomers({
  page,
  limit,
  searchQuery,
  activeTag,
}: FetchCustomersParams): Promise<FetchCustomersResult> {
  try {
    const response = await api.get<PaginationResponse<UserApiRecord>>("/users", {
      params: { page, limit },
    })

    const mapped = response.data.data.map(mapUser)
    const customers = filterCustomers(mapped, activeTag, searchQuery)

    return {
      customers,
      total: response.data.total,
      isOffline: false,
    }
  } catch (error) {
    console.warn("Unable to fetch users from backend.", error)

    return {
      customers: [],
      total: 0,
      isOffline: true,
    }
  }
}

export async function fetchUserById(id: string) {
  const response = await api.get<UserApiRecord>(`/users/${id}`)
  return mapUser(response.data)
}

export async function createUser(payload: UserPayload) {
  const response = await api.post<UserApiRecord>("/users", payload)
  return mapUser(response.data)
}

export async function updateUser(id: string, payload: UserPayload) {
  const response = await api.put<UserApiRecord>(`/users/${id}`, payload)
  return mapUser(response.data)
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`)
}
