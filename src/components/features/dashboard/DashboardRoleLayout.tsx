"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { UserRole } from "@/constants/roles";
import { useAuthContext } from "@/contexts/AuthContext";
import { getDashboardNavigation } from "@/utils/dashboard";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardShell } from "./DashboardShell";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardRoleLayoutProps {
  children: ReactNode;
  defaultUserName: string;
  headerSubtitle?: string;
  headerTitle: string;
  role: UserRole;
}

export function DashboardRoleLayout({
  children,
  defaultUserName,
  headerSubtitle,
  headerTitle,
  role,
}: DashboardRoleLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth, user } = useAuthContext();

  const userName = user?.name ?? defaultUserName;

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          currentPath={pathname}
          items={getDashboardNavigation(role)}
          onLogout={handleLogout}
          userName={userName}
          userRole={role}
        />
      }
      header={<DashboardPageHeader title={headerTitle} subtitle={headerSubtitle} />}
    >
      {children}
    </DashboardShell>
  );
}
