import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PECS - Sistema de Comunicação por Troca de Figuras',
  description: 'Sistema interativo para aprendizado do PECS (Picture Exchange Communication System) - comunicação através de imagens para pessoas com dificuldades de fala.',
  keywords: ['PECS', 'comunicação alternativa', 'autismo', 'educação especial', 'terapia'],
  authors: [{ name: 'PECS App' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'PECS - Sistema de Comunicação por Troca de Figuras',
    description: 'Aprenda comunicação através de imagens com nosso sistema interativo PECS',
    type: 'website',
    locale: 'pt_BR',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}