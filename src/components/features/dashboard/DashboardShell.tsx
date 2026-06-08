"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/utils/cn";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  desktopSidebar: ReactNode;
  header?: ReactNode;
  mobileSidebar?: ReactNode;
  mobileSubtitle?: string;
  mobileTitle?: string;
  navigationKey?: string;
}

export function DashboardShell({
  children,
  className,
  contentClassName,
  desktopSidebar,
  header,
  mobileSidebar,
  mobileSubtitle = "Painel",
  mobileTitle = "Navegacao",
  navigationKey,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [navigationKey]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("dashboard-sidebar-open");
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("dashboard-sidebar-open");
    };
  }, [isSidebarOpen]);

  const renderedMobileSidebar = mobileSidebar ?? desktopSidebar;

  return (
    <div className={cn("min-h-screen bg-cream text-burgundy", className)}>
      <div className="sticky top-0 z-40 border-b border-rosewood/10 bg-cream/95 backdrop-blur lg:hidden">
        <div className="app-safe-top app-shell-padding flex items-center justify-between gap-3 pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-1 shrink-0 rounded-full bg-sage/65" />

            <div className="min-w-0">
              <p className="text-[0.625rem] uppercase tracking-[0.18em] text-rosewood/80">
                {mobileSubtitle}
              </p>
              <p className="truncate text-base leading-none text-burgundy">
                {mobileTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-rosewood/20 bg-card/90 text-burgundy transition-colors hover:bg-secondary"
            aria-label="Abrir menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-[950] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fechar menu"
          />

          <div className="absolute inset-y-0 left-0 isolate w-[min(88vw,22rem)] max-w-full overflow-hidden bg-forest shadow-overlay">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full bg-cream/92 text-burgundy shadow-sm transition-colors hover:bg-cream"
                aria-label="Fechar menu"
              >
                <X size={18} strokeWidth={1.9} />
              </button>
            </div>

            {renderedMobileSidebar}
          </div>
        </div>
      ) : null}

      <div className="grid min-h-screen lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside className="hidden border-r border-rosewood/10 lg:block">
          {desktopSidebar}
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
