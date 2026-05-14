import type { ReactNode } from "react";

import { RoleDashboardLayout } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";

export default function ManagerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleDashboardLayout
      role={UserRole.MANAGER}
      title="Dashboard do gestor"
      subtitle="Base de gestao pronta para aprovacoes, usuarios e gerenciamento."
    >
      {children}
    </RoleDashboardLayout>
  );
}
