'use client'

import { useState, useEffect, useCallback } from 'react'
import { PecsAction, PecsSession, UserProgress } from '@/types/pecs'
import { generateId } from '@/lib/utils'

export function usePecsSession(phaseId: number) {
  const [session, setSession] = useState<PecsSession | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('pecsProgress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setUserProgress(progress)
    } else {
      // Initialize new user progress
      const newProgress: UserProgress = {
        userId: 'user1',
        currentPhase: 1,
        phasesCompleted: [],
        totalSessions: 0,
        successRate: 0,
        lastActivity: new Date()
      }
      setUserProgress(newProgress)
      localStorage.setItem('pecsProgress', JSON.stringify(newProgress))
    }

    // Start new session
    const newSession: PecsSession = {
      id: generateId(),
      userId: 'user1',
      phase: phaseId,
      startTime: new Date(),
      actions: [],
      success: false
    }
    setSession(newSession)
  }, [phaseId])

  const recordAction = useCallback((action: Omit<PecsAction, 'id' | 'timestamp'>) => {
    const newAction: PecsAction = {
      ...action,
      id: generateId(),
      timestamp: new Date()
    }

    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        actions: [...prev.actions, newAction]
      }
    })
  }, [])

  const completeSession = useCallback((success: boolean) => {
    if (!session || !userProgress) return

    const completedSession: PecsSession = {
      ...session,
      endTime: new Date(),
      success
    }

    // Update user progress
    const correctActions = session.actions.filter(action => action.correct).length
    const totalActions = session.actions.length
    const sessionSuccessRate = totalActions > 0 ? (correctActions / totalActions) * 100 : 0

    const updatedProgress: UserProgress = {
      ...userProgress,
      totalSessions: userProgress.totalSessions + 1,
      successRate: ((userProgress.successRate * userProgress.totalSessions) + sessionSuccessRate) / (userProgress.totalSessions + 1),
      lastActivity: new Date()
    }

    // If session was successful and phase not completed, mark as completed
    if (success && !userProgress.phasesCompleted.includes(phaseId)) {
      updatedProgress.phasesCompleted.push(phaseId)
      updatedProgress.currentPhase = Math.max(updatedProgress.currentPhase, phaseId + 1)
    }

    setUserProgress(updatedProgress)
    localStorage.setItem('pecsProgress', JSON.stringify(updatedProgress))

    // Save session to localStorage (keep last 10 sessions)
    const savedSessions = JSON.parse(localStorage.getItem('pecsSessions') || '[]')
    const updatedSessions = [completedSession, ...savedSessions].slice(0, 10)
    localStorage.setItem('pecsSessions', JSON.stringify(updatedSessions))

    setSession(completedSession)
  }, [session, userProgress, phaseId])

  const getSessionStats = useCallback(() => {
    if (!session) return { correct: 0, total: 0, successRate: 0 }

    const correct = session.actions.filter(action => action.correct).length
    const total = session.actions.length
    const successRate = total > 0 ? Math.round((correct / total) * 100) : 0

    return { correct, total, successRate }
  }, [session])

  return {
    session,
    userProgress,
    recordAction,
    completeSession,
    getSessionStats
  }
}