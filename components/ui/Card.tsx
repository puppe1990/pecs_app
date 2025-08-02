import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  clickable?: boolean
  selected?: boolean
  onClick?: () => void
}

export function Card({ children, className, clickable = false, selected = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg border-2 border-gray-200 transition-all duration-200",
        clickable && "cursor-pointer hover:border-primary-400 hover:shadow-xl transform hover:scale-105",
        selected && "border-primary-500 bg-primary-50 ring-2 ring-primary-200",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 border-b border-gray-200", className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 border-t border-gray-200", className)}>
      {children}
    </div>
  )
}