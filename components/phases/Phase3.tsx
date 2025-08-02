'use client'

import { useState, useEffect } from 'react'
import { PecsImage, PecsAction } from '@/types/pecs'
import { PECS_IMAGES, getRandomImages, getImagesByCategory } from '@/lib/pecsData'
import { PecsImage as PecsImageComponent, PecsImageGrid } from '@/components/PecsImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { generateId, playSuccessSound } from '@/lib/utils'
import { CheckCircle, RotateCcw, Target, Shuffle, Eye } from 'lucide-react'

type DifficultyLevel = 'easy' | 'medium' | 'hard'

export default function Phase3Component() {
  const [targetImage, setTargetImage] = useState<PecsImage | null>(null)
  const [availableImages, setAvailableImages] = useState<PecsImage[]>([])
  const [selectedImage, setSelectedImage] = useState<PecsImage | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('easy')
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)

  useEffect(() => {
    initializeRound()
  }, [difficultyLevel])

  const initializeRound = () => {
    // Select target based on difficulty
    let target: PecsImage
    let distractors: PecsImage[]
    
    switch (difficultyLevel) {
      case 'easy':
        // 3 images, different categories
        target = PECS_IMAGES[Math.floor(Math.random() * PECS_IMAGES.length)]
        distractors = getRandomImages(2, [target.id])
        break
      case 'medium':
        // 6 images, some similar categories
        target = PECS_IMAGES[Math.floor(Math.random() * PECS_IMAGES.length)]
        const sameCategory = getImagesByCategory(target.category).filter(img => img.id !== target.id).slice(0, 2)
        const otherCategories = getRandomImages(3, [target.id, ...sameCategory.map(img => img.id)])
        distractors = [...sameCategory, ...otherCategories]
        break
      case 'hard':
        // 9 images, mostly same category
        target = PECS_IMAGES[Math.floor(Math.random() * PECS_IMAGES.length)]
        const sameCategoryHard = getImagesByCategory(target.category).filter(img => img.id !== target.id).slice(0, 6)
        const otherCategoriesHard = getRandomImages(2, [target.id, ...sameCategoryHard.map(img => img.id)])
        distractors = [...sameCategoryHard, ...otherCategoriesHard]
        break
    }
    
    setTargetImage(target)
    const allImages = [target, ...distractors].sort(() => Math.random() - 0.5)
    setAvailableImages(allImages)
    
    // Reset state
    setSelectedImage(null)
    setIsCorrect(null)
    setShowCelebration(false)
  }

  const handleImageSelect = (image: PecsImage) => {
    if (selectedImage?.id === image.id) {
      // Deselect if clicking the same image
      setSelectedImage(null)
      return
    }
    
    setSelectedImage(image)
    setAttempts(prev => prev + 1)
    
    const correct = image.id === targetImage?.id
    setIsCorrect(correct)
    
    if (correct) {
      setScore(prev => prev + 1)
      setCurrentRound(prev => prev + 1)
      setShowCelebration(true)
      playSuccessSound()
      
      // Auto advance after celebration
      setTimeout(() => {
        initializeRound()
      }, 2000)
    } else {
      // Show error feedback briefly
      setTimeout(() => {
        setSelectedImage(null)
        setIsCorrect(null)
      }, 1500)
    }
  }

  const getSuccessRate = () => {
    if (attempts === 0) return 0
    return Math.round((score / attempts) * 100)
  }

  const getDifficultyColor = (level: DifficultyLevel) => {
    switch (level) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
    }
  }

  const getDifficultyDescription = (level: DifficultyLevel) => {
    switch (level) {
      case 'easy': return '3 imagens de categorias diferentes'
      case 'medium': return '6 imagens com algumas similares'
      case 'hard': return '9 imagens da mesma categoria'
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <div className="text-2xl font-bold">{currentRound}</div>
            <div className="text-sm opacity-90">Rodada</div>
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-r text-white ${getDifficultyColor(difficultyLevel)}`}>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold capitalize">{difficultyLevel}</div>
            <div className="text-sm opacity-90">Nível</div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Selector */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Nível de Dificuldade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyLevel(level)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  difficultyLevel === level
                    ? `${getDifficultyColor(level)} text-white border-transparent`
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold capitalize mb-2">{level}</div>
                <div className="text-sm opacity-90">
                  {getDifficultyDescription(level)}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Image */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-green-500" />
            Encontre Esta Imagem
          </h3>
          {targetImage && (
            <div className="flex justify-center">
              <PecsImageComponent
                image={targetImage}
                size="lg"
                className="border-4 border-green-400 bg-green-50"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Selection Grid */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Escolha a Imagem Correta
          </h3>
          <div className={`grid gap-4 ${
            difficultyLevel === 'easy' ? 'grid-cols-3' :
            difficultyLevel === 'medium' ? 'grid-cols-3 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-3 md:grid-cols-3'
          }`}>
            {availableImages.map((image) => {
              const isSelected = selectedImage?.id === image.id
              const isTarget = image.id === targetImage?.id
              
              return (
                <div key={image.id} className="relative">
                  <PecsImageComponent
                    image={image}
                    selected={isSelected}
                    onClick={handleImageSelect}
                    size="md"
                    className={`transition-all duration-200 ${
                      isSelected
                        ? isCorrect === true
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : isCorrect === false
                          ? 'border-red-500 bg-red-50 ring-2 ring-red-200 error-shake'
                          : 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'hover:border-gray-400'
                    }`}
                  />
                  {isSelected && isCorrect === true && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  {isSelected && isCorrect === false && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        ✕
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {selectedImage && (
            <div className="mt-6 text-center">
              {isCorrect === true && (
                <div className="text-green-600 font-semibold text-lg">
                  🎉 Perfeito! Você encontrou a imagem correta!
                </div>
              )}
              {isCorrect === false && (
                <div className="text-red-600 font-semibold text-lg">
                  ❌ Não é esta imagem. Tente novamente!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Dicas para Discriminação Visual
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">Estratégias:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Compare formas e cores</li>
                <li>• Observe detalhes únicos</li>
                <li>• Identifique a categoria</li>
                <li>• Use características distintivas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Progressão:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Fácil: Categorias diferentes</li>
                <li>• Médio: Algumas semelhanças</li>
                <li>• Difícil: Mesma categoria</li>
                <li>• Pratique regularmente</li>
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
          <Shuffle className="w-4 h-4" />
          <span>Nova Imagem</span>
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
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Excelente Discriminação!
            </h2>
            <p className="text-gray-600">
              Você identificou corretamente a imagem entre todas as opções!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}