import { Edit, Trash2 } from "lucide-react"

interface CardCrudActionsProps {
  itemName: string
  onEdit: () => void
  onDelete: () => void
}

export function CardCrudActions({ itemName, onEdit, onDelete }: CardCrudActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`แก้ไข ${itemName}`}
        title="แก้ไข"
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary/25 bg-white text-primary transition-colors hover:border-primary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
      >
        <Edit className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`ลบ ${itemName}`}
        title="ลบ"
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 active:scale-95"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
