'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PECS_PHASES } from '@/lib/pecsData'
import { PecsPhase } from '@/types/pecs'
import Phase1Component from '@/components/phases/Phase1'
import Phase2Component from '@/components/phases/Phase2'
import Phase3Component from '@/components/phases/Phase3'
import Phase4Component from '@/components/phases/Phase4'
import Phase5Component from '@/components/phases/Phase5'
import Phase6Component from '@/components/phases/Phase6'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function PhasePage() {
  const params = useParams()
  const router = useRouter()
  const phaseId = parseInt(params.id as string)
  const [phase, setPhase] = useState<PecsPhase | null>(null)

  useEffect(() => {
    const foundPhase = PECS_PHASES.find(p => p.id === phaseId)
    if (foundPhase) {
      setPhase(foundPhase)
    } else {
      router.push('/')
    }
  }, [phaseId, router])

  if (!phase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const renderPhaseComponent = () => {
    switch (phaseId) {
      case 1:
        return <Phase1Component />
      case 2:
        return <Phase2Component />
      case 3:
        return <Phase3Component />
      case 4:
        return <Phase4Component />
      case 5:
        return <Phase5Component />
      case 6:
        return <Phase6Component />
      default:
        return <div>Fase não encontrada</div>
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <header className="bg-white shadow-lg border-b-4 border-primary-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar</span>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Início</span>
                </Link>
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  Fase {phase.id}: {phase.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {phase.description}
                </p>
              </div>
              
              <div className="w-32"></div> {/* Spacer for center alignment */}
            </div>
          </div>
        </header>

        {/* Instructions */}
        <section className="bg-primary-50 border-b border-primary-200">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-200">
              <h2 className="font-semibold text-gray-800 mb-2">Instruções:</h2>
              <p className="text-gray-600">
                {phase.instructions}
              </p>
            </div>
          </div>
        </section>

        {/* Phase Content */}
        <main className="container mx-auto px-4 py-8">
          {renderPhaseComponent()}
        </main>
      </div>
    </DndProvider>
  )
}