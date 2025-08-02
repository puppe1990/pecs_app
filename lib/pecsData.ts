import { PecsImage, PecsPhase } from '@/types/pecs'

export const PECS_IMAGES: PecsImage[] = [
  // Food items
  { id: 'food_apple', name: 'Maçã', src: '🍎', category: 'food', description: 'Uma maçã vermelha' },
  { id: 'food_banana', name: 'Banana', src: '🍌', category: 'food', description: 'Uma banana amarela' },
  { id: 'food_cookie', name: 'Biscoito', src: '🍪', category: 'food', description: 'Um biscoito doce' },
  { id: 'food_milk', name: 'Leite', src: '🥛', category: 'food', description: 'Um copo de leite' },
  { id: 'food_sandwich', name: 'Sanduíche', src: '🥪', category: 'food', description: 'Um sanduíche' },
  { id: 'food_water', name: 'Água', src: '💧', category: 'food', description: 'Água para beber' },
  
  // Toys
  { id: 'toy_ball', name: 'Bola', src: '⚽', category: 'toys', description: 'Uma bola para jogar' },
  { id: 'toy_car', name: 'Carro', src: '🚗', category: 'toys', description: 'Um carrinho de brinquedo' },
  { id: 'toy_puzzle', name: 'Quebra-cabeça', src: '🧩', category: 'toys', description: 'Um quebra-cabeça' },
  { id: 'toy_teddy', name: 'Ursinho', src: '🧸', category: 'toys', description: 'Um ursinho de pelúcia' },
  { id: 'toy_blocks', name: 'Blocos', src: '🧱', category: 'toys', description: 'Blocos de construção' },
  
  // Activities
  { id: 'activity_play', name: 'Brincar', src: '🎮', category: 'activities', description: 'Atividade de brincar' },
  { id: 'activity_read', name: 'Ler', src: '📚', category: 'activities', description: 'Atividade de leitura' },
  { id: 'activity_music', name: 'Música', src: '🎵', category: 'activities', description: 'Ouvir música' },
  { id: 'activity_draw', name: 'Desenhar', src: '🎨', category: 'activities', description: 'Atividade de desenho' },
  { id: 'activity_walk', name: 'Caminhar', src: '🚶', category: 'activities', description: 'Atividade de caminhada' },
  
  // People
  { id: 'people_mom', name: 'Mamãe', src: '👩', category: 'people', description: 'Mamãe' },
  { id: 'people_dad', name: 'Papai', src: '👨', category: 'people', description: 'Papai' },
  { id: 'people_teacher', name: 'Professor', src: '👩‍🏫', category: 'people', description: 'Professor(a)' },
  { id: 'people_friend', name: 'Amigo', src: '👦', category: 'people', description: 'Um amigo' },
  
  // Emotions
  { id: 'emotion_happy', name: 'Feliz', src: '😊', category: 'emotions', description: 'Sentimento de felicidade' },
  { id: 'emotion_sad', name: 'Triste', src: '😢', category: 'emotions', description: 'Sentimento de tristeza' },
  { id: 'emotion_angry', name: 'Bravo', src: '😠', category: 'emotions', description: 'Sentimento de raiva' },
  { id: 'emotion_tired', name: 'Cansado', src: '😴', category: 'emotions', description: 'Sentimento de cansaço' },
  
  // Actions
  { id: 'action_eat', name: 'Comer', src: '🍽️', category: 'actions', description: 'Ação de comer' },
  { id: 'action_drink', name: 'Beber', src: '🥤', category: 'actions', description: 'Ação de beber' },
  { id: 'action_sleep', name: 'Dormir', src: '💤', category: 'actions', description: 'Ação de dormir' },
  { id: 'action_help', name: 'Ajudar', src: '🤝', category: 'actions', description: 'Ação de ajudar' },
]

export const PECS_PHRASES = {
  starters: [
    { id: 'want', text: 'Eu quero', src: '🙋' },
    { id: 'see', text: 'Eu vejo', src: '👀' },
    { id: 'feel', text: 'Eu sinto', src: '💭' },
    { id: 'need', text: 'Eu preciso', src: '🆘' },
    { id: 'like', text: 'Eu gosto', src: '❤️' },
  ],
  connectors: [
    { id: 'and', text: 'e', src: '➕' },
    { id: 'with', text: 'com', src: '🤝' },
    { id: 'more', text: 'mais', src: '⬆️' },
  ]
}

export const PECS_PHASES: PecsPhase[] = [
  {
    id: 1,
    name: "Troca de Figuras",
    description: "Aprender a entregar uma imagem de um item desejado",
    instructions: "Escolha uma imagem e arraste para o parceiro de comunicação para receber o item desejado.",
    completed: false
  },
  {
    id: 2,
    name: "Distância e Persistência", 
    description: "Buscar e entregar imagens em diferentes lugares",
    instructions: "Encontre a imagem correta em diferentes locais e entregue ao parceiro, mesmo à distância.",
    completed: false
  },
  {
    id: 3,
    name: "Discriminação de Figuras",
    description: "Escolher entre múltiplas imagens a correta",
    instructions: "Observe várias imagens e escolha aquela que representa o que você quer.",
    completed: false
  },
  {
    id: 4,
    name: "Estrutura de Frases",
    description: "Construir frases simples usando tira de frase",
    instructions: "Monte frases combinando 'Eu quero' + imagem do item para se comunicar.",
    completed: false
  },
  {
    id: 5,
    name: "Responder Perguntas",
    description: "Responder perguntas usando a tira de frase",
    instructions: "Use a tira de frase para responder perguntas como 'O que você quer?'.",
    completed: false
  },
  {
    id: 6,
    name: "Comentários e Funções Comunicativas",
    description: "Fazer comentários e comunicação avançada",
    instructions: "Aprenda a comentar e responder perguntas como 'O que você vê?' e 'O que ouviu?'.",
    completed: false
  }
]

export function getImagesByCategory(category: string): PecsImage[] {
  return PECS_IMAGES.filter(image => image.category === category)
}

export function getRandomImages(count: number, excludeIds: string[] = []): PecsImage[] {
  const availableImages = PECS_IMAGES.filter(img => !excludeIds.includes(img.id))
  const shuffled = [...availableImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function getImageById(id: string): PecsImage | undefined {
  return PECS_IMAGES.find(image => image.id === id)
}