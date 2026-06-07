import { UserRole } from "@/constants/roles";
import type {
  Tree,
  TreeApprovalRequest,
  TreeMeasurementRecord,
  TreeRequestType,
  TreeStatus,
} from "@/types/trees";

export type TreeRecordFormMode = "create-tree" | "create-record" | "edit-record";

function hasFiniteCoordinate(value: number | null | undefined) {
  return Number.isFinite(value);
}

export interface TreeRecordFormValues {
  bairro: string;
  rua: string;
  dataColeta: string;
  equipe: string;
  numeroResidencia: string;
  referencia: string;
  lat: string;
  lng: string;
  nomeComum: string;
  especie: string;
  dapCm: string;
  alturaM: string;
  copaM: string;
  medidaEstimada: boolean;
  estadoGeral: "1" | "2" | "3" | "4" | "5";
  vigor: "alto" | "medio" | "baixo";
  problemas: string[];
  posicaoProblema: "tronco" | "raiz" | "copa" | "";
  tronco: string[];
  baseColo: string[];
  copa: string[];
  inclinacaoTronco: string;
  ancoragemRadicular: string;
  alvosPotenciais: string[];
  fluxoVeiculos: string;
  fluxoPedestres: string;
  tipoVia: string;
  alvosSensiveis: string[];
  fiacao: string;
  calcada: string;
  iluminacao: string;
  edificacao: string;
  manejoAcao: string;
  manejoPrioridade: string;
  observacoes: string;
}

export const TREE_RECORD_STATUS_LABELS: Record<TreeStatus, string> = {
  saudavel: "Saudável",
  injuria: "Com injúria",
  cortada: "Cortada",
};

export const TREE_REQUEST_TYPE_LABELS: Record<TreeRequestType, string> = {
  create_tree: "Criação de árvore",
  create_record: "Novo registro",
  edit_record: "Edição de registro",
};

export function getTreeRecordFormValues(
  tree?: Tree | null,
  record?: TreeMeasurementRecord | null,
): TreeRecordFormValues {
  const sourceRecord = record ?? tree?.records[tree.records.length - 1] ?? null;

  return {
    bairro: sourceRecord?.localizacao.bairro ?? "",
    rua: sourceRecord?.localizacao.rua ?? "",
    dataColeta: sourceRecord?.localizacao.dataColeta.slice(0, 10) ?? "",
    equipe: sourceRecord?.localizacao.equipe ?? "",
    numeroResidencia: sourceRecord?.localizacao.numeroResidencia ?? "",
    referencia: sourceRecord?.localizacao.referencia ?? "",
    lat: tree && hasFiniteCoordinate(tree.lat) ? String(tree.lat) : "",
    lng: tree && hasFiniteCoordinate(tree.lng) ? String(tree.lng) : "",
    nomeComum: tree?.nomeComum ?? "",
    especie: tree?.especie ?? "",
    dapCm: sourceRecord ? String(sourceRecord.dimensoes.dapCm) : "",
    alturaM: sourceRecord ? String(sourceRecord.dimensoes.alturaM) : "",
    copaM: sourceRecord ? String(sourceRecord.dimensoes.copaM) : "",
    medidaEstimada: sourceRecord?.dimensoes.medidaEstimada ?? false,
    estadoGeral: sourceRecord
      ? (String(sourceRecord.condicao.estadoGeral) as TreeRecordFormValues["estadoGeral"])
      : "3",
    vigor: sourceRecord?.condicao.vigor ?? "medio",
    problemas: sourceRecord?.condicao.problemas ?? [],
    posicaoProblema: sourceRecord?.condicao.posicaoProblema ?? "",
    tronco: sourceRecord?.estruturaRisco.tronco ?? [],
    baseColo: sourceRecord?.estruturaRisco.baseColo ?? [],
    copa: sourceRecord?.estruturaRisco.copa ?? [],
    inclinacaoTronco: sourceRecord?.estruturaRisco.inclinacaoTronco ?? "ausente",
    ancoragemRadicular: sourceRecord?.estruturaRisco.ancoragemRadicular ?? "estavel",
    alvosPotenciais: sourceRecord?.estruturaRisco.alvosPotenciais ?? [],
    fluxoVeiculos: sourceRecord?.estruturaRisco.fluxoVeiculos ?? "baixo",
    fluxoPedestres: sourceRecord?.estruturaRisco.fluxoPedestres ?? "baixo",
    tipoVia: sourceRecord?.estruturaRisco.tipoVia ?? "residencial",
    alvosSensiveis: sourceRecord?.estruturaRisco.alvosSensiveis ?? [],
    fiacao: sourceRecord?.conflitos.fiacao ?? "ausente",
    calcada: sourceRecord?.conflitos.calcada ?? "sem dano",
    iluminacao: sourceRecord?.conflitos.iluminacao ?? "sem",
    edificacao: sourceRecord?.conflitos.edificacao ?? "sem",
    manejoAcao: sourceRecord?.manejo.acao ?? "nenhuma",
    manejoPrioridade: sourceRecord?.manejo.prioridade ?? "baixa",
    observacoes: sourceRecord?.observacoes ?? "",
  };
}

export function getTreeRecordFormSubtitle(_: UserRole, mode: TreeRecordFormMode) {
  if (mode === "create-tree") {
    return "Cadastre uma nova árvore com o registro técnico inicial para análise.";
  }

  if (mode === "create-record") {
    return "Adicione uma nova medição técnica para esta árvore.";
  }

  return "Proponha alterações para este registro técnico.";
}

export function getTreeRecordSubmitLabel(_: UserRole, mode: TreeRecordFormMode) {
  if (mode === "create-tree") {
    return "Enviar solicitação";
  }

  if (mode === "create-record") {
    return "Enviar registro";
  }

  return "Enviar solicitação de edição";
}

export function getTreeHistorySummary(tree: Tree) {
  return `${tree.records.length} registros no histórico`;
}

export function getLatestRecord(tree: Tree) {
  return tree.records[tree.records.length - 1];
}

export function getPendingRequestsForTree(requests: TreeApprovalRequest[], treeId: string) {
  return requests.filter((request) => request.treeId === treeId && request.status === "pendente");
}
