import type { ReactNode } from "react";

interface DetailNoteProps {
  title?: string;
  children: ReactNode;
}

export function DetailNote({ title, children }: DetailNoteProps) {
  return (
    <div className="rounded-lg border border-rosewood/10 bg-card/55 px-3 py-3 text-sm leading-relaxed text-burgundy/88">
      {title ? (
        <p className="mb-1 text-xs uppercase tracking-[0.16em] text-rosewood/80">
          {title}
        </p>
      ) : null}
      <p>{children}</p>
    </div>
  );
}
