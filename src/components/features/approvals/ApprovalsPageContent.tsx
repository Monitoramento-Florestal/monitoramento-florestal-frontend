"use client";

import { useEffect, useState } from "react";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { useToast } from "@/components/ui/toast";
import {
  approvePendingRecord,
  listPendingApprovalRequests,
  rejectPendingRecord,
} from "@/services/approvals/approvalService";
import type { TreeApprovalRequest } from "@/types/trees";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";

import { ApprovalsScreen } from "./ApprovalsScreen";

interface ApprovalsPageContentProps {
  canReview: boolean;
  title: string;
  readOnlyReason?: string;
}

export function ApprovalsPageContent({
  canReview,
  title,
  readOnlyReason,
}: ApprovalsPageContentProps) {
  const { showToast } = useToast();
  const [records, setRecords] = useState<TreeApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPendingRecords() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const pendingRecords = await listPendingApprovalRequests();

        if (!isMounted) {
          return;
        }

        setRecords(pendingRecords);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isSessionInvalidationError(error)) {
          return;
        }

        const normalizedError = normalizeApiError(error);
        setErrorMessage(
          normalizedError.status === 403
            ? "Seu perfil nao tem permissao no backend para consultar a fila de aprovacao."
            : normalizedError.message,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPendingRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleApprove(recordId: string) {
    try {
      await approvePendingRecord(recordId);
      setRecords((current) => current.filter((record) => record.id !== recordId));
      showToast({
        title: "Registro aprovado com sucesso",
        description: "A solicitacao foi consolidada pelo backend.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Nao foi possivel aprovar o registro",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    }
  }

  async function handleReject(recordId: string, reason: string) {
    try {
      await rejectPendingRecord(recordId, reason);
      setRecords((current) => current.filter((record) => record.id !== recordId));
      showToast({
        title: "Registro rejeitado com sucesso",
        description: "A solicitacao foi removida da fila.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Nao foi possivel rejeitar o registro",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    }
  }

  return (
    <>
      <DashboardPageHeader
        title={title}
        subtitle={`${records.length} solicitacoes aguardando revisao`}
      />
      <div className="space-y-6 p-4 sm:p-6">
        {readOnlyReason ? (
          <DashboardCard className="border-rosewood/12 bg-card/45 text-rosewood">
            {readOnlyReason}
          </DashboardCard>
        ) : null}

        {errorMessage ? (
          <DashboardCard className="border-burgundy/15 bg-burgundy/5 text-rosewood">
            {errorMessage}
          </DashboardCard>
        ) : null}

        {!errorMessage ? (
          <ApprovalsScreen
            initialRecords={records}
            loading={isLoading}
            canReview={canReview}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : null}
      </div>
    </>
  );
}
