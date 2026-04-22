import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md bg-forest px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-50',
        className
      )}
      type={type}
      {...props}
    />
  )
}
