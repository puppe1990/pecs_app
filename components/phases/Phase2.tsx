'use client'

import { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { PecsImage, PecsAction } from '@/types/pecs'
import { PECS_IMAGES, getRandomImages } from '@/lib/pecsData'
import { PecsImage as PecsImageComponent } from '@/components/PecsImage'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { generateId, playSuccessSound } from '@/lib/utils'
import { CheckCircle, RotateCcw, MapPin, User, Navigation } from 'lucide-react'

interface Location {
  id: string
  name: string
  x: number
  y: number
  hasImage: boolean
  image?: PecsImage
}

export default function Phase2Component() {
  const [targetImage, setTargetImage] = useState<PecsImage | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [userPosition, setUserPosition] = useState({ x: 50, y: 80 })
  const [partnerPosition] = useState({ x: 50, y: 20 })
  const [selectedImage, setSelectedImage] = useState<PecsImage | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentDistance, setCurrentDistance] = useState(0)

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'image',
    drop: () => {
      if (selectedImage) {
        handleImageDelivery(selectedImage)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  useEffect(() => {
    initializeRound()
  }, [])

  useEffect(() => {
    // Calculate distance between user and partner
    const distance = Math.sqrt(
      Math.pow(userPosition.x - partnerPosition.x, 2) + 
      Math.pow(userPosition.y - partnerPosition.y, 2)
    )
    setCurrentDistance(Math.round(distance))
  }, [userPosition, partnerPosition])

  const initializeRound = () => {
    // Select target image
    const target = PECS_IMAGES[Math.floor(Math.random() * PECS_IMAGES.length)]
    setTargetImage(target)
    
    // Create random locations with images
    const randomImages = getRandomImages(4, [target.id])
    const allImages = [target, ...randomImages]
    
    const newLocations: Location[] = [
      { id: '1', name: 'Mesa 1', x: 20, y: 60, hasImage: true, image: allImages[0] },
      { id: '2', name: 'Mesa 2', x: 80, y: 60, hasImage: true, image: allImages[1] },
      { id: '3', name: 'Estante', x: 20, y: 40, hasImage: true, image: allImages[2] },
      { id: '4', name: 'Canto', x: 80, y: 40, hasImage: true, image: allImages[3] },
      { id: '5', name: 'Centro', x: 50, y: 50, hasImage: true, image: allImages[4] }
    ]
    
    setLocations(newLocations)
    setSelectedImage(null)
    setIsCorrect(null)
    setShowCelebration(false)
    
    // Reset user position
    setUserPosition({ x: 50, y: 80 })
  }

  const moveToLocation = (location: Location) => {
    setUserPosition({ x: location.x, y: location.y })
    if (location.image) {
      setSelectedImage(location.image)
    }
  }

  const handleImageDelivery = (image: PecsImage) => {
    setAttempts(prev => prev + 1)
    
    const correct = image.id === targetImage?.id
    setIsCorrect(correct)
    
    if (correct) {
      setScore(prev => prev + 1)
      setShowCelebration(true)
      playSuccessSound()
      
      setTimeout(() => {
        initializeRound()
      }, 2000)
    } else {
      setTimeout(() => {
        setSelectedImage(null)
        setIsCorrect(null)
        setUserPosition({ x: 50, y: 80 })
      }, 1500)
    }
  }

  const getSuccessRate = () => {
    if (attempts === 0) return 0
    return Math.round((score / attempts) * 100)
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
            <div className="text-2xl font-bold">{currentDistance}</div>
            <div className="text-sm opacity-90">Distância</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold">{selectedImage ? '✓' : '○'}</div>
            <div className="text-sm opacity-90">Imagem</div>
          </CardContent>
        </Card>
      </div>

      {/* Target Image */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Item Desejado pelo Parceiro
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

      {/* Room Map */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Navegue pela Sala e Encontre a Imagem
          </h3>
          <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8 h-96 border-2 border-gray-200">
            {/* Partner Position */}
            <div
              ref={drop}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                isOver && canDrop ? 'scale-110' : ''
              }`}
              style={{ left: `${partnerPosition.x}%`, top: `${partnerPosition.y}%` }}
            >
              <div className={`
                w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl
                ${isOver && canDrop ? 'border-green-500 bg-green-100' : 'border-blue-500 bg-blue-100'}
                transition-all duration-200
              `}>
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center mt-2 text-sm font-semibold text-blue-600">
                Parceiro
              </div>
              {selectedImage && isOver && (
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-lg p-2 shadow-lg border-2 border-green-400">
                    <PecsImageComponent image={selectedImage} size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* User Position */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${userPosition.x}%`, top: `${userPosition.y}%` }}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full border-4 border-green-600 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className="text-center mt-1 text-xs font-semibold text-green-600">
                Você
              </div>
              {selectedImage && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-lg p-1 shadow-lg border">
                    <PecsImageComponent image={selectedImage} size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Locations with Images */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
              >
                <button
                  onClick={() => moveToLocation(location)}
                  className="group relative"
                  disabled={userPosition.x === location.x && userPosition.y === location.y}
                >
                  <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-orange-500 hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4 text-white mx-auto mt-1" />
                  </div>
                  <div className="text-xs text-orange-600 text-center mt-1 font-medium">
                    {location.name}
                  </div>
                  {location.image && (
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white rounded-lg p-2 shadow-lg border">
                        <PecsImageComponent image={location.image} size="sm" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Clique nos pontos laranja para se mover pela sala. 
              {selectedImage ? ' Agora arraste sua imagem até o parceiro!' : ' Encontre a imagem correta primeiro.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      {selectedImage && (
        <Card className={`border-2 ${isCorrect === true ? 'border-green-400 bg-green-50' : isCorrect === false ? 'border-red-400 bg-red-50' : 'border-blue-400 bg-blue-50'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <h4 className="font-semibold text-gray-800">Imagem Selecionada:</h4>
                <PecsImageComponent image={selectedImage} size="md" />
              </div>
              {isCorrect === true && (
                <div className="flex items-center text-green-600 font-semibold">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Perfeito! Você entregou a imagem correta!
                </div>
              )}
              {isCorrect === false && (
                <div className="text-red-600 font-semibold">
                  Essa não é a imagem correta. Tente novamente!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={initializeRound}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar</span>
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
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Excelente!
            </h2>
            <p className="text-gray-600">
              Você conseguiu encontrar e entregar a imagem correta, mesmo à distância!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}