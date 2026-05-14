import type { ReactNode } from "react";

import { RoleDashboardLayout } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";

export default function ResearcherDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleDashboardLayout
      role={UserRole.RESEARCHER}
      title="Dashboard do pesquisador"
      subtitle="Base de pesquisa pronta para registro, consulta e acompanhamento do acervo."
    >
      {children}
    </RoleDashboardLayout>
  );
}
