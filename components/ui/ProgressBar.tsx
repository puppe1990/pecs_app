'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'md',
  variant = 'default'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const variantClasses = {
    default: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    error: 'bg-gradient-to-r from-red-400 to-red-600'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progresso</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}