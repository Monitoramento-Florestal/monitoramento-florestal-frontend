import { DashboardPageHeader } from "@/components/features/dashboard";
import { TreeRecordFormScreen } from "@/components/features/treeRecords/TreeRecordFormScreen";
import { UserRole } from "@/constants/roles";
import { getMockTreeById } from "@/types/mockTrees";
import { getTreeRecordFormSubtitle } from "@/utils/treeRecords";

export default async function ResearcherNewRecordPage({
  params,
}: {
  params: Promise<{ treeId: string }>;
}) {
  const { treeId } = await params;
  const tree = getMockTreeById(treeId);

  if (!tree) {
    return null;
  }

  return (
    <>
      <DashboardPageHeader
        title="Adicionar registro"
        subtitle={getTreeRecordFormSubtitle(UserRole.RESEARCHER, "create-record")}
      />
      <div className="p-6">
        <TreeRecordFormScreen mode="create-record" role={UserRole.RESEARCHER} tree={tree} />
      </div>
    </>
  );
}
