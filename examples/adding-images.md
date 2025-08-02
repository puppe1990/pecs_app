# Como Adicionar Novas Imagens ao PECS

Este guia explica como adicionar novas imagens ao sistema PECS.

## Estrutura de uma Imagem PECS

```typescript
interface PecsImage {
  id: string;                    // Identificador único
  name: string;                  // Nome da imagem
  src: string;                   // Emoji ou URL da imagem
  category: 'food' | 'toys' | 'activities' | 'people' | 'places' | 'emotions' | 'actions' | 'objects';
  description?: string;          // Descrição opcional
}
```

## Categorias Disponíveis

- **food**: Alimentos e bebidas
- **toys**: Brinquedos e jogos
- **activities**: Atividades e ações
- **people**: Pessoas e relações
- **places**: Lugares e locais
- **emotions**: Emoções e sentimentos
- **actions**: Ações e verbos
- **objects**: Objetos diversos

## Adicionando Novas Imagens

1. **Abra o arquivo** `lib/pecsData.ts`

2. **Encontre o array** `PECS_IMAGES`

3. **Adicione sua nova imagem** seguindo o formato:

```typescript
{
  id: 'categoria_nome',           // Ex: 'food_pizza'
  name: 'Nome da Imagem',         // Ex: 'Pizza'
  src: '🍕',                      // Emoji ou URL
  category: 'food',               // Categoria apropriada
  description: 'Uma pizza deliciosa' // Descrição opcional
}
```

## Exemplos de Novas Imagens

### Alimentos
```typescript
{ id: 'food_pizza', name: 'Pizza', src: '🍕', category: 'food', description: 'Uma pizza deliciosa' },
{ id: 'food_ice_cream', name: 'Sorvete', src: '🍦', category: 'food', description: 'Sorvete gelado' },
{ id: 'food_chocolate', name: 'Chocolate', src: '🍫', category: 'food', description: 'Chocolate doce' }
```

### Atividades
```typescript
{ id: 'activity_swim', name: 'Nadar', src: '🏊', category: 'activities', description: 'Atividade de natação' },
{ id: 'activity_dance', name: 'Dançar', src: '💃', category: 'activities', description: 'Atividade de dança' },
{ id: 'activity_cook', name: 'Cozinhar', src: '👨‍🍳', category: 'activities', description: 'Atividade de culinária' }
```

### Emoções
```typescript
{ id: 'emotion_excited', name: 'Animado', src: '🤩', category: 'emotions', description: 'Sentimento de animação' },
{ id: 'emotion_calm', name: 'Calmo', src: '😌', category: 'emotions', description: 'Sentimento de calma' },
{ id: 'emotion_surprised', name: 'Surpreso', src: '😲', category: 'emotions', description: 'Sentimento de surpresa' }
```

## Usando Imagens Personalizadas

Para usar imagens personalizadas (não emojis):

1. **Adicione a imagem** à pasta `public/images/`

2. **Use o caminho** como src:

```typescript
{
  id: 'custom_image',
  name: 'Minha Imagem',
  src: '/images/minha-imagem.png',
  category: 'objects',
  description: 'Imagem personalizada'
}
```

## Boas Práticas

### Nomenclatura de IDs
- Use formato `categoria_nome` em minúsculas
- Use underscore `_` para separar palavras
- Mantenha consistência com IDs existentes

### Nomes de Imagens
- Use nomes claros e descritivos
- Mantenha a linguagem consistente (português)
- Evite nomes muito longos

### Categorização
- Escolha a categoria mais apropriada
- Considere como a imagem será usada
- Mantenha consistência com categorizações existentes

### Descrições
- Forneça descrições úteis para acessibilidade
- Seja conciso mas informativo
- Use linguagem clara e simples

## Testando Novas Imagens

Após adicionar novas imagens:

1. **Reinicie o servidor** de desenvolvimento
2. **Teste nas diferentes fases** onde a imagem pode aparecer
3. **Verifique a funcionalidade** de drag-and-drop
4. **Confirme a categorização** nas fases que usam categorias específicas

## Exemplo Completo

```typescript
// Adicionando uma nova categoria de transportes
{ id: 'transport_car', name: 'Carro', src: '🚗', category: 'objects', description: 'Veículo automotor' },
{ id: 'transport_bus', name: 'Ônibus', src: '🚌', category: 'objects', description: 'Transporte público' },
{ id: 'transport_bike', name: 'Bicicleta', src: '🚲', category: 'objects', description: 'Meio de transporte' },
{ id: 'transport_airplane', name: 'Avião', src: '✈️', category: 'objects', description: 'Transporte aéreo' }
```

## Considerações de Acessibilidade

- Certifique-se de que as imagens tenham bom contraste
- Forneça descrições detalhadas
- Teste com usuários reais quando possível
- Considere diferentes necessidades visuais

## Mantendo a Organização

- Agrupe imagens relacionadas
- Mantenha ordem alfabética dentro das categorias
- Documente mudanças significativas
- Considere criar subcategorias se necessário