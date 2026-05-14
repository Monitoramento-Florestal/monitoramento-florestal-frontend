import { ApprovalsScreen } from "@/components/features/approvals/ApprovalsScreen";
import { mockTrees } from "@/types/mockTrees";

export default function ManagerApprovalsPage() {
  return <ApprovalsScreen initialRecords={mockTrees} />;
}
