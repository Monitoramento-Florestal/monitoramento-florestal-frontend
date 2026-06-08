"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { ROLE_LABELS, UserRole } from "@/constants/roles";
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
  const { logout, user } = useAuthContext();
  const items = useMemo(() => getDashboardNavigation(role), [role]);
  const activeItem = useMemo(() => {
    const matches = items.filter((item) => {
      if (pathname === item.href) {
        return true;
      }

      const hrefDepth = item.href.split("/").filter(Boolean).length;

      if (hrefDepth <= 1) {
        return false;
      }

      return pathname.startsWith(`${item.href}/`);
    });

    return matches.sort((left, right) => right.href.length - left.href.length)[0] ?? null;
  }, [items, pathname]);

  function handleLogout() {
    void logout();
  }

  return (
    <DashboardShell
      desktopSidebar={
        <DashboardSidebar
          currentPath={pathname}
          items={items}
          onLogout={handleLogout}
          userName={user?.name ?? ROLE_FALLBACK_NAMES[role]}
          userRole={role}
        />
      }
      mobileSidebar={
        <DashboardSidebar
          currentPath={pathname}
          items={items}
          onLogout={handleLogout}
          userName={user?.name ?? ROLE_FALLBACK_NAMES[role]}
          userRole={role}
        />
      }
      mobileSubtitle={ROLE_LABELS[role]}
      mobileTitle={activeItem?.label ?? "Dashboard"}
      navigationKey={pathname}
    >
      {children}
    </DashboardShell>
  );
}
