import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-sage',
        className
      )}
      {...props}
    />
  )
}
