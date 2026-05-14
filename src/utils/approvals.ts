import type { Tree } from "@/types/trees";
import { formatDate } from "@/utils/format";

export function getApprovalRecordStatusLabel(tree: Tree) {
  if (tree.status === "saudavel") {
    return "Saudavel";
  }

  if (tree.status === "injuria") {
    return "Com injuria";
  }

  return "Cortada";
}

export function getPendingApprovalRecords(trees: Tree[]) {
  return trees.filter((tree) => tree.registro.aprovacao === "pendente");
}

export function approveRecord(records: Tree[], id: string) {
  const approvedAt = new Date().toISOString();

  return records
    .map((record) =>
      record.id === id
        ? {
            ...record,
            registro: {
              ...record.registro,
              aprovacao: "aprovada" as const,
              aprovadoEm: approvedAt,
            },
          }
        : record
    )
    .filter((record) => record.registro.aprovacao === "pendente");
}

export function rejectRecord(records: Tree[], id: string, reason: string) {
  return records
    .map((record) =>
      record.id === id
        ? {
            ...record,
            registro: {
              ...record.registro,
              aprovacao: "rejeitada" as const,
              motivoRejeicao: reason,
            },
          }
        : record
    )
    .filter((record) => record.registro.aprovacao === "pendente");
}

export function getApprovalRecordImage(tree: Tree) {
  return tree.registro.fotos[0] ?? null;
}

export function getApprovalRecordMetrics(tree: Tree) {
  return [
    { label: "Altura", value: `${tree.dimensoes.alturaM} m` },
    { label: "DAP", value: `${tree.dimensoes.dapCm} cm` },
    { label: "Copa", value: `${tree.dimensoes.copaM} m` },
    { label: "Coleta", value: formatDate(tree.localizacao.dataColeta) },
  ];
}

export function getApprovalFeedbackMessage(kind: "approved" | "rejected", tree: Tree) {
  if (kind === "approved") {
    return {
      title: "Registro aprovado",
      description: `${tree.nomeComum} saiu da fila e esta pronto para a proxima etapa.`,
      tone: "success" as const,
    };
  }

  return {
    title: "Registro rejeitado",
    description: `${tree.nomeComum} foi devolvido para correcao com justificativa registrada.`,
    tone: "danger" as const,
  };
}
