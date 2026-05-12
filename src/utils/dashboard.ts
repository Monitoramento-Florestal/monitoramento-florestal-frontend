import type { LucideIcon } from "lucide-react";
import {
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

const DASHBOARD_NAVIGATION: DashboardNavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
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
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "users",
    label: "Usuarios",
    href: "/users",
    icon: Users,
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "profile",
    label: "Perfil",
    href: "/profile",
    icon: UserCircle,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
];

export function getDashboardNavigation(role: UserRole) {
  return DASHBOARD_NAVIGATION.filter((item) => item.roles.includes(role));
}
