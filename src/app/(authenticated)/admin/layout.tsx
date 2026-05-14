import type { ReactNode } from "react";

import { RoleDashboardLayout } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleDashboardLayout
      role={UserRole.ADMIN}
      title="Dashboard do administrador"
      subtitle="Base administrativa pronta para gestao, aprovacoes e manutencao da plataforma."
    >
      {children}
    </RoleDashboardLayout>
  );
}
