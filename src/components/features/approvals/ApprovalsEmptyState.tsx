import { CheckCheck } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";

export function ApprovalsEmptyState() {
  return (
    <DashboardCard className="grain px-8 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/12 text-sage">
        <CheckCheck size={24} strokeWidth={1.6} />
      </div>

      <h2 className="mt-5 text-xl tracking-tight text-burgundy">
        Nada pendente
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rosewood">
        Todos os registros enviados ja foram revisados. Quando novas submissoes
        entrarem na fila, elas aparecerao aqui.
      </p>
    </DashboardCard>
  );
}
