import { MapPin } from "lucide-react";

interface MetricProps {
  icon: typeof MapPin;
  label: string;
  value: string;
  stacked?: boolean;
}

export function Metric({
  icon: Icon,
  label,
  value,
  stacked = false,
}: MetricProps) {
  return (
    <div
      className={`gap-3 rounded-lg border border-rosewood/10 bg-card/65 px-3 py-2 ${
        stacked ? "flex flex-col items-start" : "flex items-start justify-between"
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-rosewood">
        <Icon size={13} strokeWidth={1.5} />
        <span>{label}</span>
      </div>
      <div
        className={`text-sm text-burgundy ${
          stacked ? "pl-5 leading-relaxed" : "text-right font-mono tabular-nums"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
