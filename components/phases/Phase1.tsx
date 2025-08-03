'use client'

import React, { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { PecsImage, PecsAction, UserProgress } from '@/types/pecs'
import { PECS_IMAGES, getRandomImages } from '@/lib/pecsData'
import { PecsImage as PecsImageComponent, PecsImageGrid } from '@/components/PecsImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { generateId, playSuccessSound } from '@/lib/utils'
import { CheckCircle, RotateCcw, Star, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Phase1Component() {
  const router = useRouter()
  const [targetImage, setTargetImage] = useState<PecsImage | null>(null)
  const [availableImages, setAvailableImages] = useState<PecsImage[]>([])
  const [droppedImage, setDroppedImage] = useState<PecsImage | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [sessionActions, setSessionActions] = useState<PecsAction[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [phaseCompleted, setPhaseCompleted] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'image',
    drop: (item: { image: PecsImage }) => {
      handleImageDrop(item.image)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const dropRefCallback = React.useCallback((node: HTMLDivElement | null) => {
    if (drop) {
      drop(node)
    }
  }, [drop])

  useEffect(() => {
    // Load user progress
    const savedProgress = localStorage.getItem('pecsProgress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
    initializeRound()
  }, [])

  const updateUserProgress = (success: boolean) => {
    const currentProgress = JSON.parse(localStorage.getItem('pecsProgress') || '{}')
    
    const updatedProgress: UserProgress = {
      userId: 'user1',
      currentPhase: currentProgress.currentPhase || 1,
      phasesCompleted: currentProgress.phasesCompleted || [],
      totalSessions: (currentProgress.totalSessions || 0) + 1,
      successRate: success ? 100 : (currentProgress.successRate || 0),
      lastActivity: new Date()
    }

    // If phase was completed successfully and not already marked as completed
    if (success && !updatedProgress.phasesCompleted.includes(1)) {
      updatedProgress.phasesCompleted.push(1)
      // Unlock next phase
      if (updatedProgress.currentPhase === 1) {
        updatedProgress.currentPhase = 2
      }
    }

    setUserProgress(updatedProgress)
    localStorage.setItem('pecsProgress', JSON.stringify(updatedProgress))
  }

  const initializeRound = () => {
    // Select a random target image
    const target = PECS_IMAGES[Math.floor(Math.random() * PECS_IMAGES.length)]
    setTargetImage(target)
    
    // Create array of images including the target and random others
    const otherImages = getRandomImages(5, [target.id])
    const allImages = [target, ...otherImages].sort(() => Math.random() - 0.5)
    setAvailableImages(allImages)
    
    // Reset state
    setDroppedImage(null)
    setIsCorrect(null)
    setShowCelebration(false)
  }

  const handleImageDrop = (image: PecsImage) => {
    const startTime = Date.now()
    setDroppedImage(image)
    setAttempts(prev => prev + 1)
    
    const correct = image.id === targetImage?.id
    setIsCorrect(correct)
    
    // Record action
    const action: PecsAction = {
      id: generateId(),
      type: 'image_exchange',
      imageId: image.id,
      timestamp: new Date(),
      correct,
      responseTime: startTime - Date.now()
    }
    setSessionActions(prev => [...prev, action])
    
    if (correct) {
      setScore(prev => prev + 1)
      setShowCelebration(true)
      playSuccessSound()
      
      // Mark phase as completed after 3 successful exchanges
      if (score + 1 >= 3) {
        setPhaseCompleted(true)
        updateUserProgress(true)
        
        // Show completion celebration
        setTimeout(() => {
          setShowCelebration(false)
          // Show phase completion modal
          setTimeout(() => {
            if (confirm('Parabéns! Você completou a Fase 1! Deseja ir para a próxima fase?')) {
              router.push('/phase/2')
            } else {
              router.push('/')
            }
          }, 1000)
        }, 2000)
      } else {
        // Auto advance after celebration
        setTimeout(() => {
          initializeRound()
        }, 2000)
      }
    } else {
      // Show error feedback
      setTimeout(() => {
        setDroppedImage(null)
        setIsCorrect(null)
      }, 1500)
    }
  }

  const getSuccessRate = () => {
    if (attempts === 0) return 0
    return Math.round((score / attempts) * 100)
  }

  const handleCompleteSession = () => {
    updateUserProgress(score >= 3)
    router.push('/')
  }

  return (
    <div className="space-y-8">
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm opacity-90">Acertos</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{attempts}</div>
            <div className="text-sm opacity-90">Tentativas</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{getSuccessRate()}%</div>
            <div className="text-sm opacity-90">Sucesso</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{sessionActions.length}</div>
            <div className="text-sm opacity-90">Ações</div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Progress */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Progresso da Fase 1
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-2xl font-bold text-yellow-600">{score}/3</div>
              <div className="flex-1 bg-yellow-200 rounded-full h-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((score / 3) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-yellow-600">
                {score >= 3 ? '✅ Completo!' : 'Trocas necessárias'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Exercise Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Target and Drop Zone */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Item Desejado
              </h3>
              {targetImage && (
                <div className="flex justify-center">
                  <PecsImageComponent
                    image={targetImage}
                    size="lg"
                    className="border-4 border-yellow-400 bg-yellow-50"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Parceiro de Comunicação
              </h3>
              <div
                ref={dropRefCallback}
                className={`
                  drop-zone min-h-[200px] flex items-center justify-center rounded-lg
                  ${isOver && canDrop ? 'can-drop' : ''}
                  ${isOver ? 'active' : ''}
                `}
              >
                {droppedImage ? (
                  <div className={`text-center ${showCelebration ? 'success-animation' : ''}`}>
                    <PecsImageComponent
                      image={droppedImage}
                      size="lg"
                      className={`mb-4 ${
                        isCorrect === true
                          ? 'border-4 border-green-500 bg-green-50'
                          : isCorrect === false
                          ? 'border-4 border-red-500 bg-red-50 error-shake'
                          : ''
                      }`}
                    />
                    {isCorrect === true && (
                      <div className="flex items-center justify-center text-green-600 font-semibold">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Excelente! Você conseguiu!
                      </div>
                    )}
                    {isCorrect === false && (
                      <div className="text-red-600 font-semibold">
                        Tente novamente!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <p>Arraste a imagem correta aqui</p>
                    <p className="text-sm mt-2">
                      O parceiro entregará o item desejado
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Images */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Escolha uma Imagem
              </h3>
              <PecsImageGrid
                images={availableImages}
                draggable={true}
                size="md"
                className="grid-cols-2 md:grid-cols-3"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={initializeRound}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Tentativa</span>
        </Button>
        
        <Button
          onClick={handleCompleteSession}
          variant="secondary"
        >
          Concluir Sessão
        </Button>
      </div>

      {/* Success Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl transform animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              {score >= 3 ? 'Fase Completa!' : 'Parabéns!'}
            </h2>
            <p className="text-gray-600">
              {score >= 3 
                ? 'Você completou a Fase 1 com sucesso!'
                : 'Você conseguiu fazer a troca corretamente!'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}