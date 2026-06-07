"use client";

import { LogOut, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  buildSessionUserFromProfile,
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
} from "@/services/auth/authService";
import {
  isSessionInvalidationError,
  normalizeApiError,
} from "@/utils/apiFunctions";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "./DashboardCard";
import { DashboardPageHeader } from "./DashboardPageHeader";

interface DashboardProfilePageProps {
  defaultCpf?: string;
  defaultEmail?: string;
  defaultName?: string;
}

function Field({
  disabled = false,
  label,
  onChange,
  type = "text",
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange?: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-rosewood">
        {label}
      </span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-rosewood/30 bg-cream px-3 text-sm text-burgundy outline-none transition-colors placeholder:text-rosewood/40 focus:border-sage focus:ring-2 focus:ring-sage/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}

export function DashboardProfilePage({
  defaultCpf,
  defaultEmail = "",
  defaultName = "",
}: DashboardProfilePageProps) {
  const { logout, session, setSession, user } = useAuthContext();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name ?? defaultName);
  const [email, setEmail] = useState(user?.email ?? defaultEmail);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function syncProfile() {
      try {
        setIsLoadingProfile(true);
        const profile = await getMyProfile();

        if (!isMounted) {
          return;
        }

        setName(profile.nome);
        setEmail(profile.email);

        if (session) {
          setSession({
            ...session,
            user: buildSessionUserFromProfile(profile),
          });
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isSessionInvalidationError(error)) {
          return;
        }

        showToast({
          title: "Nao foi possivel carregar o perfil",
          description: normalizeApiError(error).message,
          variant: "error",
        });
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    void syncProfile();

    return () => {
      isMounted = false;
    };
  }, [session, setSession, showToast]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName((current) => current || user.name);
    setEmail((current) => current || user.email);
  }, [user]);

  function handleLogout() {
    void logout();
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSavingProfile(true);
      const profile = await updateMyProfile({
        nome: name.trim(),
        email: email.trim(),
      });

      if (session) {
        setSession({
          ...session,
          user: buildSessionUserFromProfile(profile),
        });
      }

      setName(profile.nome);
      setEmail(profile.email);

      showToast({
        title: "Perfil atualizado",
        description: "Seus dados pessoais foram salvos com sucesso.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Nao foi possivel salvar o perfil",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast({
        title: "As senhas nao coincidem",
        description: "Revise a confirmacao da nova senha antes de continuar.",
        variant: "error",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      await changeMyPassword({
        senhaAtual: currentPassword,
        novaSenha: newPassword,
        confirmarSenha: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showToast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Nao foi possivel atualizar a senha",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        title="Meu perfil"
        subtitle="Dados pessoais e seguranca"
      />
      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          <DashboardCard className="bg-white/55 shadow-none">
            <div className="mb-6">
              <h2 className="text-base font-medium text-burgundy">
                Dados pessoais
              </h2>
              <p className="mt-1 text-sm text-rosewood">
                Atualize suas informacoes de contato.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleProfileSubmit}>
              <Field
                label="Nome completo"
                value={name}
                disabled={isLoadingProfile || isSavingProfile}
                onChange={setName}
              />
              <Field
                label="E-mail"
                type="email"
                value={email}
                disabled={isLoadingProfile || isSavingProfile}
                onChange={setEmail}
              />
              {defaultCpf ? (
                <Field label="CPF" value={defaultCpf} disabled />
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoadingProfile || isSavingProfile}
                  text={isSavingProfile ? "Salvando..." : "Salvar"}
                  icon={Save}
                  iconSide="left"
                />
              </div>
            </form>
          </DashboardCard>

          <DashboardCard className="bg-white/55 shadow-none">
            <div className="mb-6">
              <h2 className="text-base font-medium text-burgundy">
                Alterar senha
              </h2>
              <p className="mt-1 text-sm text-rosewood">
                Recomendado a cada 90 dias.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handlePasswordSubmit}>
              <Field
                label="Senha atual"
                type="password"
                value={currentPassword}
                disabled={isChangingPassword}
                onChange={setCurrentPassword}
              />
              <Field
                label="Nova senha"
                type="password"
                value={newPassword}
                disabled={isChangingPassword}
                onChange={setNewPassword}
              />
              <Field
                label="Confirmar nova senha"
                type="password"
                value={confirmPassword}
                disabled={isChangingPassword}
                onChange={setConfirmPassword}
              />

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  text="Sair da conta"
                  icon={LogOut}
                  iconSide="left"
                  variant="ghost"
                  onClick={handleLogout}
                />
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  text={
                    isChangingPassword ? "Atualizando..." : "Atualizar senha"
                  }
                  variant="outline"
                />
              </div>
            </form>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
