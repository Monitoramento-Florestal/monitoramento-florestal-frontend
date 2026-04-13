import { format } from 'date-fns'

export function formatDate(value: Date | string, pattern = 'dd/MM/yyyy') {
  const date = typeof value === 'string' ? new Date(value) : value
  return format(date, pattern)
}
