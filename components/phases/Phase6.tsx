'use client'

import { useState, useEffect } from 'react'
import { PecsImage, PecsElement } from '@/types/pecs'
import { PECS_IMAGES, PECS_PHRASES, getRandomImages } from '@/lib/pecsData'
import { PecsImage as PecsImageComponent } from '@/components/PecsImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { generateId, playSuccessSound } from '@/lib/utils'
import { CheckCircle, RotateCcw, MessageSquare, Eye, Ear, Heart, Brain } from 'lucide-react'

interface CommunicativeFunction {
  id: string
  name: string
  icon: string
  description: string
  promptText: string
  expectedStarter: string
  scenarios: string[]
}

const COMMUNICATIVE_FUNCTIONS: CommunicativeFunction[] = [
  {
    id: 'comment_see',
    name: 'Comentar o que vê',
    icon: '👀',
    description: 'Fazer comentários sobre coisas que está vendo',
    promptText: 'Comente sobre o que você vê na imagem',
    expectedStarter: 'Eu vejo',
    scenarios: ['Na sala', 'No parque', 'Em casa', 'Na escola']
  },
  {
    id: 'comment_hear',
    name: 'Comentar o que ouve',
    icon: '👂',
    description: 'Fazer comentários sobre sons e músicas',
    promptText: 'Comente sobre o que você ouve',
    expectedStarter: 'Eu ouço',
    scenarios: ['Música tocando', 'Sons da natureza', 'Vozes', 'Barulhos']
  },
  {
    id: 'express_feelings',
    name: 'Expressar sentimentos',
    icon: '💝',
    description: 'Compartilhar emoções e sentimentos',
    promptText: 'Como você se sente sobre isso?',
    expectedStarter: 'Eu sinto',
    scenarios: ['Feliz', 'Triste', 'Animado', 'Calmo']
  },
  {
    id: 'share_thoughts',
    name: 'Compartilhar pensamentos',
    icon: '🤔',
    description: 'Expressar ideias e opiniões',
    promptText: 'O que você pensa sobre isso?',
    expectedStarter: 'Eu penso',
    scenarios: ['Opiniões', 'Ideias', 'Planos', 'Memórias']
  },
  {
    id: 'ask_questions',
    name: 'Fazer perguntas',
    icon: '❓',
    description: 'Iniciar comunicação fazendo perguntas',
    promptText: 'Que pergunta você faria?',
    expectedStarter: 'O que é',
    scenarios: ['Curiosidade', 'Informação', 'Ajuda', 'Esclarecimento']
  },
  {
    id: 'social_interaction',
    name: 'Interação social',
    icon: '🤝',
    description: 'Iniciar e manter conversas sociais',
    promptText: 'Como você iniciaria uma conversa?',
    expectedStarter: 'Eu gosto',
    scenarios: ['Cumprimentos', 'Convites', 'Agradecimentos', 'Despedidas']
  }
]

export default function Phase6Component() {
  const [currentFunction, setCurrentFunction] = useState<CommunicativeFunction | null>(null)
  const [currentScenario, setCurrentScenario] = useState<string>('')
  const [userResponse, setUserResponse] = useState<PecsElement[]>([])
  const [availableImages, setAvailableImages] = useState<PecsImage[]>([])
  const [contextImages, setContextImages] = useState<PecsImage[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [freeMode, setFreeMode] = useState(false)

  useEffect(() => {
    generateNewScenario()
  }, [])

  const generateNewScenario = () => {
    // Select random communicative function
    const randomFunction = COMMUNICATIVE_FUNCTIONS[Math.floor(Math.random() * COMMUNICATIVE_FUNCTIONS.length)]
    const randomScenario = randomFunction.scenarios[Math.floor(Math.random() * randomFunction.scenarios.length)]
    
    setCurrentFunction(randomFunction)
    setCurrentScenario(randomScenario)
    
    // Generate context and available images
    const context = getRandomImages(3)
    const available = getRandomImages(12)
    
    setContextImages(context)
    setAvailableImages(available)
    setUserResponse([])
    setIsCorrect(null)
    setShowCelebration(false)
  }

  const addToResponse = (element: PecsElement) => {
    setUserResponse(prev => [...prev, element])
  }

  const removeFromResponse = (index: number) => {
    setUserResponse(prev => prev.filter((_, i) => i !== index))
  }

  const clearResponse = () => {
    setUserResponse([])
    setIsCorrect(null)
  }

  const evaluateResponse = () => {
    if (!currentFunction) return
    
    setAttempts(prev => prev + 1)
    
    // In free mode, any response with appropriate structure is considered correct
    if (freeMode) {
      const hasStarter = userResponse.some(element => 
        element.type === 'text' && element.content.toLowerCase().includes('eu')
      )
      const hasContent = userResponse.length >= 2
      
      const correct = hasStarter && hasContent
      setIsCorrect(correct)
      
      if (correct) {
        setScore(prev => prev + 1)
        setCurrentRound(prev => prev + 1)
        setShowCelebration(true)
        playSuccessSound()
        
        setTimeout(() => {
          generateNewScenario()
        }, 3000)
      }
    } else {
      // Guided mode - check for expected starter
      const responseText = userResponse.map(element => {
        if (element.type === 'text') {
          return element.content
        } else {
          const image = availableImages.find(img => img.id === element.content) ||
                       contextImages.find(img => img.id === element.content)
          return image?.name || ''
        }
      }).join(' ')
      
      const hasExpectedStarter = responseText.toLowerCase().includes(currentFunction.expectedStarter.toLowerCase())
      const hasContent = userResponse.length >= 2
      
      const correct = hasExpectedStarter && hasContent
      setIsCorrect(correct)
      
      if (correct) {
        setScore(prev => prev + 1)
        setCurrentRound(prev => prev + 1)
        setShowCelebration(true)
        playSuccessSound()
        
        setTimeout(() => {
          generateNewScenario()
        }, 3000)
      }
    }
    
    if (!isCorrect) {
      setTimeout(() => {
        setIsCorrect(null)
      }, 2000)
    }
  }

  const getSuccessRate = () => {
    if (attempts === 0) return 0
    return Math.round((score / attempts) * 100)
  }

  const getFunctionIcon = (functionId: string) => {
    switch (functionId) {
      case 'comment_see': return <Eye className="w-6 h-6" />
      case 'comment_hear': return <Ear className="w-6 h-6" />
      case 'express_feelings': return <Heart className="w-6 h-6" />
      case 'share_thoughts': return <Brain className="w-6 h-6" />
      case 'ask_questions': return <MessageSquare className="w-6 h-6" />
      case 'social_interaction': return <span className="text-2xl">🤝</span>
      default: return <MessageSquare className="w-6 h-6" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm opacity-90">Sucessos</div>
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
            <div className="text-2xl font-bold">{currentRound}</div>
            <div className="text-sm opacity-90">Cenários</div>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-r text-white ${freeMode ? 'from-pink-500 to-pink-600' : 'from-indigo-500 to-indigo-600'}`}>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold">{freeMode ? 'Livre' : 'Guiado'}</div>
            <div className="text-sm opacity-90">Modo</div>
          </CardContent>
        </Card>
      </div>

      {/* Mode Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <span className="font-semibold text-gray-700">Modo de Prática:</span>
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setFreeMode(false)}
                className={`px-4 py-2 rounded-md transition-all ${
                  !freeMode 
                    ? 'bg-indigo-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                Guiado
              </button>
              <button
                onClick={() => setFreeMode(true)}
                className={`px-4 py-2 rounded-md transition-all ${
                  freeMode 
                    ? 'bg-pink-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                Livre
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {freeMode 
              ? 'Expresse-se livremente usando qualquer combinação'
              : 'Siga as orientações para funções comunicativas específicas'
            }
          </p>
        </CardContent>
      </Card>

      {/* Current Scenario */}
      {currentFunction && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-4xl">{currentFunction.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-purple-800">
                    {currentFunction.name}
                  </h2>
                  <p className="text-purple-600 text-sm">
                    {currentFunction.description}
                  </p>
                </div>
                {getFunctionIcon(currentFunction.id)}
              </div>
              
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <p className="text-lg font-semibold text-purple-800 mb-2">
                  {currentFunction.promptText}
                </p>
                <p className="text-purple-600">
                  Cenário: <span className="font-semibold">{currentScenario}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Context Images */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Contexto Visual
          </h3>
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {contextImages.map((image) => (
              <div key={image.id} className="text-center">
                <PecsImageComponent image={image} size="lg" className="border-2 border-gray-300 mb-2" />
                <p className="text-sm text-gray-600">{image.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Response Area */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Sua Comunicação
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] bg-gray-50">
            {userResponse.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-3">💭</div>
                <p>Monte sua comunicação usando elementos abaixo</p>
                <p className="text-sm mt-1">
                  {freeMode 
                    ? 'Expresse-se livremente'
                    : `Sugestão: Comece com "${currentFunction?.expectedStarter}"`
                  }
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                {userResponse.map((element, index) => (
                  <div key={index} className="relative group">
                    {element.type === 'text' ? (
                      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3 font-semibold text-blue-800">
                        {element.content}
                      </div>
                    ) : (
                      <PecsImageComponent
                        image={[...availableImages, ...contextImages].find(img => img.id === element.content)!}
                        size="md"
                      />
                    )}
                    <button
                      onClick={() => removeFromResponse(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Response Actions */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={clearResponse}
              variant="outline"
              size="sm"
              disabled={userResponse.length === 0}
            >
              Limpar
            </Button>
            <Button
              onClick={evaluateResponse}
              variant="primary"
              disabled={userResponse.length === 0}
            >
              Comunicar
            </Button>
          </div>
          
          {/* Feedback */}
          {isCorrect === true && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-green-600 font-semibold bg-green-50 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Excelente comunicação! Muito expressivo e claro!
              </div>
            </div>
          )}
          {isCorrect === false && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-orange-600 font-semibold bg-orange-50 rounded-lg px-4 py-2">
                💭 Tente uma comunicação mais completa. {!freeMode && `Use "${currentFunction?.expectedStarter}"`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phrase Starters */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Iniciadores de Comunicação
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PECS_PHRASES.starters.map((starter) => (
              <button
                key={starter.id}
                onClick={() => addToResponse({ type: 'text', content: starter.text })}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  !freeMode && currentFunction?.expectedStarter === starter.text
                    ? 'border-green-400 bg-green-50'
                    : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{starter.src}</div>
                  <div className="text-xs font-semibold text-blue-800">{starter.text}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Images */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Imagens Disponíveis
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {availableImages.map((image) => (
              <button
                key={image.id}
                onClick={() => addToResponse({ type: 'image', content: image.id })}
                className="transition-transform hover:scale-105"
              >
                <PecsImageComponent image={image} size="sm" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communicative Functions Guide */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            🎯 Funções Comunicativas Avançadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMUNICATIVE_FUNCTIONS.map((func) => (
              <div key={func.id} className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{func.icon}</span>
                  <h4 className="font-semibold text-indigo-800 text-sm">{func.name}</h4>
                </div>
                <p className="text-xs text-indigo-600 mb-2">{func.description}</p>
                <p className="text-xs text-indigo-700 font-medium">
                  Inicie com: "{func.expectedStarter}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={generateNewScenario}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Novo Cenário</span>
        </Button>
        
        <Button
          onClick={() => window.location.href = '/'}
          variant="secondary"
        >
          Concluir Sessão
        </Button>
      </div>

      {/* Success Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl transform animate-bounce">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">
              Comunicação Avançada!
            </h2>
            <p className="text-gray-600">
              Você demonstrou habilidades comunicativas complexas e funcionais!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}