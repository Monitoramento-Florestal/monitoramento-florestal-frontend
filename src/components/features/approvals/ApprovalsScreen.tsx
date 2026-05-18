"use client";

import { useMemo, useState } from "react";

import { DashboardCard } from "@/components/features/dashboard";
import {
  approveRecord,
  filterApprovalRecords,
  getPendingApprovalRecords,
  rejectRecord,
  type ApprovalSearchField,
} from "@/utils/approvals";
import type { Tree } from "@/types/trees";
import { ApprovalRecordCard } from "./ApprovalRecordCard";
import { ApprovalsEmptyState } from "./ApprovalsEmptyState";
import { ApprovalsFilters } from "./ApprovalsFilters";
import { ApprovalsLoadingState } from "./ApprovalsLoadingState";
import { RejectReasonDialog } from "./RejectReasonDialog";

interface ApprovalsScreenProps {
  initialRecords: Tree[];
  loading?: boolean;
}

export function ApprovalsScreen({
  initialRecords,
  loading = false,
}: ApprovalsScreenProps) {
  const [records, setRecords] = useState<Tree[]>(() =>
    getPendingApprovalRecords(initialRecords)
  );
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState<ApprovalSearchField>("researcher");
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const filteredRecords = useMemo(
    () => filterApprovalRecords(records, query, searchField),
    [records, query, searchField]
  );

  const rejectTarget = useMemo(
    () => records.find((record) => record.id === rejectTargetId) ?? null,
    [records, rejectTargetId]
  );

  function handleApprove(id: string) {
    if (!records.some((record) => record.id === id)) {
      return;
    }

    setRecords((current) => approveRecord(current, id));
  }

  function handleStartReject(id: string) {
    setRejectTargetId(id);
    setRejectReason("");
    setRejectError("");
  }

  function handleConfirmReject() {
    if (!rejectTarget) {
      return;
    }

    if (!rejectReason.trim()) {
      setRejectError("Informe um motivo curto antes de rejeitar este registro.");
      return;
    }

    setRecords((current) => rejectRecord(current, rejectTarget.id, rejectReason.trim()));
    setRejectTargetId(null);
    setRejectReason("");
    setRejectError("");
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
                tree={record}
                onApprove={handleApprove}
                onReject={handleStartReject}
              />
            ))}
          </div>
        ) : null}
      </div>

      <RejectReasonDialog
        open={Boolean(rejectTarget)}
        treeName={rejectTarget?.nomeComum}
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
    </>
  );
}
