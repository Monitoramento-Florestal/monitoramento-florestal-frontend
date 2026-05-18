import {
  DashboardPageHeader,
} from "@/components/features/dashboard";
import { ApprovalsScreen } from "@/components/features/approvals/ApprovalsScreen";
import { mockApprovalRequests } from "@/types/mockTrees";

export default function AdminApprovalsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Fila de aprovacao"
        subtitle={`${mockApprovalRequests.length} solicitacoes aguardando revisao`}
      />
      <div className="p-6">
        <ApprovalsScreen initialRecords={mockApprovalRequests} />
      </div>
    </>
  );
}
