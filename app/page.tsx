'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PECS_PHASES } from '@/lib/pecsData'
import { UserProgress } from '@/types/pecs'
import { getPhaseColor } from '@/lib/utils'
import { BookOpen, Star, Trophy, Users, MessageCircle, Target } from 'lucide-react'

const phaseIcons = [
  MessageCircle, // Fase 1
  Target,       // Fase 2  
  Star,         // Fase 3
  BookOpen,     // Fase 4
  Users,        // Fase 5
  Trophy        // Fase 6
]

export default function HomePage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: 'user1',
    currentPhase: 1,
    phasesCompleted: [],
    totalSessions: 0,
    successRate: 0,
    lastActivity: new Date()
  })

  const loadUserProgress = () => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('pecsProgress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }

  useEffect(() => {
    loadUserProgress()
    
    // Listen for storage changes (when user returns from a phase)
    const handleStorageChange = () => {
      loadUserProgress()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check for changes when the page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserProgress()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const getPhaseStatus = (phaseId: number) => {
    if (userProgress.phasesCompleted.includes(phaseId)) return 'completed'
    if (phaseId === userProgress.currentPhase) return 'current'
    if (phaseId < userProgress.currentPhase) return 'available'
    return 'locked'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'current': return 'bg-blue-500 text-white'
      case 'available': return 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      case 'locked': return 'bg-gray-100 text-gray-400'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const resetProgress = () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Isso não pode ser desfeito.')) {
      const initialProgress: UserProgress = {
        userId: 'user1',
        currentPhase: 1,
        phasesCompleted: [],
        totalSessions: 0,
        successRate: 0,
        lastActivity: new Date()
      }
      setUserProgress(initialProgress)
      localStorage.setItem('pecsProgress', JSON.stringify(initialProgress))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-primary-500">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sistema PECS
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Picture Exchange Communication System
            </p>
            <div className="text-sm text-gray-500">
              Comunicação através de imagens • 6 fases de aprendizado
            </div>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{userProgress.currentPhase}</div>
              <div className="text-sm opacity-90">Fase Atual</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{userProgress.phasesCompleted.length}/6</div>
              <div className="text-sm opacity-90">Fases Concluídas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{userProgress.totalSessions}</div>
              <div className="text-sm opacity-90">Sessões Realizadas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{userProgress.successRate}%</div>
              <div className="text-sm opacity-90">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Escolha uma Fase para Praticar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            O PECS é um sistema de comunicação que ensina pessoas com dificuldades de fala 
            a se comunicar usando imagens. Cada fase desenvolve habilidades específicas, 
            desde a troca simples de figuras até a construção de frases complexas.
          </p>
        </section>

        {/* Phases Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PECS_PHASES.map((phase, index) => {
            const status = getPhaseStatus(phase.id)
            const Icon = phaseIcons[index]
            const isLocked = status === 'locked'
            
            return (
              <div
                key={phase.id}
                className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-200 ${
                  isLocked 
                    ? 'border-gray-200 opacity-60' 
                    : 'border-gray-200 hover:border-primary-400 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                  {status === 'completed' && '✓ Concluída'}
                  {status === 'current' && '→ Atual'}
                  {status === 'available' && 'Disponível'}
                  {status === 'locked' && '🔒 Bloqueada'}
                </div>

                <div className="p-6">
                  {/* Phase Number and Icon */}
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getPhaseColor(phase.id)}`}>
                      {phase.id}
                    </div>
                    <Icon className="w-8 h-8 text-gray-600 ml-4" />
                  </div>

                  {/* Phase Info */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {phase.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {phase.description}
                  </p>
                  <p className="text-gray-500 text-xs mb-6">
                    {phase.instructions}
                  </p>

                  {/* Action Button */}
                  {isLocked ? (
                    <button 
                      disabled 
                      className="w-full py-3 px-4 bg-gray-200 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Complete a fase anterior
                    </button>
                  ) : (
                    <Link 
                      href={`/phase/${phase.id}`}
                      className="block w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-center transition-colors duration-200"
                    >
                      {status === 'completed' ? 'Praticar Novamente' : 'Iniciar Fase'}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </section>

        {/* Additional Information */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Sobre o PECS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Como Funciona</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Baseado em princípios da análise do comportamento aplicada
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Não utiliza prompts verbais para estimular autonomia
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Progressão estruturada em 6 fases sequenciais
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Pode apoiar o desenvolvimento da fala oral
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Benefícios</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Desenvolve comunicação funcional
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Promove independência e autonomia
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Melhora interação social
                </li>
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-2">•</span>
                  Reduz comportamentos desafiadores
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Reset Progress Button */}
        <section className="text-center mt-8">
          <button
            onClick={resetProgress}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Resetar Progresso
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            PECS App - Sistema interativo para aprendizado de comunicação alternativa
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Desenvolvido para apoiar terapeutas, educadores e famílias
          </p>
        </div>
      </footer>
    </div>
  )
}