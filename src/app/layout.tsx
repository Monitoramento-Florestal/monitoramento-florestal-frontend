import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import '@/styles/globals.css'
import '@/styles/themes.css'
import { AppProviders } from "@/components/providers/AppProviders";

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
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
