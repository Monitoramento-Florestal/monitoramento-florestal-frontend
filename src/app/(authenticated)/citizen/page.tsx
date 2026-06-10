'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Leaf, Map, Trees, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { useAuthContext } from '@/contexts/AuthContext'
import { fetchDashboardPublico } from '@/services/dashboard/dashboardService'

function getFirstName(name?: string | null) {
  return name?.trim().split(' ').filter(Boolean)[0] ?? 'Cidadão'
}

export default function CitizenDashboardPage() {
  const { user } = useAuthContext()
  const firstName = getFirstName(user?.name)
  const [dashboard, setDashboard] = useState({ totalArvores: 42, arvoresSaudaveis: 30, arvoresAcompanhamento: 7 })

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      try {
        const data = await fetchDashboardPublico()
        if (isMounted) setDashboard(data)
      } catch {
        // fallback silencioso
      }
    }

    void loadDashboard()
    return () => { isMounted = false }
  }, [])

  const metrics = [
    {
      key: 'cataloged',
      icon: Trees,
      label: 'Árvores catalogadas',
      value: dashboard.totalArvores,
      valueClassName: 'text-burgundy',
    },
    {
      key: 'healthy',
      icon: Leaf,
      label: 'Saudáveis',
      value: dashboard.arvoresSaudaveis,
      valueClassName: 'text-sage',
    },
    {
      key: 'monitoring',
      icon: TriangleAlert,
      label: 'Sob acompanhamento',
      value: dashboard.arvoresAcompanhamento,
      valueClassName: 'text-rosewood',
    },
  ]

  return (
    <>
      <header className="flex min-h-16 items-center border-b border-rosewood/10 px-6 py-4">
        <div className="flex min-w-0 items-start gap-4">
          <BookOpen
            aria-hidden="true"
            className="mt-1 shrink-0 text-burgundy"
            size={15}
            strokeWidth={1.7}
          />

          <div className="min-w-0">
            <h1 className="text-lg leading-6 tracking-normal text-burgundy">
              Olá, {firstName}
            </h1>
            <p className="mt-0.5 text-xs leading-4 text-rosewood">
              Acompanhe o patrimônio arbóreo da UFRPE
            </p>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="citizen-dashboard-title"
        className="max-w-6xl px-6 py-8 sm:px-8"
      >
        <h2 id="citizen-dashboard-title" className="sr-only">
          Resumo do dashboard cidadão
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon

            return (
              <article
                key={metric.key}
                className="min-h-28 rounded-lg border border-rosewood/15 bg-white/45 px-6 py-5 shadow-[0_1px_2px_rgb(62_0_12_/_0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[0.625rem] uppercase tracking-[0.28em] text-rosewood">
                    {metric.label}
                  </p>

                  <Icon
                    aria-hidden="true"
                    className="shrink-0 text-sage"
                    size={15}
                    strokeWidth={1.45}
                  />
                </div>

                <strong
                  className={`mt-5 block text-[2rem] leading-none font-medium tracking-normal ${metric.valueClassName}`}
                >
                  {metric.value}
                </strong>
              </article>
            )
          })}
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
    </>
  )
}
