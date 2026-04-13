import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.css'
import '@/styles/themes.css'

export const metadata: Metadata = {
  title: 'Projeto Monitoramento Florestal',
  description: 'Página inicial do projeto de monitoramento florestal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
