"use client";

import type { TreeApprovalRequest } from "@/types/trees";
import { formatDate } from "@/utils/format";
import {
  getApprovalRecordCode,
  getApprovalRecordLinkedTreeLabel,
  getApprovalRecordName,
  getApprovalRecordSpecies,
  getApprovalRecordTypeLabel,
} from "@/utils/approvals";

interface ApprovalRequestContextSummaryProps {
  request: TreeApprovalRequest;
}

export function ApprovalRequestContextSummary({
  request,
}: ApprovalRequestContextSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <SummaryItem label="Tipo da solicitação" value={getApprovalRecordTypeLabel(request)} />
      <SummaryItem label="Código" value={getApprovalRecordCode(request)} />
      <SummaryItem label="Espécie" value={getApprovalRecordSpecies(request)} />
      <SummaryItem label="Submetido por" value={request.submittedBy} />
      <SummaryItem label="Nome comum" value={getApprovalRecordName(request)} />
      <SummaryItem label="Data da submissão" value={formatDate(request.submittedAt)} />
      <SummaryItem label="Árvore vinculada" value={getApprovalRecordLinkedTreeLabel(request)} />
      <SummaryItem
        label="Destino do registro"
        value={
          request.type === "create_tree"
            ? "Novo cadastro de árvore"
            : request.targetRecordId
              ? `Registro ${request.targetRecordId.slice(0, 8)}`
              : "Novo registro técnico"
        }
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
