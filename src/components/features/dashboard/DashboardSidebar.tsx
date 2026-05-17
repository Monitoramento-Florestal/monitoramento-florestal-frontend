"use client";

import { LogOut } from "lucide-react";

import { ROLE_LABELS, UserRole } from "@/constants/roles";
import type { DashboardNavigationItem } from "@/utils/dashboard";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";
import { DashboardSidebarItem } from "./DashboardSidebarItem";

interface DashboardSidebarProps {
  className?: string;
  currentPath: string;
  items: DashboardNavigationItem[];
  onLogout?: () => void;
  userName: string;
  userRole: UserRole;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isMatchingPath(currentPath: string, href: string) {
  if (currentPath === href) {
    return true;
  }

  const hrefDepth = href.split("/").filter(Boolean).length;

  if (hrefDepth <= 1) {
    return false;
  }

  return href !== "/" && currentPath.startsWith(`${href}/`);
}

function getActiveItemHref(currentPath: string, items: DashboardNavigationItem[]) {
  const matches = items.filter((item) => isMatchingPath(currentPath, item.href));

  if (matches.length === 0) {
    return null;
  }

  return matches
    .sort((left, right) => right.href.length - left.href.length)[0]
    .href;
}

export function DashboardSidebar({
  className,
  currentPath,
  items,
  onLogout,
  userName,
  userRole,
}: DashboardSidebarProps) {
  const initials = getInitials(userName) || "?";
  const activeHref = getActiveItemHref(currentPath, items);

  return (
    <div className={cn("flex h-full min-h-screen flex-col bg-forest", className)}>
      <div className="border-b border-cream/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-3">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cream to-cream/90 shadow-sm ring-2 ring-sage/35 ring-offset-2 ring-offset-forest">
            <Logo size={56} />
          </div>

          <div className="leading-none">
            <div className="text-[1.375rem] tracking-tight text-cream">
              Arbor
            </div>
            <div className="mt-1 text-[0.625rem] uppercase tracking-[0.2em] text-rosewood/80">
              UFRPE
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5">
        <div className="px-3 pb-3 text-[0.625rem] uppercase tracking-[0.2em] text-rosewood/70">
          Navegacao
        </div>

        <nav aria-label="Navegacao do dashboard">
          <ul className="space-y-1">
            {items.map((item) => (
              <DashboardSidebarItem
                active={item.href === activeHref}
                key={item.key}
                item={item}
              />
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-cream/10 p-3">
        <div className="relative rounded-md border border-cream/10 bg-black/20 p-3">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-medium text-sage">
              {initials}
            </div>

            <div className="min-w-0 pr-7">
              <div className="truncate text-[0.8125rem] text-cream">
                {userName}
              </div>
              <span className="mt-1.5 inline-block rounded bg-sage/20 px-1.5 py-0.5 text-[0.625rem] uppercase tracking-[0.14em] text-sage">
                {ROLE_LABELS[userRole]}
              </span>
            </div>
          </div>

          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="absolute top-2 right-2 text-cream/55 transition-colors hover:text-cream"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut size={14} strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
