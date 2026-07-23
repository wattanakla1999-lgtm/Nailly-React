import { CardCrudActions } from "@/components/CardCrudActions"
import { Dropdown, type DropdownOption } from "@/components/forms/Dropdown"
import { LoadingPopup } from "@/components/LoadingPopup"
import { Button } from "@/components/ui/button"
import { Y2KModal } from "@/components/Y2KModal"
import { getApiErrorMessage } from "@/lib/apiError"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"
import {
  AVATAR_OPTIONS,
  createTechnician,
  deleteTechnician,
  fetchTechnicianById,
  fetchTechnicians,
  updateTechnician,
  type Technician,
  type TechnicianPayload,
  type TechnicianStatus,
} from "@/services/technicianService"
import {
  AlertCircle,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  UserRoundCog,
} from "lucide-react"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

type TechnicianFormState = Omit<Technician, "id" | "specialties" | "rate" | "bookingsToday"> & {
  id?: string
  specialties: string
  rate: string
  bookingsToday: string
  experienceYears?: number
  profileImg?: string
  bio?: string
}


const STATUS_OPTIONS: DropdownOption<TechnicianStatus>[] = [
  { value: "active", label: "พร้อมรับงาน" },
  { value: "break", label: "พักเบรก" },
  { value: "inactive", label: "ไม่อยู่ร้าน" },
]

const STATUS_CONFIG: Record<TechnicianStatus, { label: string; styles: string }> = {
  active: { label: "พร้อมรับงาน", styles: "bg-emerald-100 text-emerald-600 border-emerald-300" },
  break: { label: "พักเบรก", styles: "bg-secondary-container text-on-secondary-container border-secondary" },
  inactive: { label: "ไม่อยู่ร้าน", styles: "bg-neutral-100 text-neutral-500 border-neutral-300" },
}

const emptyForm: TechnicianFormState = {
  name: "",
  nickname: "",
  phone: "",
  role: "Nail Technician",
  specialties: "",
  status: "active",
  rate: "4.8",
  bookingsToday: "0",
  workHours: "10:00 - 19:00",
  avatar: AVATAR_OPTIONS[0],
  experienceYears: 0,
  profileImg: "",
  bio: "",
}

function toFormState(technician: Technician): TechnicianFormState {
  return {
    ...technician,
    specialties: technician.specialties.join(", "),
    rate: String(technician.rate),
    bookingsToday: String(technician.bookingsToday),
  }
}

function toTechnicianPayload(form: TechnicianFormState): TechnicianPayload {
  return {
    technicianName: form.name.trim(),
    phone: form.phone.trim(),
    experienceYears: Number(form.experienceYears) || 0,
    specialty: form.specialties.trim(),
    profileImg: form.profileImg?.trim() || undefined,
    active: form.status === "active",
    bio: form.bio?.trim() || undefined,
  }
}

export function TechniciansPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const activeStatus = "all"
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [form, setForm] = useState<TechnicianFormState>(emptyForm)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    data,
    isLoading: loading,
  } = useQuery({
    queryKey: ["technicians", page],
    queryFn: () => fetchTechnicians({ page, limit }),
  })

  const technicians = data?.technicians ?? []
  const total = data?.total ?? 0
  const isOffline = data?.isOffline ?? false

  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeStatus])

  const filtered = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase()

    return technicians.filter((technician) => {
      const matchStatus = activeStatus === "all" || technician.status === activeStatus
      const matchSearch =
        technician.name.toLowerCase().includes(normalizedSearch) ||
        technician.nickname.toLowerCase().includes(normalizedSearch) ||
        technician.phone.includes(searchQuery) ||
        technician.role.toLowerCase().includes(normalizedSearch) ||
        technician.specialties.some((skill) => skill.toLowerCase().includes(normalizedSearch))

      return matchStatus && matchSearch
    })
  }, [activeStatus, searchQuery, technicians])

  const activeCount = technicians.filter((technician) => technician.status === "active").length
  const totalExperienceYears = technicians.reduce((sum, technician) => sum + (technician.experienceYears ?? 0), 0)
  const averageRate = technicians.length
    ? (technicians.reduce((sum, technician) => sum + technician.rate, 0) / technicians.length).toFixed(1)
    : "0.0"
  const totalPages = Math.ceil(total / limit) || 1

  const openAddModal = () => {
    setSelectedTechnician(null)
    setForm(emptyForm)
    setShowFormModal(true)
  }

  const openEditModal = (technician: Technician) => {
    setSelectedTechnician(technician)
    setForm(toFormState(technician))
    setShowFormModal(true)

    if (!technician.id) {
      console.warn("Unable to fetch technician detail because technicianId is empty.")
      return
    }

    void fetchTechnicianById(technician.id).then((detail) => {
      setSelectedTechnician(detail)
      setForm(toFormState(detail))
    }).catch((error) => {
      console.warn("Unable to fetch technician detail, using list data.", error)
    })
  }

  const openDeleteModal = (technician: Technician) => {
    setSelectedTechnician(technician)
    setShowDeleteModal(true)
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const payload = toTechnicianPayload(form)

      if (selectedTechnician) {
        if (!selectedTechnician.id) {
          throw new Error("ไม่สามารถแก้ไขช่างทำเล็บได้ เพราะ backend ไม่ได้ส่ง technicianId")
        }
        await updateTechnician(selectedTechnician.id, payload)
      } else {
        await createTechnician(payload)
      }

      await queryClient.invalidateQueries({ queryKey: ["technicians"] })
      setShowFormModal(false)
      setSuccessMessage(selectedTechnician ? "แก้ไขข้อมูลช่างทำเล็บเรียบร้อยแล้ว" : "เพิ่มช่างทำเล็บใหม่เรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Unable to save nail technician.", error)
      setSuccessMessage(getApiErrorMessage(error, "บันทึกข้อมูลช่างทำเล็บไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  const handleDelete = async () => {
    if (!selectedTechnician) return

    try {
      if (!selectedTechnician.id) {
        throw new Error("ไม่สามารถลบช่างทำเล็บได้ เพราะ backend ไม่ได้ส่ง technicianId")
      }
      await deleteTechnician(selectedTechnician.id)
      await queryClient.invalidateQueries({ queryKey: ["technicians"] })
      setShowDeleteModal(false)
      setSuccessMessage(`ลบข้อมูล ${selectedTechnician.nickname} เรียบร้อยแล้ว`)
      setSelectedTechnician(null)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Unable to delete nail technician.", error)
      setSuccessMessage(getApiErrorMessage(error, "ลบข้อมูลช่างทำเล็บไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  const updateForm = <K extends keyof TechnicianFormState>(key: K, value: TechnicianFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="space-y-4">
      <LoadingPopup isOpen={loading} message={t("admin.technicians.loading", "กำลังโหลดข้อมูลช่างทำเล็บ...")} />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-baseline gap-2 text-2xl font-black tracking-tight text-on-surface">
            {t("admin.technicians.title", "ช่างทำเล็บ")}
            <span className="text-base font-normal text-outline">({total})</span>
          </h1>
          {isOffline && (
            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {t("admin.technicians.offline", "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ แสดงข้อมูลจากเครื่องนี้")}
            </p>
          )}
        </div>

        <Button
          onClick={openAddModal}
          className="h-9 shrink-0 gap-1.5 rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-3 text-xs font-bold text-white shadow-[3px_3px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#1e1b4b]"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          {t("admin.technicians.add", "เพิ่มช่าง")}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: t("admin.technicians.total", "ช่างทั้งหมด"), value: total },
          { label: t("admin.technicians.active", "พร้อมรับงาน"), value: activeCount },
          { label: t("admin.technicians.experience", "ปีประสบการณ์รวม"), value: totalExperienceYears },
        ].map(({ label, value }) => (
          <div key={label} className="y2k-card flex min-h-16 flex-col items-center justify-center gap-0.5 p-2 text-center">
            <p className="text-lg font-black text-on-surface">{value}</p>
            <p className="text-[9px] font-bold text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_160px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder={t("admin.technicians.search", "ค้นหาชื่อ, ชื่อเล่น, เบอร์โทร หรือความถนัด...")}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            maxLength={100}
            className="h-10 w-full rounded-xl border-2 border-outline-variant bg-surface pl-10 pr-3 text-xs font-medium outline-none shadow-[2px_2px_0px_0px_#c7d2fe] transition-all placeholder:text-outline-variant focus:border-primary focus:ring-0"
          />
        </div>
        <div className="y2k-card hidden items-center justify-center gap-2 p-2 lg:flex">
          <Star className="h-4 w-4 fill-secondary text-secondary" />
          <span className="text-xs font-black text-on-surface">{t("admin.technicians.averageRating", "คะแนนเฉลี่ย")} {averageRate}</span>
        </div>
      </div>


      {filtered.length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <UserRoundCog className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">{t("admin.technicians.empty", "ไม่พบช่างทำเล็บที่ค้นหา")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 items-start gap-3">
            {filtered.map((technician, index) => {
              const status = STATUS_CONFIG[technician.status]

              return (
                <article key={`${technician.id}-${technician.name}-${index}`} className="y2k-card flex min-w-0 flex-col gap-2 p-2.5">
                <div className="flex min-w-0 items-start gap-1.5">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-on-surface bg-gradient-to-br text-sm font-black text-white shadow-[2px_2px_0px_#1e1b4b]", technician.avatar)}>
                    {technician.profileImg ? (
                      <img src={technician.profileImg} alt={technician.name} className="h-full w-full object-cover" />
                    ) : (
                      technician.nickname.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-black text-on-surface">{technician.nickname}</h3>
                    <span className={cn("inline-block max-w-full truncate rounded-full border px-1.5 py-0.5 text-[8px] font-black", status.styles)}>
                      {status.label}
                    </span>
                    <p className="truncate text-[8px] font-semibold text-neutral-400">{technician.role}</p>
                  </div>
                  <CardCrudActions
                    itemName={technician.nickname}
                    onEdit={() => openEditModal(technician)}
                    onDelete={() => openDeleteModal(technician)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg border border-outline-variant bg-surface px-2 py-1.5">
                    <p className="text-[8px] font-bold text-neutral-400">ประสบการณ์</p>
                    <p className="text-xs font-black leading-tight text-on-surface">{technician.experienceYears ?? 0} ปี</p>
                  </div>
                  <div className="rounded-lg border border-outline-variant bg-surface px-2 py-1.5">
                    <p className="text-[8px] font-bold text-neutral-400">คะแนน</p>
                    <p className="text-xs font-black leading-tight text-on-surface">{technician.rate.toFixed(1)}</p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-dashed border-outline-variant pt-1.5">
                  <p className="flex min-w-0 items-center gap-1 text-[9px] font-bold text-neutral-500">
                    <Phone className="h-3 w-3 shrink-0 text-outline" />
                    <span className="truncate">{technician.phone}</span>
                  </p>
                  <p className="flex min-w-0 items-center gap-1 text-[9px] font-bold text-neutral-500">
                    <Clock className="h-3 w-3 shrink-0 text-outline" />
                    <span className="truncate">{technician.workHours}</span>
                  </p>
                  {technician.bio && (
                    <p className="truncate text-[8px] font-semibold text-neutral-500">{technician.bio}</p>
                  )}
                  <div className="flex min-h-4 flex-wrap gap-1">
                    {technician.specialties.map((skill) => (
                      <span key={skill} className="max-w-full truncate rounded-full border border-primary/40 bg-primary-container px-1.5 py-0.5 text-[8px] font-black text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                </article>
              )
            })}
            {Array.from({ length: Math.max(0, limit - filtered.length) }, (_, index) => (
              <div
                key={`technician-placeholder-${index}`}
                aria-hidden="true"
                className="y2k-card invisible min-h-44 pointer-events-none"
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-outline-variant">
            <span className="text-xs font-bold text-neutral-400">
              หน้า {page} จาก {totalPages} (ทั้งหมด {total} คน)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                className={cn(
                  "p-2 rounded-xl border-2 transition-all",
                  page <= 1
                    ? "bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "bg-white border-on-surface text-on-surface hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#1e1b4b]"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                className={cn(
                  "p-2 rounded-xl border-2 transition-all",
                  page >= totalPages
                    ? "bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "bg-white border-on-surface text-on-surface hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#1e1b4b]"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Y2KModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={selectedTechnician ? "แก้ไขข้อมูลช่าง" : "เพิ่มช่างทำเล็บ"}
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              className="rounded-xl border-2 border-outline-variant bg-white px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              ยกเลิก
            </button>
            <button
              form="technician-form"
              type="submit"
              className="rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              บันทึก
            </button>
          </>
        }
      >
        <form id="technician-form" onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อจริง</span>
              <input
                required
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                maxLength={100}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อเรียก</span>
              <input
                required
                value={form.nickname}
                onChange={(event) => updateForm("nickname", event.target.value)}
                maxLength={100}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">เบอร์โทร</span>
              <input
                required
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value.replace(/[^0-9]/g, ""))}
                maxLength={20}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ประสบการณ์ (ปี)</span>
              <input
                required
                min="0"
                max="100"
                type="number"
                value={form.experienceYears ?? 0}
                onChange={(event) => updateForm("experienceYears", Number(event.target.value))}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">สถานะ</span>
              <Dropdown
                value={form.status}
                options={STATUS_OPTIONS}
                onChange={(value) => updateForm("status", value)}
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ความถนัด</span>
              <input
                required
                value={form.specialties}
                onChange={(event) => updateForm("specialties", event.target.value)}
                placeholder="เช่น Gel Manicure, Nail Art, Extension"
                maxLength={100}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">รูปโปรไฟล์ URL</span>
              <input
                value={form.profileImg ?? ""}
                onChange={(event) => updateForm("profileImg", event.target.value)}
                placeholder="https://..."
                maxLength={255}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">Bio</span>
              <textarea
                value={form.bio ?? ""}
                onChange={(event) => updateForm("bio", event.target.value)}
                rows={3}
                maxLength={500}
                className="w-full resize-none px-4 py-3 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
          </div>
        </form>
      </Y2KModal>

      <Y2KModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="ยืนยันการลบข้อมูล"
        footer={
          <>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl border-2 border-outline-variant bg-white px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl border-2 border-red-500 bg-red-500 px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#7f1d1d] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              ลบข้อมูล
            </button>
          </>
        }
      >
        <div className="py-3 text-center space-y-3">
          <Trash2 className="mx-auto h-10 w-10 text-red-500" />
          <p className="text-sm font-black text-neutral-800">
            ต้องการลบข้อมูล {selectedTechnician?.nickname} ใช่ไหม?
          </p>
        </div>
      </Y2KModal>

      <Y2KModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="ทำรายการสำเร็จ"
        footer={
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-2 px-5 font-bold border-2 border-on-surface shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95 transition-all text-xs"
          >
            ตกลง
          </button>
        }
      >
        <div className="text-center py-4 space-y-3">
          <BadgeCheck className="mx-auto h-12 w-12 text-emerald-500" />
          <p className="text-sm font-black text-neutral-800">{successMessage}</p>
          <p className="text-[10px] font-bold text-neutral-400 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" />
            ข้อมูลถูกบันทึกไว้ในเครื่องนี้แล้ว
          </p>
        </div>
      </Y2KModal>
    </div>
  )
}
