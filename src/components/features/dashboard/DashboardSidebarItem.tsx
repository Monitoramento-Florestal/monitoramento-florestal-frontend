"use client";

import Link from "next/link";

import type { DashboardNavigationItem } from "@/utils/dashboard";
import { cn } from "@/utils/cn";

interface DashboardSidebarItemProps {
  currentPath: string;
  item: DashboardNavigationItem;
}

function isActivePath(currentPath: string, href: string) {
  if (currentPath === href) {
    return true;
  }

  return href !== "/" && currentPath.startsWith(`${href}/`);
}

export function DashboardSidebarItem({
  currentPath,
  item,
}: DashboardSidebarItemProps) {
  const active = isActivePath(currentPath, item.href);
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-cream/75 transition-colors hover:bg-cream/5 hover:text-cream",
          active && "bg-sage/15 text-cream"
        )}
      >
        {active ? (
          <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-sage" />
        ) : null}

        <Icon
          size={16}
          strokeWidth={1.5}
          className={cn(active && "text-sage")}
        />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}
