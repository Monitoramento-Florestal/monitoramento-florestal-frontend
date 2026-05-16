import { Leaf, Map, Trees, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { CitizenMetricCard } from './CitizenMetricCard'

const CITIZEN_METRICS = [
  {
    key: 'cataloged',
    icon: Trees,
    label: 'Árvores catalogadas',
    tone: 'burgundy' as const,
    value: 42,
  },
  {
    key: 'healthy',
    icon: Leaf,
    label: 'Saudáveis',
    tone: 'sage' as const,
    value: 30,
  },
  {
    key: 'monitoring',
    icon: TriangleAlert,
    label: 'Sob acompanhamento',
    tone: 'rosewood' as const,
    value: 7,
  },
]

export function CitizenDashboardHome() {
  return (
    <section aria-labelledby="citizen-dashboard-title" className="max-w-6xl">
      <h2 id="citizen-dashboard-title" className="sr-only">
        Resumo do dashboard cidadão
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {CITIZEN_METRICS.map((metric) => (
          <CitizenMetricCard
            key={metric.key}
            icon={metric.icon}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button
          href={APP_ROUTES.CITIZEN_MAP}
          icon={Map}
          iconSide="left"
          text="Abrir mapa"
          className="h-10 rounded-md px-5 text-sm"
        />
      </div>
    </section>
  )
}
