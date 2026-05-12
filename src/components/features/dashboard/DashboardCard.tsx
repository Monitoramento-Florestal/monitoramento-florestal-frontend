import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type DashboardCardProps = HTMLAttributes<HTMLDivElement>;

export function DashboardCard({
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-rosewood/15 bg-white p-6 shadow-[0_4px_24px_rgb(9_30_5_/_0.06)]",
        className
      )}
      {...props}
    />
  );
}
