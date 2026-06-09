import { TreeRecordPageContent } from "@/components/features/treeRecords/TreeRecordPageContent";
import { UserRole } from "@/constants/roles";

export default async function ManagerEditTreePage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;

  return (
    <TreeRecordPageContent
      mode="edit-tree"
      role={UserRole.MANAGER}
      treeId={treeId}
    />
  );
}
