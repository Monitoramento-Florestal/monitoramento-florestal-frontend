"use client";

import { LogOut, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { UserRole } from "@/constants/roles";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "./DashboardCard";
import { DashboardRoleLayout } from "./DashboardRoleLayout";

interface DashboardProfilePageProps {
  defaultCpf: string;
  defaultEmail: string;
  defaultName: string;
  role: UserRole;
}

function Field({
  defaultValue,
  label,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-rosewood">
        {label}
      </span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-2 h-10 w-full rounded-md border border-rosewood/30 bg-cream px-3 text-sm text-burgundy outline-none transition-colors placeholder:text-rosewood/40 focus:border-sage focus:ring-2 focus:ring-sage/20"
      />
    </label>
  );
}

export function DashboardProfilePage({
  defaultCpf,
  defaultEmail,
  defaultName,
  role,
}: DashboardProfilePageProps) {
  const router = useRouter();
  const { clearAuth, user } = useAuthContext();

  const userName = user?.name ?? defaultName;
  const userEmail = user?.email ?? defaultEmail;

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <DashboardRoleLayout
      defaultUserName={defaultName}
      headerTitle="Meu perfil"
      headerSubtitle="Dados pessoais e seguranca"
      role={role}
    >
      <div className="max-w-2xl space-y-6">
        <DashboardCard className="bg-white/55 shadow-none">
          <div className="mb-6">
            <h2 className="text-base font-medium text-burgundy">Dados pessoais</h2>
            <p className="mt-1 text-sm text-rosewood">
              Atualize suas informacoes de contato.
            </p>
          </div>

          <form className="space-y-5">
            <Field label="Nome completo" defaultValue={userName} />
            <Field label="E-mail" defaultValue={userEmail} type="email" />
            <Field label="CPF" defaultValue={defaultCpf} />

            <div className="flex justify-end">
              <Button type="button" text="Salvar" icon={Save} iconSide="left" />
            </div>
          </form>
        </DashboardCard>

        <DashboardCard className="bg-white/55 shadow-none">
          <div className="mb-6">
            <h2 className="text-base font-medium text-burgundy">Alterar senha</h2>
            <p className="mt-1 text-sm text-rosewood">
              Recomendado a cada 90 dias.
            </p>
          </div>

          <form className="space-y-5">
            <Field label="Senha atual" type="password" />
            <Field label="Nova senha" type="password" />
            <Field label="Confirmar nova senha" type="password" />

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                text="Sair da conta"
                icon={LogOut}
                iconSide="left"
                variant="ghost"
                onClick={handleLogout}
              />
              <Button type="button" text="Atualizar senha" variant="outline" />
            </div>
          </form>
        </DashboardCard>
      </div>
    </DashboardRoleLayout>
  );
}
