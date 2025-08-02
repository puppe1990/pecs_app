'use client'

import React from 'react'
import { useDrag } from 'react-dnd'
import { PecsImage as PecsImageType, DragItem } from '@/types/pecs'
import { cn } from '@/lib/utils'

interface PecsImageProps {
  image: PecsImageType
  selected?: boolean
  draggable?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: (image: PecsImageType) => void
  className?: string
}

export function PecsImage({ 
  image, 
  selected = false, 
  draggable = false, 
  size = 'md',
  onClick,
  className 
}: PecsImageProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { id: image.id, type: 'image', image } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: draggable,
  })

  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-6xl'
  }

  const handleClick = () => {
    if (onClick) {
      onClick(image)
    }
  }

  return (
    <div
      ref={draggable ? drag : undefined}
      className={cn(
        'pecs-card p-4 transition-all duration-200',
        selected && 'selected',
        isDragging && 'dragging opacity-50',
        onClick && 'cursor-pointer',
        sizes[size],
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Imagem: ${image.name}. ${image.description || ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="pecs-emoji text-center mb-2">
          {image.src}
        </div>
        <div className="pecs-text text-xs font-medium text-gray-700 text-center leading-tight">
          {image.name}
        </div>
      </div>
    </div>
  )
}

export function PecsImageGrid({ 
  images, 
  selectedImages = [], 
  onImageClick,
  draggable = false,
  size = 'md',
  maxSelection = 1,
  className
}: {
  images: PecsImageType[]
  selectedImages?: string[]
  onImageClick?: (image: PecsImageType) => void
  draggable?: boolean
  size?: 'sm' | 'md' | 'lg'
  maxSelection?: number
  className?: string
}) {
  const handleImageClick = (image: PecsImageType) => {
    if (onImageClick) {
      onImageClick(image)
    }
  }

  return (
    <div className={cn(
      'grid gap-4',
      size === 'sm' && 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10',
      size === 'md' && 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
      size === 'lg' && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      className
    )}>
      {images.map((image) => (
        <PecsImage
          key={image.id}
          image={image}
          selected={selectedImages.includes(image.id)}
          draggable={draggable}
          size={size}
          onClick={handleImageClick}
        />
      ))}
    </div>
  )
}