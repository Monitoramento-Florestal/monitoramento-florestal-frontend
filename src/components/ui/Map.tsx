'use client'

interface MapProps {
  title?: string
}

export function Map({ title = 'Mapa de monitoramento' }: MapProps) {
  return (
    <div className="flex h-72 w-full items-center justify-center rounded-md border border-sage/30 bg-cream text-forest">
      {title}
    </div>
  )
}
