import type { ApprovalStatus, Tree } from "@/types/trees";

export const APPROVAL_LABEL: Record<ApprovalStatus, string> = {
  aprovada: "Aprovada",
  pendente: "Pendente",
  rejeitada: "Rejeitada",
};

export const APPROVAL_TONE: Record<ApprovalStatus, string> = {
  aprovada: "bg-sage/16 text-sage border-sage/20",
  pendente: "bg-[#c47c2b]/12 text-[#8a571d] border-[#c47c2b]/20",
  rejeitada: "bg-burgundy/8 text-burgundy border-burgundy/15",
};

export function getTreeCoverPhoto(tree: Tree) {
  return tree.registro.fotos[0] ?? null;
}

export function getTreeProblemLabels(tree: Tree) {
  return tree.condicao.problemas[0] === "nenhum"
    ? ["Nenhum problema relatado"]
    : tree.condicao.problemas.map(formatTreeLabel);
}

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
