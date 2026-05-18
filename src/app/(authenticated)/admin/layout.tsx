import type { ReactNode } from "react";

import { RoleDashboardLayout } from "@/components/features/dashboard";
import { UserRole } from "@/constants/roles";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleDashboardLayout role={UserRole.ADMIN}>{children}</RoleDashboardLayout>;
}
