import { LoadingPopup } from "@/components/LoadingPopup"
import { ServiceCard } from "@/components/services/ServiceCard"
import { Button } from "@/components/ui/button"
import { Y2KModal } from "@/components/Y2KModal"
import { getApiErrorMessage } from "@/lib/apiError"
import { cn } from "@/lib/utils"
import {
  createService,
  deleteService,
  fetchServiceById,
  fetchServices,
  updateService,
  type ServicePayload,
} from "@/services/serviceService"
import type { Service } from "@/types"
import { AlertCircle, BadgeCheck, ChevronLeft, ChevronRight, Plus, Scissors, Search, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "manicure", label: "เมนิเกียร์" },
  { value: "pedicure", label: "เพดิเกียร์" },
  { value: "art", label: "เพนท์ลวดลาย" },
  { value: "extension", label: "ต่อเล็บ" },
]

type ServiceFormState = {
  serviceName: string
  servicePrice: string
  duration: string
  img: string
  description: string
}

const emptyForm: ServiceFormState = {
  serviceName: "",
  servicePrice: "0",
  duration: "60",
  img: "",
  description: "",
}

function toFormState(service: Service): ServiceFormState {
  return {
    serviceName: service.name,
    servicePrice: String(service.price),
    duration: String(service.duration),
    img: service.img ?? "",
    description: service.description ?? "",
  }
}

function toServicePayload(form: ServiceFormState): ServicePayload {
  return {
    serviceName: form.serviceName.trim(),
    servicePrice: Number(form.servicePrice) || 0,
    duration: Number(form.duration) || 0,
    img: form.img.trim() || undefined,
    popular: false,
    description: form.description.trim() || undefined,
  }
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceFormState>(emptyForm)
  const [successMessage, setSuccessMessage] = useState("")

  const loadServices = useCallback(async () => {
    setLoading(true)
    const result = await fetchServices({ page, limit })

    setServices(result.services)
    setTotal(result.total)
    setIsOffline(result.isOffline)
    setLoading(false)
  }, [page, limit])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeCategory])

  const filtered = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase()

    return services.filter((service) => {
      const matchCat = activeCategory === "all" || service.category === activeCategory
      const matchSearch =
        (service.nameTh || "").toLowerCase().includes(normalizedSearch) ||
        service.name.toLowerCase().includes(normalizedSearch)

      return matchCat && matchSearch
    })
  }, [activeCategory, searchQuery, services])

  const averagePrice = services.length
    ? Math.round(services.reduce((sum, service) => sum + service.price, 0) / services.length)
    : 0
  const averageDuration = services.length
    ? Math.round(services.reduce((sum, service) => sum + service.duration, 0) / services.length)
    : 0
  const totalPages = Math.ceil(total / limit) || 1

  const openAddModal = () => {
    setSelectedService(null)
    setForm(emptyForm)
    setShowFormModal(true)
  }

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setForm(toFormState(service))
    setShowFormModal(true)

    if (!service.id || service.id === "0") return

    void fetchServiceById(service.id).then((detail) => {
      setSelectedService(detail)
      setForm(toFormState(detail))
    }).catch((error) => {
      console.warn("Unable to fetch service detail, using list data.", error)
    })
  }

  const openDeleteModal = (service: Service) => {
    setSelectedService(service)
    setShowDeleteModal(true)
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const payload = toServicePayload(form)

      if (selectedService) {
        if (!selectedService.id || selectedService.id === "0") {
          throw new Error("ไม่สามารถแก้ไขบริการได้ เพราะ backend ไม่ได้ส่ง serviceId ที่ถูกต้อง")
        }
        await updateService(selectedService.id, payload)
      } else {
        await createService(payload)
      }

      await loadServices()
      setShowFormModal(false)
      setSuccessMessage(selectedService ? "แก้ไขบริการเรียบร้อยแล้ว" : "เพิ่มบริการใหม่เรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Unable to save service.", error)
      setSuccessMessage(getApiErrorMessage(error, "บันทึกข้อมูลบริการไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  const handleDelete = async () => {
    if (!selectedService) return

    try {
      if (!selectedService.id || selectedService.id === "0") {
        throw new Error("ไม่สามารถลบบริการได้ เพราะ backend ไม่ได้ส่ง serviceId ที่ถูกต้อง")
      }
      await deleteService(selectedService.id)
      await loadServices()
      setShowDeleteModal(false)
      setSuccessMessage(`ลบบริการ ${selectedService.name} เรียบร้อยแล้ว`)
      setSelectedService(null)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Unable to delete service.", error)
      setSuccessMessage(getApiErrorMessage(error, "ลบข้อมูลบริการไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  const updateForm = <K extends keyof ServiceFormState>(key: K, value: ServiceFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="space-y-4">
      <LoadingPopup isOpen={loading} message="กำลังค้นหาข้อมูลบริการ..." />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-baseline gap-2 text-2xl font-black tracking-tight text-on-surface">
            บริการ
            <span className="text-base font-normal text-outline">({total})</span>
          </h1>
          {isOffline && (
            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ
            </p>
          )}
        </div>
        <Button
          onClick={openAddModal}
          className="h-9 shrink-0 gap-1.5 rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-3 text-xs font-bold text-white shadow-[3px_3px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#1e1b4b]"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มบริการ
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "บริการทั้งหมด", value: total },
          { label: "ราคาเฉลี่ย", value: `฿${averagePrice.toLocaleString()}` },
          { label: "เวลาเฉลี่ย", value: `${averageDuration} นาที` },
        ].map(({ label, value }) => (
          <div key={label} className="y2k-card flex min-h-16 flex-col items-center justify-center gap-0.5 p-2 text-center">
            <p className="text-lg font-black text-on-surface">{value}</p>
            <p className="text-[9px] font-bold text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
        <input
          type="text"
          placeholder="ค้นหาบริการ..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-10 w-full rounded-xl border-2 border-outline-variant bg-surface pl-10 pr-3 text-xs font-medium outline-none shadow-[2px_2px_0px_0px_#c7d2fe] transition-all placeholder:text-outline-variant focus:border-primary focus:ring-0"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = activeCategory === value
          return (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={cn(
                "whitespace-nowrap rounded-full border-2 px-4 py-2 text-[10px] font-bold transition-all",
                isActive
                  ? "bg-primary text-on-primary border-primary shadow-[2px_2px_0px_0px_#1e1b4b]"
                  : "bg-surface border-outline-variant text-on-surface hover:bg-surface-variant shadow-[2px_2px_0px_0px_#c7d2fe]"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <Scissors className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">ไม่พบบริการที่ค้นหา</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-3">
            {filtered.map((service, index) => (
              <ServiceCard
                key={`${service.id}-${service.name}-${index}`}
                service={service}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
            {Array.from({ length: Math.max(0, limit - filtered.length) }, (_, index) => (
              <div
                key={`service-placeholder-${index}`}
                aria-hidden="true"
                className="y2k-card invisible min-h-28 pointer-events-none"
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-outline-variant">
            <span className="text-xs font-bold text-neutral-400">
              หน้า {page} จาก {totalPages} (ทั้งหมด {total} รายการ)
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
        title={selectedService ? "แก้ไขบริการ" : "เพิ่มบริการ"}
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
              form="service-form"
              type="submit"
              className="rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              บันทึก
            </button>
          </>
        }
      >
        <form id="service-form" onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อบริการ</span>
              <input
                required
                value={form.serviceName}
                onChange={(event) => updateForm("serviceName", event.target.value)}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ราคา</span>
              <input
                required
                min="0"
                type="number"
                value={form.servicePrice}
                onChange={(event) => updateForm("servicePrice", event.target.value)}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ระยะเวลา (นาที)</span>
              <input
                required
                min="0"
                type="number"
                value={form.duration}
                onChange={(event) => updateForm("duration", event.target.value)}
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">รูปภาพ URL</span>
              <input
                value={form.img}
                onChange={(event) => updateForm("img", event.target.value)}
                placeholder="https://..."
                className="w-full h-11 px-4 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">รายละเอียด</span>
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                rows={3}
                className="w-full resize-none px-4 py-3 bg-surface border-2 border-outline-variant focus:border-primary rounded-xl font-bold text-xs outline-none"
              />
            </label>
          </div>
        </form>
      </Y2KModal>

      <Y2KModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="ยืนยันการลบบริการ"
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
            ต้องการลบบริการ {selectedService?.name} ใช่ไหม?
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
        </div>
      </Y2KModal>
    </div>
  )
}
