import { TreeRecordPageContent } from "@/components/features/treeRecords/TreeRecordPageContent";
import { UserRole } from "@/constants/roles";

export default function ManagerTreeRegisterPage() {
  return (
    <TreeRecordPageContent
      mode="create-tree"
      role={UserRole.MANAGER}
    />
  );
}
