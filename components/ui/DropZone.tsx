'use client'

import React from 'react'
import { useDrop } from 'react-dnd'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  onDrop: (item: any) => void
  accept: string | string[]
  children: React.ReactNode
  className?: string
  activeClassName?: string
  canDropClassName?: string
  disabled?: boolean
}

export function DropZone({
  onDrop,
  accept,
  children,
  className,
  activeClassName = 'border-blue-400 bg-blue-50',
  canDropClassName = 'border-green-400 bg-green-50',
  disabled = false
}: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: (item) => {
      if (!disabled) {
        onDrop(item)
      }
    },
    canDrop: () => !disabled,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <div
      ref={drop}
      className={cn(
        'drop-zone transition-all duration-200',
        isOver && canDrop && !disabled && activeClassName,
        canDrop && !disabled && canDropClassName,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </div>
  )
}