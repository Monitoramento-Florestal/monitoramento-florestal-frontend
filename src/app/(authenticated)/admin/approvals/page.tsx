import { ApprovalsScreen } from "@/components/features/approvals/ApprovalsScreen";
import { mockTrees } from "@/types/mockTrees";

export default function AdminApprovalsPage() {
  return <ApprovalsScreen initialRecords={mockTrees} />;
}
