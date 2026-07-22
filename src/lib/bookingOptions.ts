import type { Technician } from "@/services/technicianService"
import type { Staff } from "@/types"

export const ANY_STAFF: Staff = {
  id: "any",
  name: "ใครก็ได้ (สุ่มช่าง)",
  role: "เลือกช่างที่ว่างเร็วที่สุด",
  img: "💅",
  rate: 0,
}

export function mapTechnicianToStaff(technician: Technician): Staff {
  return {
    id: technician.id,
    name: technician.name,
    role: technician.specialties.join(", ") || technician.role,
    img: technician.profileImg || technician.name.trim().charAt(0) || "ช",
    rate: technician.rate,
  }
}

export function buildStaffOptions(technicians: Technician[]) {
  return [
    ANY_STAFF,
    ...technicians
      .filter((technician) => technician.status === "active")
      .map(mapTechnicianToStaff),
  ]
}
