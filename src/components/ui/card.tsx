import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-sage/25 bg-white p-4 shadow-sm', className)}
      {...props}
    />
  )
}
