import { TreeHistoryPageContent } from "@/components/features/treeRecords/TreeHistoryPageContent";
import { UserRole } from "@/constants/roles";

export default async function AdminTreeHistoryPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;

  return <TreeHistoryPageContent role={UserRole.ADMIN} treeId={treeId} />;
}
