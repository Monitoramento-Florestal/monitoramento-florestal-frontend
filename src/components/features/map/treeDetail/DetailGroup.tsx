import { formatTreeLabel } from "@/utils/treeDetailPanel";
import { TagList } from "./TagList";

interface DetailGroupProps {
  label: string;
  items: string[];
}

export function DetailGroup({ label, items }: DetailGroupProps) {
  return (
    <div className="rounded-lg border border-rosewood/10 bg-card/55 px-3 py-3">
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-rosewood/80">
        {label}
      </p>
      <TagList items={items.map(formatTreeLabel)} />
    </div>
  );
}
