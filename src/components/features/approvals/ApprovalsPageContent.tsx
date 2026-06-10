"use client";

import { useEffect, useState } from "react";

import { DashboardCard, DashboardPageHeader } from "@/components/features/dashboard";
import { useToast } from "@/components/ui/toast";
import {
  approvePendingRecord,
  listMyApprovalRequests,
  listPendingApprovalRequests,
  rejectPendingRecord,
} from "@/services/approvals/approvalService";
import type { TreeApprovalRequest } from "@/types/trees";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";

import { ApprovalsScreen } from "./ApprovalsScreen";

interface ApprovalsPageContentProps {
  canReview: boolean;
  scope?: "mine" | "pending";
  title: string;
  readOnlyReason?: string;
}

export function ApprovalsPageContent({
  canReview,
  scope = "pending",
  title,
  readOnlyReason,
}: ApprovalsPageContentProps) {
  const { showToast } = useToast();
  const [records, setRecords] = useState<TreeApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadApprovalRequests() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const loadedRecords =
          scope === "mine"
            ? await listMyApprovalRequests()
            : await listPendingApprovalRequests();

        if (!isMounted) {
          return;
        }

        setRecords(loadedRecords);
      } catch (error) {
        if (!isMounted || isSessionInvalidationError(error)) {
          return;
        }

        const normalizedError = normalizeApiError(error);
        setErrorMessage(
          normalizedError.status === 403
            ? "Seu perfil não tem permissão no backend para consultar esta área."
            : normalizedError.message,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadApprovalRequests();

    return () => {
      isMounted = false;
    };
  }, [scope]);

  async function handleApprove(recordId: string) {
    try {
      await approvePendingRecord(recordId);
      setRecords((current) => current.filter((record) => record.id !== recordId));
      showToast({
        title: "Solicitação aprovada com sucesso",
        description: "A solicitação foi consolidada pelo backend.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Não foi possível aprovar a solicitação",
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
        title: "Solicitação rejeitada com sucesso",
        description: "A solicitação foi removida da fila.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Não foi possível rejeitar a solicitação",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    }
  }

  return (
    <>
      <DashboardPageHeader
        title={title}
        subtitle={
          scope === "mine"
            ? `${records.length} solicitações encontradas`
            : `${records.length} solicitações aguardando revisão`
        }
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
            statusMode={scope === "mine" ? "all" : "pending-only"}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : null}
      </div>
    </>
  );
}
