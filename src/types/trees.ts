export type TreeStatus = "saudavel" | "injuria" | "cortada";
export type ApprovalStatus = "aprovada" | "pendente" | "rejeitada";

export type TreeVigor = "alto" | "medio" | "baixo";
export type TreeProblem = "pragas" | "fungos" | "podridao" | "injuria" | "nenhum";
export type TreeProblemPosition = "tronco" | "raiz" | "copa";

export type TreeTrunkIssue =
  | "sem defeitos"
  | "fissuras longitudinais"
  | "cavidades"
  | "apodrecimento"
  | "descascamento";

export type TreeBaseIssue =
  | "normal"
  | "raiz exposta"
  | "solo compactado"
  | "levantamento de calcada"
  | "inclinacao da base";

export type TreeCanopyIssue =
  | "assimetrica"
  | "excesso de peso lateral"
  | "galhos secos"
  | "galhos codominantes";

export type TreeTrunkLean = "ausente" | "leve" | "moderada" | "critica";
export type TreeRootAnchorage = "estavel" | "parcialmente comprometida" | "comprometida";

export type TreePotentialTarget =
  | "pedestres"
  | "veiculos"
  | "residencia"
  | "equipamento publico"
  | "sem alvo relevante";

export type TreeFlowLevel = "baixo" | "medio" | "alto";
export type TreeRoadType = "residencial" | "coletora" | "arterial" | "comercial/central";
export type TreeSensitiveTarget =
  | "escola"
  | "hospital"
  | "parada de onibus"
  | "praca/area de lazer"
  | "nenhum";

export type WiringConflict = "ausente" | "potencial" | "conflito";
export type SidewalkConflict = "sem dano" | "leve" | "severo";
export type LightingConflict = "sem" | "parcial" | "bloqueio";
export type BuildingConflict = "sem" | "potencial" | "conflito";

export type TreeManagementAction =
  | "nenhuma"
  | "poda leve"
  | "poda conducao"
  | "poda pesada"
  | "controle fitossanitario"
  | "ampliacao canteiro"
  | "substituicao"
  | "supressao";

export type TreeManagementPriority = "baixa" | "media" | "alta" | "emergencial";

export interface TreeLocation {
  bairro: string;
  rua: string;
  dataColeta: string;
  equipe: string;
  numeroResidencia?: string;
  referencia?: string;
}

export interface TreeDimensions {
  dapCm: number;
  alturaM: number;
  copaM: number;
  medidaEstimada: boolean;
}

export interface TreeCondition {
  estadoGeral: 1 | 2 | 3 | 4 | 5;
  vigor: TreeVigor;
  problemas: TreeProblem[];
  posicaoProblema: TreeProblemPosition | null;
}

export interface TreeStructureRisk {
  tronco: TreeTrunkIssue[];
  baseColo: TreeBaseIssue[];
  copa: TreeCanopyIssue[];
  inclinacaoTronco: TreeTrunkLean;
  ancoragemRadicular: TreeRootAnchorage;
  alvosPotenciais: TreePotentialTarget[];
  fluxoVeiculos: TreeFlowLevel;
  fluxoPedestres: TreeFlowLevel;
  tipoVia: TreeRoadType;
  alvosSensiveis: TreeSensitiveTarget[];
}

export interface TreeConflicts {
  fiacao: WiringConflict;
  calcada: SidewalkConflict;
  iluminacao: LightingConflict;
  edificacao: BuildingConflict;
}

export interface TreeManagement {
  acao: TreeManagementAction;
  prioridade: TreeManagementPriority;
}

export interface TreeRecord {
  aprovadoEm?: string;
  aprovacao: ApprovalStatus;
  fotos: string[];
  motivoRejeicao?: string;
  registradoEm: string;
  registradoPor: string;
  ultimaMedicao: string;
}

export interface Tree {
  id: string;
  codigo: string;
  especie: string;
  nomeComum: string;
  status: TreeStatus;
  lat: number;
  lng: number;
  localizacao: TreeLocation;
  dimensoes: TreeDimensions;
  condicao: TreeCondition;
  estruturaRisco: TreeStructureRisk;
  conflitos: TreeConflicts;
  manejo: TreeManagement;
  registro: TreeRecord;
  observacoes?: string;
}
