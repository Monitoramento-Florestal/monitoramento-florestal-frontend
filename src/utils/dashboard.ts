import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Map,
  PlusCircle,
  Trees,
  UserCircle,
  Users,
} from "lucide-react";

import { UserRole } from "@/constants/roles";

export interface DashboardNavigationItem {
  href: string;
  icon: LucideIcon;
  key: string;
  label: string;
  roles: UserRole[];
}

type DashboardNavigationTemplate = Omit<DashboardNavigationItem, "href"> & {
  href: string | ((role: UserRole) => string);
};

const DASHBOARD_HOME_PATHS: Record<UserRole, string> = {
  [UserRole.CITIZEN]: "/citizen",
  [UserRole.RESEARCHER]: "/researcher",
  [UserRole.MANAGER]: "/manager",
  [UserRole.ADMIN]: "/admin",
};

const DASHBOARD_NAVIGATION: DashboardNavigationTemplate[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: (role) => DASHBOARD_HOME_PATHS[role],
    icon: LayoutDashboard,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "map",
    label: "Mapa",
    href: "/map",
    icon: Map,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "register-tree",
    label: "Registrar arvore",
    href: "/trees/new",
    icon: PlusCircle,
    roles: [UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "approvals",
    label: "Fila de aprovacao",
    href: "/approvals",
    icon: ListChecks,
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "management",
    label: "Gerenciamento",
    href: "/management",
    icon: Trees,
    roles: [UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "users",
    label: "Usuarios",
    href: "/users",
    icon: Users,
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "records",
    label: "Registros",
    href: "/records",
    icon: ClipboardList,
    roles: [UserRole.ADMIN],
  },
  {
    key: "profile",
    label: "Perfil",
    href: (role) => `${DASHBOARD_HOME_PATHS[role]}/profile`,
    icon: UserCircle,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
];

export function getDashboardNavigation(role: UserRole) {
  return DASHBOARD_NAVIGATION
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      href: typeof item.href === "function" ? item.href(role) : item.href,
    }));
}
