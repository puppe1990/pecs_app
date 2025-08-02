'use client'

import { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { PecsImage, PecsElement, PecsPhrase } from '@/types/pecs'
import { PECS_IMAGES, PECS_PHRASES, getRandomImages } from '@/lib/pecsData'
import { PecsImage as PecsImageComponent } from '@/components/PecsImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { generateId, playSuccessSound } from '@/lib/utils'
import { CheckCircle, RotateCcw, MessageSquare, Plus, Trash2 } from 'lucide-react'

export default function Phase4Component() {
  const [phraseStrip, setPhraseStrip] = useState<PecsElement[]>([])
  const [availableImages, setAvailableImages] = useState<PecsImage[]>([])
  const [availableStarters, setAvailableStarters] = useState(PECS_PHRASES.starters)
  const [targetPhrase, setTargetPhrase] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)

  const [{ isOver }, drop] = useDrop({
    accept: ['image', 'starter'],
    drop: (item: any) => {
      if (item.type === 'image') {
        addToPhrase({ type: 'image', content: item.image.id })
      } else if (item.type === 'starter') {
        addToPhrase({ type: 'text', content: item.text })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  useEffect(() => {
    initializeRound()
  }, [])

  const initializeRound = () => {
    // Clear phrase strip
    setPhraseStrip([])
    
    // Select random images
    const randomImages = getRandomImages(6)
    setAvailableImages(randomImages)
    
    // Set target phrase (for demonstration, we'll expect "Eu quero" + image)
    const targetImage = randomImages[0]
    setTargetPhrase(`Eu quero ${targetImage.name}`)
    
    // Reset state
    setIsCorrect(null)
    setShowCelebration(false)
  }

  const addToPhrase = (element: PecsElement) => {
    setPhraseStrip(prev => [...prev, element])
  }

  const removeFromPhrase = (index: number) => {
    setPhraseStrip(prev => prev.filter((_, i) => i !== index))
  }

  const clearPhrase = () => {
    setPhraseStrip([])
    setIsCorrect(null)
  }

  const checkPhrase = () => {
    setAttempts(prev => prev + 1)
    
    // Build phrase string
    const phraseText = phraseStrip.map(element => {
      if (element.type === 'text') {
        return element.content
      } else {
        const image = availableImages.find(img => img.id === element.content)
        return image?.name || ''
      }
    }).join(' ')
    
    const correct = phraseText.toLowerCase().trim() === targetPhrase.toLowerCase().trim()
    setIsCorrect(correct)
    
    if (correct) {
      setScore(prev => prev + 1)
      setCurrentRound(prev => prev + 1)
      setShowCelebration(true)
      playSuccessSound()
      
      setTimeout(() => {
        initializeRound()
      }, 3000)
    } else {
      setTimeout(() => {
        setIsCorrect(null)
      }, 2000)
    }
  }

  const getSuccessRate = () => {
    if (attempts === 0) return 0
    return Math.round((score / attempts) * 100)
  }

  const renderPhraseElement = (element: PecsElement, index: number) => {
    if (element.type === 'text') {
      return (
        <div
          key={index}
          className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3 flex items-center space-x-2 min-w-[100px] justify-center relative group"
        >
          <span className="font-semibold text-blue-800">{element.content}</span>
          <button
            onClick={() => removeFromPhrase(index)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )
    } else {
      const image = availableImages.find(img => img.id === element.content)
      if (!image) return null
      
      return (
        <div
          key={index}
          className="relative group"
        >
          <PecsImageComponent
            image={image}
            size="md"
            className="border-2 border-gray-300"
          />
          <button
            onClick={() => removeFromPhrase(index)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm opacity-90">Frases Corretas</div>
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
            <div className="text-2xl font-bold">{phraseStrip.length}</div>
            <div className="text-sm opacity-90">Elementos</div>
          </CardContent>
        </Card>
      </div>

      {/* Target Phrase */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            🎯 Monte esta frase:
          </h3>
          <div className="text-2xl font-bold text-yellow-900 text-center">
            {targetPhrase}
          </div>
        </CardContent>
      </Card>

      {/* Phrase Strip */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Tira de Frase
          </h3>
          <div
            ref={drop}
            className={`
              min-h-[120px] border-2 border-dashed rounded-lg p-4 flex items-center space-x-3 overflow-x-auto
              ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
              ${phraseStrip.length === 0 ? 'justify-center' : 'justify-start'}
            `}
          >
            {phraseStrip.length === 0 ? (
              <div className="text-center text-gray-500">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p>Arraste elementos aqui para formar uma frase</p>
                <p className="text-sm mt-1">Comece com "Eu quero" + imagem</p>
              </div>
            ) : (
              phraseStrip.map((element, index) => renderPhraseElement(element, index))
            )}
          </div>
          
          {/* Phrase Actions */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={clearPhrase}
              variant="outline"
              size="sm"
              disabled={phraseStrip.length === 0}
            >
              Limpar Frase
            </Button>
            <Button
              onClick={checkPhrase}
              variant="primary"
              disabled={phraseStrip.length < 2}
            >
              Verificar Frase
            </Button>
          </div>
          
          {/* Feedback */}
          {isCorrect === true && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-green-600 font-semibold bg-green-50 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Frase perfeita! Comunicação clara e efetiva!
              </div>
            </div>
          )}
          {isCorrect === false && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-red-600 font-semibold bg-red-50 rounded-lg px-4 py-2">
                ❌ Frase incorreta. Tente seguir o modelo: "Eu quero" + imagem
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phrase Starters */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Iniciadores de Frase
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {availableStarters.map((starter) => (
              <StarterCard key={starter.id} starter={starter} />
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
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableImages.map((image) => (
              <DraggableImage key={image.id} image={image} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📝 Como Formar Frases
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">Estrutura Básica:</h4>
              <ul className="space-y-1 text-sm">
                <li>1. Escolha um iniciador ("Eu quero")</li>
                <li>2. Adicione uma imagem do item</li>
                <li>3. Forme frases completas</li>
                <li>4. Pratique diferentes combinações</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Exemplos:</h4>
              <ul className="space-y-1 text-sm">
                <li>• "Eu quero" + 🍎 = "Eu quero maçã"</li>
                <li>• "Eu vejo" + ⚽ = "Eu vejo bola"</li>
                <li>• "Eu gosto" + 🍪 = "Eu gosto biscoito"</li>
                <li>• "Eu preciso" + 💧 = "Eu preciso água"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={initializeRound}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Frase</span>
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
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Comunicação Perfeita!
            </h2>
            <p className="text-gray-600">
              Você construiu uma frase completa e clara!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
function StarterCard({ starter }: { starter: { id: string; text: string; src: string } }) {
  const [{ isDragging }, drag] = useState(false)

  return (
    <div
      ref={drag}
      className={`
        bg-blue-100 border-2 border-blue-300 rounded-lg p-3 cursor-move transition-all duration-200
        hover:bg-blue-200 hover:border-blue-400 hover:scale-105
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="text-center">
        <div className="text-2xl mb-1">{starter.src}</div>
        <div className="text-sm font-semibold text-blue-800">{starter.text}</div>
      </div>
    </div>
  )
}

function DraggableImage({ image }: { image: PecsImage }) {
  return (
    <PecsImageComponent
      image={image}
      draggable={true}
      size="md"
      className="cursor-move hover:scale-105 transition-transform duration-200"
    />
  )
}