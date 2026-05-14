"use client";

import { useMemo, useState } from "react";

import { DashboardCard } from "@/components/features/dashboard";
import {
  approveRecord,
  getApprovalFeedbackMessage,
  getPendingApprovalRecords,
  rejectRecord,
} from "@/utils/approvals";
import type { Tree } from "@/types/trees";
import { ApprovalRecordCard } from "./ApprovalRecordCard";
import { ApprovalsEmptyState } from "./ApprovalsEmptyState";
import { ApprovalsLoadingState } from "./ApprovalsLoadingState";
import { RejectReasonDialog } from "./RejectReasonDialog";

interface ApprovalsScreenProps {
  initialRecords: Tree[];
  loading?: boolean;
}

interface FeedbackState {
  description: string;
  title: string;
  tone: "danger" | "success";
}

export function ApprovalsScreen({
  initialRecords,
  loading = false,
}: ApprovalsScreenProps) {
  const [records, setRecords] = useState<Tree[]>(() =>
    getPendingApprovalRecords(initialRecords)
  );
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const rejectTarget = useMemo(
    () => records.find((record) => record.id === rejectTargetId) ?? null,
    [records, rejectTargetId]
  );

  function handleApprove(id: string) {
    const target = records.find((record) => record.id === id);

    if (!target) {
      return;
    }

    setRecords((current) => approveRecord(current, id));
    setFeedback(getApprovalFeedbackMessage("approved", target));
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
    setFeedback(getApprovalFeedbackMessage("rejected", rejectTarget));
    setRejectTargetId(null);
    setRejectReason("");
    setRejectError("");
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          <DashboardCard className="grain">
            <p className="text-[10px] uppercase tracking-[0.2em] text-rosewood/80">
              Records management
            </p>
            <h2 className="mt-2 text-[1.45rem] tracking-tight text-burgundy">
              Fila de revisao de registros
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-rosewood">
              Revise medicoes e submissoes pendentes sem misturar esta rotina com
              o gerenciamento consolidado das arvores do sistema.
            </p>
          </DashboardCard>

          <DashboardCard>
            <p className="text-[10px] uppercase tracking-[0.2em] text-rosewood/80">
              Status da fila
            </p>
            <div className="mt-3 text-4xl tracking-tight text-burgundy">
              {records.length}
            </div>
            <p className="mt-2 text-sm leading-6 text-rosewood">
              {records.length === 1
                ? "1 registro aguarda revisao."
                : `${records.length} registros aguardam revisao.`}
            </p>
          </DashboardCard>
        </div>

        {feedback ? (
          <DashboardCard
            className={
              feedback.tone === "success"
                ? "border-sage/20 bg-sage/8"
                : "border-burgundy/15 bg-burgundy/6"
            }
          >
            <h3 className="text-base tracking-tight text-burgundy">
              {feedback.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-rosewood">
              {feedback.description}
            </p>
          </DashboardCard>
        ) : null}

        {loading ? <ApprovalsLoadingState /> : null}

        {!loading && records.length === 0 ? <ApprovalsEmptyState /> : null}

        {!loading && records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
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
