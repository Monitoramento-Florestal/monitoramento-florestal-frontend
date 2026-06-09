import type { ApprovalStatus, TreeProblem, Tree } from "@/types/trees";

export function formatTreeDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatTreeLabel(value: string) {
  const normalized = value
    .replaceAll("calcada", "calçada")
    .replaceAll("injuria", "injúria")
    .replaceAll("fiacao", "fiação")
    .replaceAll("veiculos", "veículos")
    .replaceAll("onibus", "ônibus")
    .replaceAll("praca", "praça")
    .replaceAll("acao", "ação")
    .replaceAll("conducao", "condução")
    .replaceAll("fitossanitario", "fitossanitário")
    .replaceAll("ampliacao", "ampliação")
    .replaceAll("substituicao", "substituição")
    .replaceAll("supressao", "supressão");

  return normalized
    .split(/[\s/]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const APPROVAL_LABEL: Record<ApprovalStatus, string> = {
  aprovada: "Aprovada",
  pendente: "Pendente",
  rejeitada: "Rejeitada",
};

export const APPROVAL_TONE: Record<ApprovalStatus, string> = {
  aprovada: "border-emerald/20 bg-emerald/8 text-emerald",
  pendente: "border-amber/20 bg-amber/8 text-amber",
  rejeitada: "border-red/20 bg-red/8 text-red",
};

export function getTreeCoverPhoto(tree: Tree): string | null {
  const fotos = tree.registro.fotos;
  return fotos.length > 0 ? fotos[0] : null;
}

const PROBLEM_LABELS: Record<TreeProblem, string> = {
  pragas: "Pragas",
  fungos: "Fungos",
  podridao: "Podridão",
  injuria: "Injúria",
  nenhum: "Nenhum",
};

export function getTreeProblemLabels(tree: Tree): string[] {
  return tree.condicao.problemas
    .filter((p) => p !== "nenhum")
    .map((p) => PROBLEM_LABELS[p]);
}
