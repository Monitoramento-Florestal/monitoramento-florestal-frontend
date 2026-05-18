"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { UserRole } from "@/constants/roles";
import { useAuthContext } from "@/contexts/AuthContext";
import { getDashboardNavigation } from "@/utils/dashboard";
import { DashboardShell } from "./DashboardShell";
import { DashboardSidebar } from "./DashboardSidebar";

interface RoleDashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

const ROLE_FALLBACK_NAMES: Record<UserRole, string> = {
  [UserRole.CITIZEN]: "Cidadao",
  [UserRole.RESEARCHER]: "Pesquisador",
  [UserRole.MANAGER]: "Gestor",
  [UserRole.ADMIN]: "Administrador",
};

export function RoleDashboardLayout({
  children,
  role,
}: RoleDashboardLayoutProps) {
  const pathname = usePathname();
  const { clearAuth, user } = useAuthContext();
  const items = useMemo(() => getDashboardNavigation(role), [role]);

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          currentPath={pathname}
          items={items}
          onLogout={clearAuth}
          userName={user?.name ?? ROLE_FALLBACK_NAMES[role]}
          userRole={role}
        />
      }
    >
      {children}
    </DashboardShell>
  );
}
