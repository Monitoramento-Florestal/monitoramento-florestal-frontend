import {
  DashboardPageHeader,
} from "@/components/features/dashboard";
import { ApprovalsScreen } from "@/components/features/approvals/ApprovalsScreen";
import { mockTrees } from "@/types/mockTrees";

export default function AdminApprovalsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Fila de aprovacao"
        subtitle={`${mockTrees.filter((tree) => tree.registro.aprovacao === "pendente").length} registros aguardando revisao`}
      />
      <div className="p-6">
        <ApprovalsScreen initialRecords={mockTrees} />
      </div>
    </>
  );
}
