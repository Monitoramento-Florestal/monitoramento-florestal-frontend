import { DashboardPageHeader } from '@/components/features/dashboard'
import { UserManagementScreen } from '@/components/features/userManagement/UserManagementScreen'
import { UserRole } from '@/constants/roles'
import { mockUsers } from '@/types/mockTrees'

export default function ResearcherUsersPage() {
  return (
    <>
      <DashboardPageHeader
        title="Usuários"
        subtitle="Consulta de perfis vinculados ao monitoramento."
      />
      <div className="p-6">
        <UserManagementScreen
          currentRole={UserRole.RESEARCHER}
          initialUsers={mockUsers}
        />
      </div>
    </>
  )
}
