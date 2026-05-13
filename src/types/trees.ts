export type TreeStatus = "saudavel" | "injuria" | "cortada";
export type ApprovalStatus = "aprovada" | "pendente" | "rejeitada";

export interface Tree {
  id: string;
  codigo: string;
  especie: string;
  nomeComum: string;
  lat: number;
  lng: number;
  altura: number; // metros
  dap: number; // cm — Diâmetro à Altura do Peito
  copaDiametro: number; // metros
  qualidadeFuste: "boa" | "regular" | "ruim";
  status: TreeStatus;
  injurias: string[];
  ultimaMedicao: string; // ISO date
  registradoPor: string;
  registradoEm: string;
  aprovacao: ApprovalStatus;
  fotos: number; // count mock
  observacoes?: string;
  motivoRejeicao?: string;
}