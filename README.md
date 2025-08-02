# PECS App - Sistema de Comunicação por Troca de Figuras

Um sistema web interativo desenvolvido em Next.js para aprendizado do PECS (Picture Exchange Communication System), um método de comunicação alternativa que utiliza imagens para facilitar a comunicação de pessoas com dificuldades de fala, especialmente crianças com autismo.

## 🎯 Sobre o PECS

O PECS é um sistema estruturado em 6 fases sequenciais que ensina comunicação funcional através de imagens:

1. **Fase 1 - Troca de Figuras**: Aprender a entregar uma imagem por um item desejado
2. **Fase 2 - Distância e Persistência**: Buscar e entregar imagens em diferentes lugares
3. **Fase 3 - Discriminação de Figuras**: Escolher a imagem correta entre múltiplas opções
4. **Fase 4 - Estrutura de Frases**: Construir frases simples usando "tira de frase"
5. **Fase 5 - Responder Perguntas**: Usar estruturas para responder perguntas
6. **Fase 6 - Comentários e Funções Comunicativas**: Comunicação avançada e comentários

## ✨ Funcionalidades

### 🏠 Página Principal
- Dashboard com progresso do usuário
- Visão geral das 6 fases do PECS
- Sistema de desbloqueio progressivo
- Estatísticas de desempenho

### 🎮 Fases Interativas

#### Fase 1 - Troca de Figuras
- Interface drag-and-drop intuitiva
- Feedback visual e sonoro
- Sistema de pontuação
- Celebrações de sucesso

#### Fase 2 - Distância e Persistência
- Mapa interativo da sala
- Navegação entre diferentes locais
- Simulação de distância e movimento
- Entrega de imagens ao parceiro

#### Fase 3 - Discriminação Visual
- Três níveis de dificuldade
- Exercícios de discriminação visual
- Categorização de imagens
- Feedback instantâneo

#### Fase 4 - Estrutura de Frases
- Construção de frases com drag-and-drop
- Iniciadores de frase pré-definidos
- Validação de estrutura gramatical
- Sistema de "tira de frase"

#### Fase 5 - Responder Perguntas
- Perguntas contextuais variadas
- Respostas estruturadas
- Audio simulado para perguntas
- Tipos: "O que você quer?", "O que você vê?", etc.

#### Fase 6 - Comunicação Avançada
- Funções comunicativas complexas
- Modo livre e guiado
- Comentários e interações sociais
- Cenários variados

### 🎨 Interface e Design
- Design responsivo e acessível
- Cores e animações amigáveis
- Componentes visuais claros
- Suporte a diferentes dispositivos

### 📊 Sistema de Progresso
- Acompanhamento de estatísticas
- Persistência de dados local
- Taxa de sucesso
- Histórico de sessões

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React DnD** - Drag and drop functionality
- **Lucide React** - Ícones modernos
- **Local Storage** - Persistência de dados

## 🛠️ Instalação e Execução

1. **Clone o repositório**
```bash
git clone <repository-url>
cd pecs_app
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
pecs_app/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── phase/[id]/        # Páginas dinâmicas das fases
├── components/            # Componentes React
│   ├── ui/                # Componentes de interface
│   ├── phases/            # Componentes específicos das fases
│   └── PecsImage.tsx      # Componente de imagem PECS
├── lib/                   # Utilitários e dados
│   ├── utils.ts           # Funções auxiliares
│   └── pecsData.ts        # Dados do PECS (imagens, fases)
├── types/                 # Definições TypeScript
│   └── pecs.ts            # Tipos do sistema PECS
└── public/                # Arquivos estáticos
```

## 🎯 Uso Educacional

### Para Terapeutas
- Ferramenta de apoio em sessões de terapia
- Acompanhamento de progresso estruturado
- Exercícios progressivos e organizados
- Material visual consistente

### Para Educadores
- Recurso em sala de aula
- Atividades interativas
- Desenvolvimento de comunicação
- Suporte para inclusão

### Para Famílias
- Prática em casa
- Continuidade do aprendizado
- Interface amigável
- Progresso visível

## 🌟 Características Técnicas

### Acessibilidade
- Suporte a navegação por teclado
- Contrastes adequados
- Textos alternativos em imagens
- Responsivo para diferentes telas

### Performance
- Componentes otimizados
- Carregamento eficiente
- Cache de dados local
- Animações suaves

### Usabilidade
- Interface intuitiva
- Feedback imediato
- Progressão clara
- Instruções contextuais

## 🔧 Personalização

### Adicionar Novas Imagens
Edite o arquivo `lib/pecsData.ts` para incluir novas imagens:

```typescript
export const PECS_IMAGES: PecsImage[] = [
  {
    id: 'custom_image',
    name: 'Nome da Imagem',
    src: '🆕', // Emoji ou URL
    category: 'categoria',
    description: 'Descrição da imagem'
  },
  // ... outras imagens
]
```

### Modificar Fases
Cada fase possui seu próprio componente em `components/phases/` que pode ser customizado conforme necessário.

## 📈 Roadmap

- [ ] Sistema de usuários múltiplos
- [ ] Relatórios detalhados de progresso
- [ ] Biblioteca de imagens expandida
- [ ] Suporte a áudio personalizado
- [ ] Integração com dispositivos de CAA
- [ ] Modo offline completo
- [ ] Exportação de dados
- [ ] Temas personalizáveis

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Faça um push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas, sugestões ou suporte, entre em contato através das issues do GitHub.

---

Desenvolvido com ❤️ para apoiar a comunicação alternativa e inclusão digital.