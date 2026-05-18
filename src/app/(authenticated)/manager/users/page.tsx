import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";

export default function ManagerUsersPage() {
  return (
    <>
      <DashboardPageHeader
        title="Usuarios"
        subtitle="Gestao operacional de perfis e acessos da plataforma."
      />
      <div className="p-6">
        <DashboardCard>
          <h2 className="text-xl tracking-tight text-burgundy">Usuarios</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            Scaffold reservado para a futura gestao de usuarios.
          </p>
        </DashboardCard>
      </div>
    </>
  );
}
