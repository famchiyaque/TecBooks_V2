import React from 'react'
import { cn } from '@/components/lib/utils'

/**
 * StatusBadge - Reusable status indicator component
 * @param {boolean} isActive - Whether the status is active/admin
 * @param {string} activeLabel - Label to show when active (default: "Admin")
 * @param {string} inactiveLabel - Label to show when inactive (default: "Standard")
 * @param {string} size - Size variant: "sm" | "md" | "lg"
 */
function StatusBadge({ 
  isActive, 
  activeLabel = "Admin", 
  inactiveLabel = "Normal",
  size = "md",
  className 
}) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
        isActive 
          ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
          : "bg-slate-100 text-slate-600 border border-slate-200",
        sizeClasses[size],
        className
      )}
    >
      <span 
        className={cn(
          "w-2 h-2 rounded-full",
          isActive ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  )
}

export default StatusBadge

