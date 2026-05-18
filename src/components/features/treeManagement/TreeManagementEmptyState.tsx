import { Trees } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";

interface TreeManagementEmptyStateProps {
  hasFilters: boolean;
}

export function TreeManagementEmptyState({
  hasFilters,
}: TreeManagementEmptyStateProps) {
  return (
    <DashboardCard className="px-8 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/12 text-sage">
        <Trees size={24} strokeWidth={1.6} />
      </div>

      <h2 className="mt-5 text-xl tracking-tight text-burgundy">
        {hasFilters ? "Nenhuma arvore encontrada" : "Nenhuma arvore cadastrada"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rosewood">
        {hasFilters
          ? "Ajuste a busca ou os filtros para encontrar outro conjunto de arvores."
          : "Quando novas arvores entrarem no acervo, elas aparecerao aqui."}
      </p>
    </DashboardCard>
  );
}
