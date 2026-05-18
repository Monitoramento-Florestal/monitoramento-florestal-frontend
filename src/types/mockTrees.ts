import type { User } from "./auth";
import type {
  Tree,
  TreeApprovalRequest,
  TreeBaseIssue,
  TreeCanopyIssue,
  TreeFlowLevel,
  TreeManagementAction,
  TreeManagementPriority,
  TreeMeasurementRecord,
  TreePotentialTarget,
  TreeProblem,
  TreeProblemPosition,
  TreeRootAnchorage,
  TreeRoadType,
  TreeSensitiveTarget,
  TreeStatus,
  TreeTrunkIssue,
  TreeTrunkLean,
  TreeVigor,
} from "./trees";

const CENTER = { lat: -8.0175, lng: -34.9447 };

const especies: Array<[string, string]> = [
  ["Tabebuia aurea", "Ipe-amarelo"],
  ["Handroanthus impetiginosus", "Ipe-roxo"],
  ["Caesalpinia echinata", "Pau-brasil"],
  ["Anacardium occidentale", "Cajueiro"],
  ["Mangifera indica", "Mangueira"],
  ["Cocos nucifera", "Coqueiro"],
  ["Licania tomentosa", "Oiti"],
  ["Clitoria fairchildiana", "Sombreiro"],
  ["Ficus benjamina", "Ficus"],
  ["Terminalia catappa", "Castanhola"],
  ["Spondias mombin", "Caja"],
  ["Bauhinia forficata", "Pata-de-vaca"],
];

const bairros = ["Dois Irmaos", "Vila Academica", "Cidade Universitaria"];
const ruas = [
  "Rua do Horto",
  "Avenida da Botanica",
  "Rua dos Coqueiros",
  "Alameda Central",
  "Rua do Colegio Agricola",
];
const equipes = ["Equipe Arbor 1", "Equipe Arbor 2", "Equipe Arbor 3"];
const pesquisadores = [
  "Dra. Helena Cavalcanti",
  "Prof. Ricardo Mendes",
  "Ana Beatriz Lima",
  "Pedro Soares",
];

const problemasPorStatus: Record<TreeStatus, TreeProblem[]> = {
  saudavel: ["nenhum"],
  injuria: ["injuria", "fungos"],
  cortada: ["podridao", "injuria"],
};

const posicoesProblema: TreeProblemPosition[] = ["tronco", "raiz", "copa"];
const vigores: TreeVigor[] = ["alto", "medio", "baixo"];
const troncoIssues: TreeTrunkIssue[] = [
  "sem defeitos",
  "fissuras longitudinais",
  "cavidades",
  "apodrecimento",
  "descascamento",
];
const baseIssues: TreeBaseIssue[] = [
  "normal",
  "raiz exposta",
  "solo compactado",
  "levantamento de calcada",
  "inclinacao da base",
];
const copaIssues: TreeCanopyIssue[] = [
  "assimetrica",
  "excesso de peso lateral",
  "galhos secos",
  "galhos codominantes",
];
const inclinacoes: TreeTrunkLean[] = ["ausente", "leve", "moderada", "critica"];
const ancoragens: TreeRootAnchorage[] = [
  "estavel",
  "parcialmente comprometida",
  "comprometida",
];
const alvos: TreePotentialTarget[] = [
  "pedestres",
  "veiculos",
  "residencia",
  "equipamento publico",
  "sem alvo relevante",
];
const fluxos: TreeFlowLevel[] = ["baixo", "medio", "alto"];
const tiposVia: TreeRoadType[] = [
  "residencial",
  "coletora",
  "arterial",
  "comercial/central",
];
const alvosSensiveis: TreeSensitiveTarget[] = [
  "escola",
  "hospital",
  "parada de onibus",
  "praca/area de lazer",
  "nenhum",
];
const acoesManejo: TreeManagementAction[] = [
  "nenhuma",
  "poda leve",
  "poda conducao",
  "poda pesada",
  "controle fitossanitario",
  "ampliacao canteiro",
  "substituicao",
  "supressao",
];
const prioridades: TreeManagementPriority[] = ["baixa", "media", "alta", "emergencial"];

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(values: T[], seed: number) {
  return values[Math.floor(rand(seed) * values.length)];
}

function pickSome<T>(values: T[], seed: number, count: number) {
  const items: T[] = [];

  for (let i = 0; i < count; i += 1) {
    items.push(values[(Math.floor(rand(seed + i) * values.length) + i) % values.length]);
  }

  return Array.from(new Set(items));
}

function cloneRecord(record: TreeMeasurementRecord): TreeMeasurementRecord {
  return JSON.parse(JSON.stringify(record)) as TreeMeasurementRecord;
}

function createRecordHistory(treeId: string, currentRecord: TreeMeasurementRecord, seed: number) {
  const records: TreeMeasurementRecord[] = [];
  const totalRecords = 2 + Math.floor(rand(seed * 2.1) * 3);

  for (let index = 0; index < totalRecords; index += 1) {
    const version = index + 1;
    const record = cloneRecord(currentRecord);
    const offsetDays = (totalRecords - version) * 90;
    const collectedAt = new Date(currentRecord.registro.ultimaMedicao);
    collectedAt.setDate(collectedAt.getDate() - offsetDays);
    const submittedAt = new Date(collectedAt);
    submittedAt.setDate(submittedAt.getDate() + 2);
    const dimensionVariance = version === totalRecords ? 0 : totalRecords - version;

    record.id = `${treeId}-record-${version}`;
    record.treeId = treeId;
    record.kind = version === 1 ? "initial" : "measurement";
    record.version = version;
    record.dimensoes.alturaM = Math.max(2, Number((record.dimensoes.alturaM - dimensionVariance * 0.3).toFixed(1)));
    record.dimensoes.dapCm = Math.max(4, Number((record.dimensoes.dapCm - dimensionVariance * 1.1).toFixed(1)));
    record.dimensoes.copaM = Math.max(1, Number((record.dimensoes.copaM - dimensionVariance * 0.2).toFixed(1)));
    record.localizacao.dataColeta = collectedAt.toISOString();
    record.registro.registradoEm = submittedAt.toISOString();
    record.registro.ultimaMedicao = collectedAt.toISOString();
    record.registro.aprovacao = "aprovada";
    record.registro.aprovadoEm = submittedAt.toISOString();
    record.registro.registradoPor = pesquisadores[(seed + index) % pesquisadores.length];
    record.registro.motivoRejeicao = undefined;
    records.push(record);
  }

  return records;
}

function buildTreeFromRecord(treeId: string, codigo: string, especie: string, nomeComum: string, lat: number, lng: number, records: TreeMeasurementRecord[]): Tree {
  const currentRecord = records[records.length - 1];

  return {
    id: treeId,
    codigo,
    especie,
    nomeComum,
    status: currentRecord.status,
    lat,
    lng,
    localizacao: currentRecord.localizacao,
    dimensoes: currentRecord.dimensoes,
    condicao: currentRecord.condicao,
    estruturaRisco: currentRecord.estruturaRisco,
    conflitos: currentRecord.conflitos,
    manejo: currentRecord.manejo,
    registro: currentRecord.registro,
    observacoes: currentRecord.observacoes,
    records,
  };
}

function makeCurrentRecord(treeId: string, seed: number, status: TreeStatus, lat: number, lng: number, especie: string, nomeComum: string): TreeMeasurementRecord {
  const r1 = rand(seed * 1.7);
  const r2 = rand(seed * 2.3);
  const r3 = rand(seed * 3.1);
  const r4 = rand(seed * 4.7);
  const coleta = new Date();
  coleta.setDate(coleta.getDate() - Math.floor(r1 * 180));

  const registro = new Date();
  registro.setDate(registro.getDate() - (Math.floor(r1 * 180) + Math.floor(r2 * 30)));

  const problemas = problemasPorStatus[status];
  const semProblema = problemas.includes("nenhum");
  const estadoGeral = status === "saudavel" ? 2 : status === "injuria" ? 3 : 5;
  const photosCount = r2 > 0.55 ? 1 + Math.floor(r3 * 3) : 0;
  const fotos = Array.from({ length: photosCount }, () => "/image.png");

  return {
    id: `${treeId}-record-current`,
    treeId,
    kind: "measurement",
    version: 1,
    status,
    localizacao: {
      bairro: pick(bairros, seed * 5.1),
      rua: pick(ruas, seed * 5.9),
      dataColeta: coleta.toISOString(),
      equipe: pick(equipes, seed * 6.7),
      numeroResidencia: String(10 + (seed % 80)),
      referencia: "Proximo ao acesso principal do campus",
    },
    dimensoes: {
      alturaM: Math.round((4 + r1 * 18) * 10) / 10,
      dapCm: Math.round((10 + r2 * 80) * 10) / 10,
      copaM: Math.round((2 + r3 * 9) * 10) / 10,
      medidaEstimada: r4 > 0.78,
    },
    condicao: {
      estadoGeral,
      vigor: status === "saudavel" ? "alto" : pick(vigores, seed * 7.3),
      problemas,
      posicaoProblema: semProblema ? null : pick(posicoesProblema, seed * 7.9),
    },
    estruturaRisco: {
      tronco: status === "saudavel" ? ["sem defeitos"] : pickSome(troncoIssues, seed * 8.3, 2),
      baseColo: status === "saudavel" ? ["normal"] : pickSome(baseIssues, seed * 8.9, 2),
      copa: status === "saudavel" ? ["assimetrica"] : pickSome(copaIssues, seed * 9.7, 2),
      inclinacaoTronco: status === "cortada" ? "critica" : pick(inclinacoes, seed * 10.1),
      ancoragemRadicular: status === "cortada" ? "comprometida" : pick(ancoragens, seed * 10.7),
      alvosPotenciais: pickSome(alvos, seed * 11.3, 2),
      fluxoVeiculos: pick(fluxos, seed * 11.9),
      fluxoPedestres: pick(fluxos, seed * 12.7),
      tipoVia: pick(tiposVia, seed * 13.1),
      alvosSensiveis: pickSome(alvosSensiveis, seed * 13.9, 2),
    },
    conflitos: {
      fiacao: status === "cortada" ? "conflito" : r1 > 0.6 ? "potencial" : "ausente",
      calcada: status === "saudavel" ? "sem dano" : r2 > 0.65 ? "severo" : "leve",
      iluminacao: r3 > 0.7 ? "bloqueio" : r3 > 0.35 ? "parcial" : "sem",
      edificacao: r4 > 0.65 ? "potencial" : "sem",
    },
    manejo: {
      acao:
        status === "saudavel"
          ? "nenhuma"
          : status === "injuria"
          ? pick(acoesManejo.slice(1, 6), seed * 14.3)
          : pick(acoesManejo.slice(5), seed * 14.9),
      prioridade:
        status === "saudavel"
          ? "baixa"
          : status === "injuria"
          ? pick(prioridades.slice(1, 3), seed * 15.1)
          : pick(prioridades.slice(2), seed * 15.7),
    },
    registro: {
      aprovacao: "aprovada",
      fotos,
      registradoEm: registro.toISOString(),
      registradoPor: pesquisadores[seed % pesquisadores.length],
      ultimaMedicao: coleta.toISOString(),
      aprovadoEm: registro.toISOString(),
    },
    observacoes:
      status === "saudavel"
        ? "Exemplar estavel, sem necessidade imediata de intervencao."
        : status === "injuria"
        ? "Recomenda-se monitoramento de rotina e avaliacao de poda."
        : "Arvore classificada para substituicao por risco estrutural.",
  };
}

function makeTree(i: number): Tree {
  const r1 = rand(i * 1.7);
  const r2 = rand(i * 2.3);
  const r3 = rand(i * 3.1);
  const especie = especies[i % especies.length];
  const cluster = i % 5;
  const offsetLat = (cluster - 2) * 0.0015;
  const offsetLng = (cluster - 2) * 0.0012;
  const lat = CENTER.lat + offsetLat + (r1 - 0.5) * 0.006;
  const lng = CENTER.lng + offsetLng + (r2 - 0.5) * 0.006;
  const status: TreeStatus =
    r3 < 0.65 ? "saudavel" : r3 < 0.9 ? "injuria" : "cortada";
  const treeId = `tree-${String(i).padStart(3, "0")}`;
  const currentRecord = makeCurrentRecord(treeId, i, status, lat, lng, especie[0], especie[1]);
  const records = createRecordHistory(treeId, currentRecord, i);

  return buildTreeFromRecord(
    treeId,
    `UFRPE-${String(1000 + i)}`,
    especie[0],
    especie[1],
    lat,
    lng,
    records
  );
}

function makeRequestRecord(tree: Tree, versionOffset: number, submittedBy: string): TreeMeasurementRecord {
  const baseRecord = cloneRecord(tree.records[Math.max(0, tree.records.length - 1 - versionOffset)]);
  const submittedAt = new Date(baseRecord.registro.registradoEm);
  submittedAt.setDate(submittedAt.getDate() + 7);
  baseRecord.id = `${baseRecord.id}-request`;
  baseRecord.version = baseRecord.version + 1;
  baseRecord.registro.aprovacao = "pendente";
  baseRecord.registro.registradoEm = submittedAt.toISOString();
  baseRecord.registro.registradoPor = submittedBy;
  baseRecord.registro.aprovadoEm = undefined;
  return baseRecord;
}

export const mockTrees: Tree[] = Array.from({ length: 24 }, (_, index) =>
  makeTree(index + 1)
);

export const mockApprovalRequests: TreeApprovalRequest[] = [
  {
    id: "request-create-tree-001",
    type: "create_tree",
    status: "pendente",
    submittedAt: new Date("2026-05-16T12:20:00.000Z").toISOString(),
    submittedBy: "Ana Beatriz Lima",
    treeMeta: {
      codigo: "UFRPE-PEND-01",
      especie: "Tabebuia roseoalba",
      nomeComum: "Ipe-branco",
      lat: -8.01691,
      lng: -34.94518,
    },
    treeDraft: {
      codigo: "UFRPE-PEND-01",
      especie: "Tabebuia roseoalba",
      nomeComum: "Ipe-branco",
      lat: -8.01691,
      lng: -34.94518,
    },
    record: {
      ...makeCurrentRecord("draft-tree-001", 90, "saudavel", -8.01691, -34.94518, "Tabebuia roseoalba", "Ipe-branco"),
      kind: "initial",
      version: 1,
      registro: {
        ...makeCurrentRecord("draft-tree-001", 90, "saudavel", -8.01691, -34.94518, "Tabebuia roseoalba", "Ipe-branco").registro,
        aprovacao: "pendente",
        registradoPor: "Ana Beatriz Lima",
      },
    },
  },
  {
    id: "request-create-record-002",
    type: "create_record",
    status: "pendente",
    submittedAt: new Date("2026-05-15T09:10:00.000Z").toISOString(),
    submittedBy: "Pedro Soares",
    treeId: mockTrees[4].id,
    treeMeta: {
      codigo: mockTrees[4].codigo,
      especie: mockTrees[4].especie,
      nomeComum: mockTrees[4].nomeComum,
      lat: mockTrees[4].lat,
      lng: mockTrees[4].lng,
    },
    record: makeRequestRecord(mockTrees[4], 0, "Pedro Soares"),
  },
  {
    id: "request-edit-record-003",
    type: "edit_record",
    status: "pendente",
    submittedAt: new Date("2026-05-14T15:45:00.000Z").toISOString(),
    submittedBy: "Ana Beatriz Lima",
    treeId: mockTrees[1].id,
    targetRecordId: mockTrees[1].records[0].id,
    treeMeta: {
      codigo: mockTrees[1].codigo,
      especie: mockTrees[1].especie,
      nomeComum: mockTrees[1].nomeComum,
      lat: mockTrees[1].lat,
      lng: mockTrees[1].lng,
    },
    record: {
      ...cloneRecord(mockTrees[1].records[0]),
      id: `${mockTrees[1].records[0].id}-edit-request`,
      dimensoes: {
        ...mockTrees[1].records[0].dimensoes,
        alturaM: Number((mockTrees[1].records[0].dimensoes.alturaM + 0.4).toFixed(1)),
      },
      observacoes: "Pesquisadora solicitou correcao da medida de altura apos revisao de campo.",
      registro: {
        ...mockTrees[1].records[0].registro,
        aprovacao: "pendente",
        registradoPor: "Ana Beatriz Lima",
        registradoEm: new Date("2026-05-14T15:45:00.000Z").toISOString(),
      },
    },
  },
];

export const mockUsers: User[] = [
  { id: "u1", name: "Visitante", email: "visitante@arbor.local", role: "citizen" },
  { id: "u2", name: "Marina Silva", email: "marina@email.com", role: "citizen" },
  { id: "u3", name: "Ana Beatriz Lima", email: "ana.lima@ufrpe.br", role: "researcher" },
  { id: "u4", name: "Prof. Ricardo Mendes", email: "ricardo.mendes@ufrpe.br", role: "manager" },
  { id: "u5", name: "Dra. Helena Cavalcanti", email: "helena.cavalcanti@ufrpe.br", role: "admin" },
];
