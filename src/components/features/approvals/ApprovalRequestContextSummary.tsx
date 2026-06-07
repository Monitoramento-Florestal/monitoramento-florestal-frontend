"use client";

import type { TreeApprovalRequest } from "@/types/trees";
import { formatDate } from "@/utils/format";
import {
  getApprovalRecordCode,
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
      <SummaryItem label="Tipo da Solicitacao" value={getApprovalRecordTypeLabel(request)} />
      <SummaryItem label="Codigo" value={getApprovalRecordCode(request)} />
      <SummaryItem label="Especie" value={getApprovalRecordSpecies(request)} />
      <SummaryItem label="Submetido por" value={request.submittedBy} />
      <SummaryItem label="Nome Comum" value={getApprovalRecordName(request)} />
      <SummaryItem label="Data da Submissao" value={formatDate(request.submittedAt)} />
      <SummaryItem
        label="Arvore Vinculada"
        value={request.treeId ?? "Nova arvore em analise"}
      />
      <SummaryItem
        label="Registro Alvo"
        value={request.type === "create_record" ? "Novo registro pendente" : "Novo cadastro"}
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
