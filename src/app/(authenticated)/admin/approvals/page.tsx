import {
  DashboardPageHeader,
} from "@/components/features/dashboard";
import { ApprovalsScreen } from "@/components/features/approvals/ApprovalsScreen";
import { mockApprovalRequests } from "@/types/mockTrees";

export default function AdminApprovalsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Fila de aprovação"
        subtitle={`${mockApprovalRequests.length} solicitações aguardando revisão`}
      />
      <div className="p-6">
        <ApprovalsScreen initialRecords={mockApprovalRequests} />
      </div>
    </>
  );
}
