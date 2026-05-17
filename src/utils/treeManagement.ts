import { UserRole } from "@/constants/roles";
import type { Tree, TreeStatus } from "@/types/trees";

export type TreeManagementStatusFilter = "all" | TreeStatus;

export interface TreeManagementPolicy {
  canDelete: boolean;
  canDirectEdit: boolean;
  canOpenDetails: boolean;
  canProposeEdit: boolean;
}

export interface TreeManagementActionFeedback {
  description: string;
  title: string;
}

export interface TreeManagementFilterOption {
  label: string;
  value: TreeManagementStatusFilter;
}

export const TREE_MANAGEMENT_FILTERS: TreeManagementFilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "Saudaveis", value: "saudavel" },
  { label: "Com injuria", value: "injuria" },
  { label: "Cortadas", value: "cortada" },
];

const TREE_STATUS_LABELS: Record<TreeStatus, string> = {
  saudavel: "Saudavel",
  injuria: "Com injuria",
  cortada: "Cortada",
};

export function getTreeManagementPolicy(role: UserRole): TreeManagementPolicy {
  if (role === UserRole.RESEARCHER) {
    return {
      canDelete: false,
      canDirectEdit: false,
      canOpenDetails: true,
      canProposeEdit: true,
    };
  }

  return {
    canDelete: true,
    canDirectEdit: true,
    canOpenDetails: true,
    canProposeEdit: false,
  };
}

export function getTreeManagementStatusLabel(status: TreeStatus) {
  return TREE_STATUS_LABELS[status];
}

export function filterManagedTrees(
  trees: Tree[],
  query: string,
  status: TreeManagementStatusFilter
) {
  const normalizedQuery = query.trim().toLowerCase();

  return trees.filter((tree) => {
    const matchesStatus = status === "all" || tree.status === status;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      tree.codigo,
      tree.nomeComum,
      tree.especie,
      tree.localizacao.bairro,
      tree.localizacao.rua,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getTreeManagementSummary(total: number, visible: number) {
  return `${visible} de ${total} registros`;
}


