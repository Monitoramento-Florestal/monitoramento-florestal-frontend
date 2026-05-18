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

import { APP_ROUTES } from "@/constants/routes";
import { UserRole } from "@/constants/roles";

export interface DashboardNavigationItem {
  href: string;
  icon: LucideIcon;
  key: string;
  label: string;
  roles: UserRole[];
}

type RoleHrefMap = Partial<Record<UserRole, string>>;

interface DashboardNavigationDefinition
  extends Omit<DashboardNavigationItem, "href"> {
  href: RoleHrefMap;
}

const DASHBOARD_NAVIGATION: DashboardNavigationDefinition[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: {
      [UserRole.CITIZEN]: APP_ROUTES.CITIZEN_HOME,
      [UserRole.RESEARCHER]: APP_ROUTES.RESEARCHER_HOME,
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_HOME,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_HOME,
    },
    icon: LayoutDashboard,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "map",
    label: "Mapa",
    href: {
      [UserRole.CITIZEN]: APP_ROUTES.CITIZEN_MAP,
      [UserRole.RESEARCHER]: APP_ROUTES.RESEARCHER_MAP,
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_MAP,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_MAP,
    },
    icon: Map,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "register-tree",
    label: "Registrar arvore",
    href: {
      [UserRole.RESEARCHER]: APP_ROUTES.RESEARCHER_TREES_NEW,
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_TREES_NEW,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_TREES_NEW,
    },
    icon: PlusCircle,
    roles: [UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "approvals",
    label: "Fila de aprovacao",
    href: {
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_APPROVALS,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_APPROVALS,
    },
    icon: ListChecks,
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "tree-management",
    label: "Gerenciamento de arvores",
    href: {
      [UserRole.RESEARCHER]: APP_ROUTES.RESEARCHER_TREES,
    },
    icon: Trees,
    roles: [UserRole.RESEARCHER],
  },
  {
    key: "management",
    label: "Gerenciamento",
    href: {
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_MANAGEMENT,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_MANAGEMENT,
    },
    icon: Trees,
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "users",
    label: "Usuarios",
    href: {
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_USERS,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_USERS,
    },
    icon: Users,
    roles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    key: "profile",
    label: "Perfil",
    href: {
      [UserRole.CITIZEN]: APP_ROUTES.CITIZEN_PROFILE,
      [UserRole.RESEARCHER]: APP_ROUTES.RESEARCHER_PROFILE,
      [UserRole.MANAGER]: APP_ROUTES.MANAGER_PROFILE,
      [UserRole.ADMIN]: APP_ROUTES.ADMIN_PROFILE,
    },
    icon: UserCircle,
    roles: [UserRole.CITIZEN, UserRole.RESEARCHER, UserRole.MANAGER, UserRole.ADMIN],
  },
];

export function getDashboardNavigation(role: UserRole) {
  return DASHBOARD_NAVIGATION.flatMap((item) => {
    const href = item.href[role];

    if (!item.roles.includes(role) || !href) {
      return [];
    }

    return [{ ...item, href }];
  });
}
