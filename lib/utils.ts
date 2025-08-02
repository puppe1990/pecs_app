import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function calculateSuccessRate(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getPhaseColor(phase: number): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500', 
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500'
  ]
  return colors[phase - 1] || 'bg-gray-500'
}

export function playSuccessSound() {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    try {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }
}