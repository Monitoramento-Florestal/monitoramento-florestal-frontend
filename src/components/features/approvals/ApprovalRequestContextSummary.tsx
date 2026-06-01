"use client";

import { formatDate } from "@/utils/format";
import {
  getApprovalRecordCode,
  getApprovalRecordName,
  getApprovalRecordSpecies,
  getApprovalRecordTypeLabel,
} from "@/utils/approvals";
import type { TreeApprovalRequest } from "@/types/trees";

interface ApprovalRequestContextSummaryProps {
  request: TreeApprovalRequest;
}

export function ApprovalRequestContextSummary({
  request,
}: ApprovalRequestContextSummaryProps) {
  const targetRecordLabel = request.targetRecordId
    ? request.targetRecordId.replace(`${request.treeId}-record-`, "v")
    : null;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <SummaryItem label="Tipo da solicitação" value={getApprovalRecordTypeLabel(request)} />
      <SummaryItem label="Código" value={getApprovalRecordCode(request)} />
      <SummaryItem label="Espécie" value={getApprovalRecordSpecies(request)} />
      <SummaryItem label="Submetido por" value={request.submittedBy} />
      <SummaryItem label="Nome comum" value={getApprovalRecordName(request)} />
      <SummaryItem label="Data da submissão" value={formatDate(request.submittedAt)} />
      <SummaryItem
        label="Árvore vinculada"
        value={request.treeId ?? "Nova árvore em análise"}
      />
      <SummaryItem
        label="Registro alvo"
        value={targetRecordLabel ?? "Sem vínculo com registro anterior"}
      />
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-rosewood/10 bg-card/55 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">{label}</p>
      <p className="mt-2 text-sm text-burgundy">{value}</p>
    </div>
  );
}
