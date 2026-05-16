import type { ReactNode } from 'react'

import { CitizenDashboardLayout } from '@/components/features/citizen-dashboard'

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <CitizenDashboardLayout>{children}</CitizenDashboardLayout>
}
