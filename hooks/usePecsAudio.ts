'use client'

import { useCallback, useRef } from 'react'

export function usePecsAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const initAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn('Audio context not supported:', error)
      }
    }
  }, [])

  const playSuccessSound = useCallback(() => {
    initAudioContext()
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      // Success melody: C4 -> E4 -> G4
      oscillator.frequency.setValueAtTime(261.63, audioContextRef.current.currentTime)
      oscillator.frequency.setValueAtTime(329.63, audioContextRef.current.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(392.00, audioContextRef.current.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.4)
      
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.4)
    } catch (error) {
      console.warn('Error playing success sound:', error)
    }
  }, [initAudioContext])

  const playErrorSound = useCallback(() => {
    initAudioContext()
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      // Error sound: Low buzz
      oscillator.frequency.setValueAtTime(110, audioContextRef.current.currentTime)
      oscillator.type = 'sawtooth'
      
      gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)
      
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.3)
    } catch (error) {
      console.warn('Error playing error sound:', error)
    }
  }, [initAudioContext])

  const playClickSound = useCallback(() => {
    initAudioContext()
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      // Click sound: Short beep
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
      
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.1)
    } catch (error) {
      console.warn('Error playing click sound:', error)
    }
  }, [initAudioContext])

  const speakText = useCallback((text: string, rate: number = 0.8, pitch: number = 1.0) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.lang = 'pt-BR'
      
      window.speechSynthesis.speak(utterance)
    } else {
      console.warn('Speech synthesis not supported')
    }
  }, [])

  return {
    playSuccessSound,
    playErrorSound,
    playClickSound,
    speakText
  }
}