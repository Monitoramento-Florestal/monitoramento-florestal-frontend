'use client'

import { BookOpen } from 'lucide-react'

interface CitizenDashboardHeaderProps {
  userName: string
}

function getFirstName(name: string) {
  return name.trim().split(' ').filter(Boolean)[0] ?? 'Cidadão'
}

export function CitizenDashboardHeader({
  userName,
}: CitizenDashboardHeaderProps) {
  const firstName = getFirstName(userName)

  return (
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
  )
}
