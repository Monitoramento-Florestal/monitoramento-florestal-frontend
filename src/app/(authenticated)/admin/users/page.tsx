import { DashboardPageHeader } from '@/components/features/dashboard'
import { UserManagementScreen } from '@/components/features/userManagement/UserManagementScreen'
import { UserRole } from '@/constants/roles'
import { mockUsers } from '@/types/mockTrees'

export default function AdminUsersPage() {
  return (
    <>
      <DashboardPageHeader
        title="Usuários"
        subtitle="Gestão administrativa de perfis e acessos da plataforma."
      />
      <div className="p-4 sm:p-6">
        <UserManagementScreen
          currentRole={UserRole.ADMIN}
          initialUsers={mockUsers}
        />
      </div>
    </>
  )
}
