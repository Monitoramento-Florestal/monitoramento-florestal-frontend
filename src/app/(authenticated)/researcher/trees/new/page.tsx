import { TreeRecordPageContent } from "@/components/features/treeRecords/TreeRecordPageContent";
import { UserRole } from "@/constants/roles";

export default function ResearcherTreeRegisterPage() {
  return (
    <TreeRecordPageContent
      mode="create-tree"
      role={UserRole.RESEARCHER}
    />
  );
}
