import React from "react"
import { X } from "lucide-react"

interface Y2KModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Y2KModal({ isOpen, onClose, title, children, footer }: Y2KModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-3 border-on-surface rounded-3xl shadow-[6px_6px_0px_#FB923C] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-primary-container/20 border-b-3 border-on-surface flex justify-between items-center">
          <h3 className="font-black text-base text-primary tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-on-surface bg-white flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all text-neutral-700 font-bold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-grow text-xs text-neutral-700 font-bold space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t-2 border-outline-variant/60 bg-neutral-50 flex gap-3 justify-end items-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
