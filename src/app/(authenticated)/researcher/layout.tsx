import type { ReactNode } from "react";

import { RoleDashboardLayout } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";

export default function ResearcherDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleDashboardLayout role={UserRole.RESEARCHER}>{children}</RoleDashboardLayout>;
}
