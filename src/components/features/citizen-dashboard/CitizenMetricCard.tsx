import type { LucideIcon } from 'lucide-react'

import { cn } from '@/utils/cn'

interface CitizenMetricCardProps {
  icon: LucideIcon
  label: string
  tone?: 'burgundy' | 'sage' | 'rosewood'
  value: number
}

const toneStyles = {
  burgundy: 'text-burgundy',
  rosewood: 'text-rosewood',
  sage: 'text-sage',
}

export function CitizenMetricCard({
  icon: Icon,
  label,
  tone = 'burgundy',
  value,
}: CitizenMetricCardProps) {
  return (
    <article className="min-h-28 rounded-lg border border-rosewood/15 bg-white/45 px-6 py-5 shadow-[0_1px_2px_rgb(62_0_12_/_0.04)]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[0.625rem] uppercase tracking-[0.28em] text-rosewood">
          {label}
        </p>

        <Icon
          aria-hidden="true"
          className="shrink-0 text-sage"
          size={15}
          strokeWidth={1.45}
        />
      </div>

      <strong
        className={cn(
          'mt-5 block text-[2rem] leading-none font-medium tracking-normal',
          toneStyles[tone]
        )}
      >
        {value}
      </strong>
    </article>
  )
}
