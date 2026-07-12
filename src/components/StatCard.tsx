import React from "react"
import { useNavigate } from "react-router-dom"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: React.ReactNode
  color: string
  to?: string
}

export function StatCard({ icon, label, value, sub, color, to }: StatCardProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => to && navigate(to)}
      className="y2k-card p-5 flex flex-col gap-3 relative overflow-hidden group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 shadow-[2px_2px_0px_currentColor] ${color}`}>
          {icon}
        </div>
        <span className="font-bold text-xs text-on-surface uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-3 mt-2">
        <span className="font-black text-3xl text-on-surface">{value}</span>
        {sub}
      </div>
    </div>
  )
}
