'use client'

import { useState, useEffect } from 'react'
import { PecsImage, PecsElement } from '@/types/pecs'
import { PECS_IMAGES, PECS_PHRASES, getRandomImages } from '@/lib/pecsData'
import { PecsImage as PecsImageComponent } from '@/components/PecsImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { generateId, playSuccessSound } from '@/lib/utils'
import { CheckCircle, RotateCcw, HelpCircle, MessageCircle, Volume2 } from 'lucide-react'

interface Question {
  id: string
  text: string
  expectedAnswer: string
  type: 'want' | 'see' | 'feel' | 'need'
  targetImage: PecsImage
}

export default function Phase5Component() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState<PecsElement[]>([])
  const [availableImages, setAvailableImages] = useState<PecsImage[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [questionHistory, setQuestionHistory] = useState<Question[]>([])

  useEffect(() => {
    generateNewQuestion()
  }, [])

  const generateNewQuestion = () => {
    // Select random images
    const randomImages = getRandomImages(8)
    setAvailableImages(randomImages)
    
    // Select target image and question type
    const targetImage = randomImages[0]
    const questionTypes = ['want', 'see', 'feel', 'need'] as const
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    
    // Create question based on type
    const questions = {
      want: { text: 'O que você quer?', expectedAnswer: 'Eu quero' },
      see: { text: 'O que você vê?', expectedAnswer: 'Eu vejo' },
      feel: { text: 'Como você se sente?', expectedAnswer: 'Eu sinto' },
      need: { text: 'Do que você precisa?', expectedAnswer: 'Eu preciso' }
    }
    
    const question: Question = {
      id: generateId(),
      text: questions[questionType].text,
      expectedAnswer: `${questions[questionType].expectedAnswer} ${targetImage.name}`,
      type: questionType,
      targetImage
    }
    
    setCurrentQuestion(question)
    setUserAnswer([])
    setIsCorrect(null)
    setShowCelebration(false)
  }

  const addToAnswer = (element: PecsElement) => {
    setUserAnswer(prev => [...prev, element])
  }

  const removeFromAnswer = (index: number) => {
    setUserAnswer(prev => prev.filter((_, i) => i !== index))
  }

  const clearAnswer = () => {
    setUserAnswer([])
    setIsCorrect(null)
  }

  const submitAnswer = () => {
    if (!currentQuestion) return
    
    setAttempts(prev => prev + 1)
    
    // Build answer string
    const answerText = userAnswer.map(element => {
      if (element.type === 'text') {
        return element.content
      } else {
        const image = availableImages.find(img => img.id === element.content)
        return image?.name || ''
      }
    }).join(' ')
    
    const correct = answerText.toLowerCase().trim() === currentQuestion.expectedAnswer.toLowerCase().trim()
    setIsCorrect(correct)
    
    if (correct) {
      setScore(prev => prev + 1)
      setCurrentRound(prev => prev + 1)
      setQuestionHistory(prev => [...prev, currentQuestion])
      setShowCelebration(true)
      playSuccessSound()
      
      setTimeout(() => {
        generateNewQuestion()
      }, 3000)
    } else {
      setTimeout(() => {
        setIsCorrect(null)
      }, 2000)
    }
  }

  const playQuestionAudio = () => {
    if (!currentQuestion) return
    
    // Simulated text-to-speech (in a real app, you'd use Web Speech API)
    console.log(`Speaking: ${currentQuestion.text}`)
    
    // Visual feedback for audio playing
    const button = document.getElementById('audio-button')
    if (button) {
      button.classList.add('animate-pulse')
      setTimeout(() => {
        button.classList.remove('animate-pulse')
      }, 2000)
    }
  }

  const getSuccessRate = () => {
    if (attempts === 0) return 0
    return Math.round((score / attempts) * 100)
  }

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'want': return '🙋'
      case 'see': return '👀'
      case 'feel': return '💭'
      case 'need': return '🆘'
      default: return '❓'
    }
  }

  const getAppropriateStarter = () => {
    if (!currentQuestion) return PECS_PHRASES.starters[0]
    
    const starterMap = {
      want: PECS_PHRASES.starters.find(s => s.id === 'want'),
      see: PECS_PHRASES.starters.find(s => s.id === 'see'),
      feel: PECS_PHRASES.starters.find(s => s.id === 'feel'),
      need: PECS_PHRASES.starters.find(s => s.id === 'need')
    }
    
    return starterMap[currentQuestion.type] || PECS_PHRASES.starters[0]
  }

  return (
    <div className="space-y-8">
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm opacity-90">Respostas Corretas</div>
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
            <div className="text-sm opacity-90">Perguntas</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-4xl">
                  {getQuestionTypeIcon(currentQuestion.type)}
                </div>
                <h2 className="text-2xl font-bold text-blue-800">
                  {currentQuestion.text}
                </h2>
                <Button
                  id="audio-button"
                  onClick={playQuestionAudio}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Visual Context - Show target image with subtle hint */}
              <div className="bg-white rounded-lg p-4 inline-block border-2 border-blue-200">
                <p className="text-sm text-blue-600 mb-2">Contexto visual:</p>
                <PecsImageComponent
                  image={currentQuestion.targetImage}
                  size="lg"
                  className="border-2 border-blue-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Construction Area */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
            Sua Resposta
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] bg-gray-50">
            {userAnswer.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <HelpCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Construa sua resposta usando as imagens e frases abaixo</p>
                <p className="text-sm mt-1">
                  Use a estrutura: "{getAppropriateStarter()?.text}" + imagem
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-3 flex-wrap">
                {userAnswer.map((element, index) => (
                  <div key={index} className="relative group">
                    {element.type === 'text' ? (
                      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3 font-semibold text-blue-800">
                        {element.content}
                      </div>
                    ) : (
                      <PecsImageComponent
                        image={availableImages.find(img => img.id === element.content)!}
                        size="md"
                      />
                    )}
                    <button
                      onClick={() => removeFromAnswer(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Answer Actions */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={clearAnswer}
              variant="outline"
              size="sm"
              disabled={userAnswer.length === 0}
            >
              Limpar
            </Button>
            <Button
              onClick={submitAnswer}
              variant="primary"
              disabled={userAnswer.length < 2}
            >
              Responder
            </Button>
          </div>
          
          {/* Feedback */}
          {isCorrect === true && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-green-600 font-semibold bg-green-50 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Resposta perfeita! Comunicação clara e adequada!
              </div>
            </div>
          )}
          {isCorrect === false && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-red-600 font-semibold bg-red-50 rounded-lg px-4 py-2">
                ❌ Resposta incorreta. Tente usar: "{getAppropriateStarter()?.text}" + imagem correta
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phrase Starter (Context-Appropriate) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Iniciador Apropriado
          </h3>
          <div className="flex justify-center">
            <button
              onClick={() => addToAnswer({ type: 'text', content: getAppropriateStarter()?.text || '' })}
              className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-200 transition-colors"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{getAppropriateStarter()?.src}</div>
                <div className="font-semibold text-blue-800">{getAppropriateStarter()?.text}</div>
              </div>
            </button>
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
              <button
                key={image.id}
                onClick={() => addToAnswer({ type: 'image', content: image.id })}
                className="transition-transform hover:scale-105"
              >
                <PecsImageComponent image={image} size="md" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Types Guide */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            💡 Tipos de Perguntas e Respostas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-700">
            <div>
              <h4 className="font-semibold mb-3">Perguntas Comuns:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">🙋</span>
                  <span>"O que você quer?" → "Eu quero [item]"</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👀</span>
                  <span>"O que você vê?" → "Eu vejo [item]"</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💭</span>
                  <span>"Como se sente?" → "Eu sinto [emoção]"</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🆘</span>
                  <span>"Do que precisa?" → "Eu preciso [item]"</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Dicas de Resposta:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Sempre use o iniciador apropriado</li>
                <li>• Escolha a imagem que responde à pergunta</li>
                <li>• Mantenha a estrutura simples e clara</li>
                <li>• Pratique diferentes tipos de pergunta</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={generateNewQuestion}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Pergunta</span>
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
              Resposta Excelente!
            </h2>
            <p className="text-gray-600">
              Você respondeu à pergunta de forma clara e apropriada!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}