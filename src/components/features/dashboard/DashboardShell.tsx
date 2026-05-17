import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  header?: ReactNode;
  sidebar: ReactNode;
}

export function DashboardShell({
  children,
  className,
  contentClassName,
  header,
  sidebar,
}: DashboardShellProps) {
  return (
    <div className={cn("min-h-screen bg-cream text-burgundy", className)}>
      <div className="grid min-h-screen lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside className="border-b border-rosewood/10 lg:border-r lg:border-b-0">
          {sidebar}
        </aside>

        <div className="min-w-0">
          {header}
          <main className={cn("min-w-0", contentClassName)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
