import type { CSSProperties } from "react";

interface StatusPillProps {
  label: string;
  className?: string;
  style?: CSSProperties;
}

export function StatusPill({
  label,
  className = "",
  style,
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${className}`}
      style={style}
    >
      {label}
    </span>
  );
}
