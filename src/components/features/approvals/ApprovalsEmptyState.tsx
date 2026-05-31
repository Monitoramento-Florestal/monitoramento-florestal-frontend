import { CheckCheck } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";

interface ApprovalsEmptyStateProps {
  hasFilters?: boolean;
}

export function ApprovalsEmptyState({
  hasFilters = false,
}: ApprovalsEmptyStateProps) {
  return (
    <DashboardCard className="grain px-8 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/12 text-sage">
        <CheckCheck size={24} strokeWidth={1.6} />
      </div>

      <h2 className="mt-5 text-xl tracking-tight text-burgundy">
        {hasFilters ? "Nenhum registro encontrado" : "Nada pendente"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rosewood">
        {hasFilters
          ? "Ajuste a busca ou troque o filtro para localizar outros registros pendentes."
          : "Todos os registros enviados já foram revisados. Quando novas submissões entrarem na fila, elas aparecerão aqui."}
      </p>
    </DashboardCard>
  );
}
