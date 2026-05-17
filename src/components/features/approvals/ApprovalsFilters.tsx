"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { ApprovalSearchField } from "@/utils/approvals";

interface ApprovalsFiltersProps {
  onFieldChange: (field: ApprovalSearchField) => void;
  onQueryChange: (value: string) => void;
  query: string;
  searchField: ApprovalSearchField;
}

const FIELD_OPTIONS: Array<{ label: string; value: ApprovalSearchField }> = [
  { label: "Nome do Pesquisador", value: "researcher" },
  { label: "Especie", value: "species" },
];

export function ApprovalsFilters({
  onFieldChange,
  onQueryChange,
  query,
  searchField,
}: ApprovalsFiltersProps) {
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
          placeholder={
            searchField === "researcher"
              ? "Buscar por nome do pesquisador..."
              : "Buscar por especie..."
          }
          className="h-11 rounded-lg border-rosewood/25 bg-white pl-11"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FIELD_OPTIONS.map((option) => {
          const isActive = option.value === searchField;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onFieldChange(option.value)}
              className={[
                "rounded-lg px-4 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sage/16 text-burgundy"
                  : "text-rosewood hover:bg-secondary",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
