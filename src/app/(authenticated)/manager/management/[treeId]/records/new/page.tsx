import { TreeRecordPageContent } from "@/components/features/treeRecords/TreeRecordPageContent";
import { UserRole } from "@/constants/roles";

export default async function ManagerNewRecordPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;

  return (
    <TreeRecordPageContent
      mode="create-record"
      role={UserRole.MANAGER}
      treeId={treeId}
    />
  );
}
