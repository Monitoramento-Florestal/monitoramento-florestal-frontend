import { UserRole } from "@/constants/roles";
import type {
  Tree,
  TreeApprovalRequest,
  TreeMeasurementRecord,
  TreeRequestType,
  TreeStatus,
} from "@/types/trees";

export type TreeRecordFormMode = "create-tree" | "create-record" | "edit-record";

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
  saudavel: "Saudavel",
  injuria: "Com injuria",
  cortada: "Cortada",
};

export const TREE_REQUEST_TYPE_LABELS: Record<TreeRequestType, string> = {
  create_tree: "Criacao de arvore",
  create_record: "Novo registro",
  edit_record: "Edicao de registro",
};

export function getTreeRecordFormValues(tree?: Tree | null, record?: TreeMeasurementRecord | null): TreeRecordFormValues {
  const sourceRecord = record ?? tree?.records[tree.records.length - 1] ?? null;

  return {
    bairro: sourceRecord?.localizacao.bairro ?? "",
    rua: sourceRecord?.localizacao.rua ?? "",
    dataColeta: sourceRecord?.localizacao.dataColeta.slice(0, 10) ?? "",
    equipe: sourceRecord?.localizacao.equipe ?? "",
    numeroResidencia: sourceRecord?.localizacao.numeroResidencia ?? "",
    referencia: sourceRecord?.localizacao.referencia ?? "",
    lat: tree ? String(tree.lat) : "",
    lng: tree ? String(tree.lng) : "",
    nomeComum: tree?.nomeComum ?? "",
    especie: tree?.especie ?? "",
    dapCm: sourceRecord ? String(sourceRecord.dimensoes.dapCm) : "",
    alturaM: sourceRecord ? String(sourceRecord.dimensoes.alturaM) : "",
    copaM: sourceRecord ? String(sourceRecord.dimensoes.copaM) : "",
    medidaEstimada: sourceRecord?.dimensoes.medidaEstimada ?? false,
    estadoGeral: sourceRecord ? String(sourceRecord.condicao.estadoGeral) as TreeRecordFormValues["estadoGeral"] : "3",
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

export function getTreeRecordFormSubtitle(role: UserRole, mode: TreeRecordFormMode) {
  if (mode === "create-tree") {
    return role === UserRole.RESEARCHER
      ? "Crie uma nova arvore com seu registro tecnico inicial. O envio passara por aprovacao."
      : "Cadastre uma nova arvore com seu registro tecnico inicial.";
  }

  if (mode === "create-record") {
    return role === UserRole.RESEARCHER
      ? "Adicione uma nova medicao tecnica para esta arvore. O envio passara por aprovacao."
      : "Adicione uma nova medicao tecnica para esta arvore.";
  }

  return role === UserRole.RESEARCHER
    ? "Proponha alteracoes para este registro tecnico. O registro aprovado atual sera preservado ate a decisao."
    : "Edite diretamente este registro tecnico.";
}

export function getTreeRecordSubmitLabel(role: UserRole, mode: TreeRecordFormMode) {
  if (mode === "create-tree") {
    return role === UserRole.RESEARCHER ? "Enviar para aprovacao" : "Salvar arvore";
  }

  if (mode === "create-record") {
    return role === UserRole.RESEARCHER ? "Enviar novo registro" : "Salvar registro";
  }

  return role === UserRole.RESEARCHER ? "Enviar solicitacao de edicao" : "Salvar alteracoes";
}

export function getTreeRecordFooterHint(role: UserRole, mode: TreeRecordFormMode) {
  if (role !== UserRole.RESEARCHER) {
    return mode === "create-tree"
      ? "A arvore e o registro inicial serao criados imediatamente no sistema."
      : "As alteracoes serao aplicadas diretamente ao historico aprovado.";
  }

  if (mode === "create-tree") {
    return "Sua solicitacao criara a arvore e o primeiro registro apos aprovacao.";
  }

  if (mode === "create-record") {
    return "O novo registro sera anexado a esta arvore apenas apos aprovacao.";
  }

  return "A edicao criara uma solicitacao separada e o registro atual seguira visivel ate aprovacao.";
}

export function getTreeHistorySummary(tree: Tree) {
  return `${tree.records.length} registros aprovados`;
}

export function getLatestRecord(tree: Tree) {
  return tree.records[tree.records.length - 1];
}

export function getPendingRequestsForTree(requests: TreeApprovalRequest[], treeId: string) {
  return requests.filter((request) => request.treeId === treeId && request.status === "pendente");
}
