"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type {
  TreeManagementFilterOption,
  TreeManagementStatusFilter,
} from "@/utils/treeManagement";

interface TreeManagementFiltersProps {
  activeStatus: TreeManagementStatusFilter;
  filters: TreeManagementFilterOption[];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: TreeManagementStatusFilter) => void;
  query: string;
}

export function TreeManagementFilters({
  activeStatus,
  filters,
  onQueryChange,
  onStatusChange,
  query,
}: TreeManagementFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          strokeWidth={1.6}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-rosewood/55"
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nome, especie ou codigo..."
          className="h-11 rounded-lg border-rosewood/25 bg-white pl-11"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const isActive = filter.value === activeStatus;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              className={[
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sage/16 text-burgundy"
                  : "text-rosewood hover:bg-secondary",
              ].join(" ")}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
