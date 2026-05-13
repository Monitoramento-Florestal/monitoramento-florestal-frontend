import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h3 className="mb-2.5 text-[10px] uppercase tracking-[0.2em] text-rosewood/85">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}
