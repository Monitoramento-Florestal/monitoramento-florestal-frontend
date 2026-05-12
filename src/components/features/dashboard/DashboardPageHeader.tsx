import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface DashboardPageHeaderProps {
  actions?: ReactNode;
  className?: string;
  subtitle?: string;
  title: string;
}

export function DashboardPageHeader({
  actions,
  className,
  subtitle,
  title,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-rosewood/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[1.75rem] leading-none tracking-tight text-burgundy">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-rosewood">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
