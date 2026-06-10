import type { TreeApprovalRequest } from "@/types/trees";
import { formatDate } from "@/utils/format";
import { TREE_RECORD_STATUS_LABELS, TREE_REQUEST_TYPE_LABELS } from "@/utils/treeRecords";

export type ApprovalSearchField = "researcher" | "species";

export function getPendingApprovalRecords(requests: TreeApprovalRequest[]) {
  return requests.filter((request) => request.status === "pendente");
}

export function filterApprovalRecords(
  records: TreeApprovalRequest[],
  query: string,
  field: ApprovalSearchField,
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return records;
  }

  return records.filter((record) => {
    if (field === "researcher") {
      return record.submittedBy.toLowerCase().includes(normalizedQuery);
    }

    const species = record.treeDraft?.especie ?? getApprovalRecordSpecies(record);
    return species.toLowerCase().includes(normalizedQuery);
  });
}

export function approveRecord(records: TreeApprovalRequest[], id: string) {
  return records.filter((record) => record.id !== id);
}

export function rejectRecord(records: TreeApprovalRequest[], id: string, reason: string) {
  return records
    .map((record) =>
      record.id === id
        ? {
            ...record,
            status: "rejeitada" as const,
            rejectionReason: reason,
          }
        : record,
    )
    .filter((record) => record.status === "pendente");
}

export function getApprovalRecordCode(record: TreeApprovalRequest) {
  return record.treeDraft?.codigo ?? record.treeMeta.codigo;
}

export function getApprovalRecordName(record: TreeApprovalRequest) {
  const commonName = record.treeDraft?.nomeComum?.trim() || record.treeMeta.nomeComum?.trim();
  const species = record.treeDraft?.especie?.trim() || record.treeMeta.especie?.trim();

  return commonName || species || "Nova árvore em análise";
}

export function getApprovalRecordSpecies(record: TreeApprovalRequest) {
  return record.treeDraft?.especie?.trim() || record.treeMeta.especie?.trim() || "Não informada";
}

export function getApprovalRecordLinkedTreeLabel(record: TreeApprovalRequest) {
  if (record.type === "create_tree") {
    return "Nova árvore em análise";
  }

  return `${getApprovalRecordName(record)} (${getApprovalRecordCode(record)})`;
}

export function getApprovalRecordTypeLabel(record: TreeApprovalRequest) {
  return TREE_REQUEST_TYPE_LABELS[record.type];
}

export function getApprovalRecordStatusLabel(record: TreeApprovalRequest) {
  return TREE_RECORD_STATUS_LABELS[record.record.status];
}

export function getApprovalRecordImage(record: TreeApprovalRequest) {
  return record.record.registro.fotos[0] ?? null;
}

export function getApprovalRecordMetrics(record: TreeApprovalRequest) {
  return [
    { label: "Altura", value: `${record.record.dimensoes.alturaM} m` },
    { label: "DAP", value: `${record.record.dimensoes.dapCm} cm` },
    { label: "Copa", value: `${record.record.dimensoes.copaM} m` },
    { label: "Coleta", value: formatDate(record.record.localizacao.dataColeta) },
  ];
}
