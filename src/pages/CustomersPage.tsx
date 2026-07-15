import { CustomerRow } from "@/components/customers/CustomerRow"
import { LoadingPopup } from "@/components/LoadingPopup"
import { Button } from "@/components/ui/button"
import { Y2KModal } from "@/components/Y2KModal"
import { getApiErrorMessage } from "@/lib/apiError"
import { cn } from "@/lib/utils"
import {
  createUser,
  deleteUser,
  fetchCustomers,
  fetchUserById,
  getCustomerSummary,
  updateUser,
  type UserPayload,
} from "@/services/customerService"
import type { Customer } from "@/types"
import { AlertCircle, BadgeCheck, ChevronLeft, ChevronRight, LoaderCircle, Plus, Search, Trash2, Users } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"


type CustomerFormState = {
  name: string
  email: string
  age: string
}

const emptyForm: CustomerFormState = {
  name: "",
  email: "",
  age: "",
}

function toFormState(customer: Customer): CustomerFormState {
  return {
    name: customer.name,
    email: customer.email === "-" ? "" : customer.email,
    age: customer.age ? String(customer.age) : "",
  }
}

function toUserPayload(form: CustomerFormState): UserPayload {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    age: form.age ? Number(form.age) : undefined,
  }
}

export function CustomersPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const activeTag = "all"
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [form, setForm] = useState<CustomerFormState>(emptyForm)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    data,
    isLoading: loading,
    isFetching,
  } = useQuery({
    queryKey: ["customers", page, debouncedSearchQuery],
    queryFn: () => fetchCustomers({ page, limit, searchQuery: debouncedSearchQuery, activeTag }),
  })

  const customers = data?.customers ?? []
  const total = data?.total ?? 0
  const isOffline = data?.isOffline ?? false

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      setDebouncedSearchQuery(searchQuery)
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { totalRevenue, avgSpend } = getCustomerSummary(customers)
  const totalPages = Math.ceil(total / limit) || 1

  const openAddModal = () => {
    setSelectedCustomer(null)
    setForm(emptyForm)
    setShowFormModal(true)
  }

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer)
    setForm(toFormState(customer))
    setShowFormModal(true)

    void fetchUserById(customer.id).then((detail) => {
      setSelectedCustomer(detail)
      setForm(toFormState(detail))
    }).catch((error) => {
      console.warn("Unable to fetch user detail, using list data.", error)
    })
  }

  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDeleteModal(true)
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const payload = toUserPayload(form)

      if (selectedCustomer) {
        await updateUser(selectedCustomer.id, payload)
      } else {
        await createUser(payload)
      }

      await queryClient.invalidateQueries({ queryKey: ["customers"] })
      setShowFormModal(false)
      setSuccessMessage(selectedCustomer ? "แก้ไขข้อมูลลูกค้าเรียบร้อยแล้ว" : "เพิ่มลูกค้าใหม่เรียบร้อยแล้ว")
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Unable to save user.", error)
      setSuccessMessage(getApiErrorMessage(error, "บันทึกข้อมูลลูกค้าไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  const handleDelete = async () => {
    if (!selectedCustomer) return

    try {
      await deleteUser(selectedCustomer.id)
      await queryClient.invalidateQueries({ queryKey: ["customers"] })
      setShowDeleteModal(false)
      setSuccessMessage(`ลบข้อมูล ${selectedCustomer.name} เรียบร้อยแล้ว`)
      setSelectedCustomer(null)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Unable to delete user.", error)
      setSuccessMessage(getApiErrorMessage(error, "ลบข้อมูลลูกค้าไม่สำเร็จ"))
      setShowSuccessModal(true)
    }
  }

  const updateForm = <K extends keyof CustomerFormState>(key: K, value: CustomerFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="space-y-4">
      <LoadingPopup isOpen={loading} message="กำลังดึงข้อมูลลูกค้าจากเซิร์ฟเวอร์..." />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-baseline gap-2 text-2xl font-black tracking-tight text-on-surface">
            ลูกค้า
            <span className="text-base font-normal text-outline">({total})</span>
          </h1>
          {isOffline && (
            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ แสดงข้อมูลจำลอง (Offline Mode)
            </p>
          )}
        </div>
        <Button onClick={openAddModal} className="h-9 shrink-0 gap-1.5 rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-3 text-xs font-bold text-white shadow-[3px_3px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#1e1b4b]">
          <Plus className="h-4 w-4 stroke-[3px]" />
          เพิ่มลูกค้า
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "ลูกค้าทั้งหมด", value: total },
          { label: "รายได้รวม", value: `฿${(totalRevenue / 1000).toFixed(1)}K` },
          { label: "เฉลี่ยต่อคน", value: `฿${avgSpend.toLocaleString()}` },
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
          placeholder="ค้นหาชื่อ, เบอร์โทร หรืออีเมล..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          maxLength={100}
          className="h-10 w-full rounded-xl border-2 border-outline-variant bg-surface pl-10 pr-3 text-xs font-medium outline-none shadow-[2px_2px_0px_0px_#c7d2fe] transition-all placeholder:text-outline-variant focus:border-primary focus:ring-0"
        />
      </div>

      {customers.length === 0 ? (
        <div className="y2k-card p-12 text-center text-neutral-400">
          <Users className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p className="font-bold text-sm">ไม่พบรายชื่อลูกค้าที่ค้นหา</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            aria-busy={isFetching}
            className={cn("grid grid-cols-2 items-start gap-3 transition-opacity duration-200", isFetching && "opacity-60")}
          >
            {customers.map((customer) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
            {Array.from({ length: Math.max(0, limit - customers.length) }, (_, index) => (
              <div
                key={`customer-placeholder-${index}`}
                aria-hidden="true"
                className="glass-card invisible min-h-44 pointer-events-none"
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-outline-variant">
            <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
              {isFetching && <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />}
              หน้า {page} จาก {totalPages} (ทั้งหมด {total} คน)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                className={cn(
                  "p-2 rounded-xl border-2 transition-all",
                  page <= 1 || isFetching
                    ? "bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed"
                    : "bg-white border-on-surface text-on-surface hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_#1e1b4b]"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                className={cn(
                  "p-2 rounded-xl border-2 transition-all",
                  page >= totalPages || isFetching
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
        title={selectedCustomer ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
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
              type="submit"
              form="customer-form"
              className="rounded-xl border-2 border-on-surface bg-primary px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              {selectedCustomer ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
            </button>
          </>
        }
      >
        <form id="customer-form" onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">ชื่อ</span>
            <input
              required
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              maxLength={100}
              className="h-11 w-full rounded-xl border-2 border-outline-variant bg-surface px-4 text-xs font-bold outline-none focus:border-primary"
            />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">อีเมล</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              maxLength={150}
              className="h-11 w-full rounded-xl border-2 border-outline-variant bg-surface px-4 text-xs font-bold outline-none focus:border-primary"
            />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">อายุ</span>
            <input
              type="number"
              min="0"
              max="120"
              value={form.age}
              onChange={(event) => updateForm("age", event.target.value)}
              className="h-11 w-full rounded-xl border-2 border-outline-variant bg-surface px-4 text-xs font-bold outline-none focus:border-primary"
            />
          </label>
        </form>
      </Y2KModal>

      <Y2KModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="ยืนยันการลบลูกค้า"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl border-2 border-outline-variant bg-white px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl border-2 border-red-500 bg-red-500 px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#7f1d1d] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              ลบข้อมูล
            </button>
          </>
        }
      >
        <div className="space-y-3 py-3 text-center">
          <Trash2 className="mx-auto h-10 w-10 text-red-500" />
          <p className="text-sm font-black text-neutral-800">
            ต้องการลบข้อมูล {selectedCustomer?.name} ใช่ไหม?
          </p>
        </div>
      </Y2KModal>

      <Y2KModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="ผลการทำรายการ"
        footer={
          <button
            type="button"
            onClick={() => setShowSuccessModal(false)}
            className="w-full rounded-xl border-2 border-on-surface bg-gradient-to-r from-primary to-secondary px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_#1e1b4b] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95"
          >
            ตกลง
          </button>
        }
      >
        <div className="space-y-3 py-4 text-center">
          <BadgeCheck className="mx-auto h-12 w-12 text-emerald-500" />
          <p className="text-sm font-black text-neutral-800">{successMessage}</p>
        </div>
      </Y2KModal>
    </div>
  )
}
