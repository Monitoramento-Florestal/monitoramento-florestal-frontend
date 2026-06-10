"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardCard } from "@/components/features/dashboard";
import { useToast } from "@/components/ui/toast";
import type { TreeApprovalRequest } from "@/types/trees";
import {
  filterApprovalRecords,
  getApprovalRecordName,
  getPendingApprovalRecords,
  type ApprovalSearchField,
} from "@/utils/approvals";

import { ApprovalRecordCard } from "./ApprovalRecordCard";
import { ApprovalRequestDetailDrawer } from "./ApprovalRequestDetailDrawer";
import { ApprovalsEmptyState } from "./ApprovalsEmptyState";
import { ApprovalsFilters } from "./ApprovalsFilters";
import { ApprovalsLoadingState } from "./ApprovalsLoadingState";
import { RejectReasonDialog } from "./RejectReasonDialog";

interface ApprovalsScreenProps {
  canReview?: boolean;
  initialRecords: TreeApprovalRequest[];
  loading?: boolean;
  statusMode?: "pending-only" | "all";
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string, reason: string) => Promise<void>;
}

function applyStatusMode(
  records: TreeApprovalRequest[],
  statusMode: "pending-only" | "all",
) {
  return statusMode === "pending-only" ? getPendingApprovalRecords(records) : records;
}

export function ApprovalsScreen({
  canReview = true,
  initialRecords,
  loading = false,
  statusMode = "pending-only",
  onApprove,
  onReject,
}: ApprovalsScreenProps) {
  const { showToast } = useToast();
  const [records, setRecords] = useState<TreeApprovalRequest[]>(() =>
    applyStatusMode(initialRecords, statusMode),
  );
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<ApprovalSearchField>("researcher");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(applyStatusMode(initialRecords, statusMode));
  }, [initialRecords, statusMode]);

  const filteredRecords = useMemo(
    () => filterApprovalRecords(records, query, searchField),
    [records, query, searchField],
  );

  const rejectTarget = useMemo(
    () => records.find((record) => record.id === rejectTargetId) ?? null,
    [records, rejectTargetId],
  );

  const selectedRequest = useMemo(
    () => records.find((record) => record.id === selectedRequestId) ?? null,
    [records, selectedRequestId],
  );

  async function handleApprove(id: string) {
    if (!records.some((record) => record.id === id)) {
      return;
    }

    if (!canReview || !onApprove) {
      showToast({
        title: "Ação indisponível para este perfil",
        description: "Seu perfil não tem permissão para concluir esta ação.",
        variant: "info",
      });
      return;
    }

    try {
      setActiveActionId(id);
      await onApprove(id);
      setRecords((current) => current.filter((record) => record.id !== id));
      setSelectedRequestId((current) => (current === id ? null : current));
    } finally {
      setActiveActionId(null);
    }
  }

  function handleStartReject(id: string) {
    setRejectTargetId(id);
    setRejectReason("");
    setRejectError("");
  }

  function handleOpenDetails(id: string) {
    setSelectedRequestId(id);
  }

  function handleCloseDetails() {
    setSelectedRequestId(null);
  }

  async function handleConfirmReject() {
    if (!rejectTarget) {
      return;
    }

    if (!rejectReason.trim()) {
      setRejectError("Informe um motivo curto antes de rejeitar esta solicitação.");
      return;
    }

    if (!canReview || !onReject) {
      showToast({
        title: "Ação indisponível para este perfil",
        description: "Seu perfil não tem permissão para concluir esta ação.",
        variant: "info",
      });
      return;
    }

    try {
      setActiveActionId(rejectTarget.id);
      await onReject(rejectTarget.id, rejectReason.trim());
      setRecords((current) => current.filter((record) => record.id !== rejectTarget.id));
      setSelectedRequestId((current) => (current === rejectTarget.id ? null : current));
      setRejectTargetId(null);
      setRejectReason("");
      setRejectError("");
    } finally {
      setActiveActionId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardCard className="px-4 py-4 sm:px-5">
          <ApprovalsFilters
            query={query}
            searchField={searchField}
            onFieldChange={setSearchField}
            onQueryChange={setQuery}
          />
        </DashboardCard>

        {loading ? <ApprovalsLoadingState /> : null}

        {!loading && filteredRecords.length === 0 ? (
          <ApprovalsEmptyState hasFilters={query.trim().length > 0} />
        ) : null}

        {!loading && filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <ApprovalRecordCard
                key={record.id}
                request={record}
                canReview={canReview}
                isActing={activeActionId === record.id}
                onApprove={handleApprove}
                onOpenDetails={handleOpenDetails}
                onReject={handleStartReject}
              />
            ))}
          </div>
        ) : null}
      </div>

      <RejectReasonDialog
        open={Boolean(rejectTarget)}
        treeName={rejectTarget ? getApprovalRecordName(rejectTarget) : undefined}
        isSubmitting={Boolean(rejectTarget && activeActionId === rejectTarget.id)}
        reason={rejectReason}
        errorMessage={rejectError}
        onChangeReason={setRejectReason}
        onCancel={() => {
          setRejectTargetId(null);
          setRejectReason("");
          setRejectError("");
        }}
        onConfirm={handleConfirmReject}
      />

      <ApprovalRequestDetailDrawer
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        canReview={canReview}
        isActing={Boolean(selectedRequest && activeActionId === selectedRequest.id)}
        onClose={handleCloseDetails}
        onApprove={handleApprove}
        onReject={handleStartReject}
      />
    </>
  );
}
