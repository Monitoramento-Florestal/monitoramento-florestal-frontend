import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <details className="group rounded-xl border border-rosewood/10 bg-white/45 p-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 sm:pointer-events-none">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-rosewood/85">
          {title}
        </h3>
        <ChevronDown
          size={16}
          className="text-rosewood transition-transform group-open:rotate-180 sm:hidden"
          strokeWidth={1.7}
        />
      </summary>
      <div className="mt-2.5 space-y-2.5 sm:mt-2.5">{children}</div>
    </details>
  );
}
