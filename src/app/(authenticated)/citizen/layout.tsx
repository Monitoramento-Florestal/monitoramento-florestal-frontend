import type { ReactNode } from "react";

import { RoleDashboardLayout } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";

export default function CitizenDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleDashboardLayout
      role={UserRole.CITIZEN}
      title="Dashboard do cidadao"
      subtitle="Base pessoal para acompanhar mapa, perfil e registros relacionados."
    >
      {children}
    </RoleDashboardLayout>
  );
}
