'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import {
  DashboardShell,
  DashboardSidebar,
} from '@/components/features/dashboard'
import { UserRole } from '@/constants/roles'
import { useAuthContext } from '@/contexts/AuthContext'
import { getDashboardNavigation } from '@/utils/dashboard'
import { CitizenDashboardHeader } from './CitizenDashboardHeader'

interface CitizenDashboardLayoutProps {
  children: ReactNode
}

const CITIZEN_FALLBACK_NAME = 'Cidadão'

export function CitizenDashboardLayout({
  children,
}: CitizenDashboardLayoutProps) {
  const pathname = usePathname()
  const { clearAuth, user } = useAuthContext()
  const items = useMemo(() => getDashboardNavigation(UserRole.CITIZEN), [])
  const userName = user?.name ?? CITIZEN_FALLBACK_NAME

  return (
    <DashboardShell
      className="bg-[#f7eadf]"
      contentClassName="px-6 py-8 sm:px-8"
      header={<CitizenDashboardHeader userName={userName} />}
      sidebar={
        <DashboardSidebar
          currentPath={pathname}
          items={items}
          onLogout={clearAuth}
          userName={userName}
          userRole={UserRole.CITIZEN}
        />
      }
    >
      {children}
    </DashboardShell>
  )
}
