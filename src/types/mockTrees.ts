import type { User } from "./auth";
import type {
  Tree,
  TreeBaseIssue,
  TreeCanopyIssue,
  TreeFlowLevel,
  TreeManagementAction,
  TreeManagementPriority,
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

function makeTree(i: number): Tree {
  const r1 = rand(i * 1.7);
  const r2 = rand(i * 2.3);
  const r3 = rand(i * 3.1);
  const r4 = rand(i * 4.7);
  const especie = especies[i % especies.length];
  const cluster = i % 5;
  const offsetLat = (cluster - 2) * 0.0015;
  const offsetLng = (cluster - 2) * 0.0012;
  const lat = CENTER.lat + offsetLat + (r1 - 0.5) * 0.006;
  const lng = CENTER.lng + offsetLng + (r2 - 0.5) * 0.006;

  const statusRoll = r3;
  const status: TreeStatus =
    statusRoll < 0.65 ? "saudavel" : statusRoll < 0.9 ? "injuria" : "cortada";

  const aprovacao =
    r4 < 0.82 ? "aprovada" : r4 < 0.95 ? "pendente" : "rejeitada";

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
    id: `tree-${String(i).padStart(3, "0")}`,
    codigo: `UFRPE-${String(1000 + i)}`,
    especie: especie[0],
    nomeComum: especie[1],
    status,
    lat,
    lng,
    localizacao: {
      bairro: pick(bairros, i * 5.1),
      rua: pick(ruas, i * 5.9),
      dataColeta: coleta.toISOString(),
      equipe: pick(equipes, i * 6.7),
      numeroResidencia: String(10 + (i % 80)),
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
      vigor: status === "saudavel" ? "alto" : pick(vigores, i * 7.3),
      problemas,
      posicaoProblema: semProblema ? null : pick(posicoesProblema, i * 7.9),
    },
    estruturaRisco: {
      tronco: status === "saudavel" ? ["sem defeitos"] : pickSome(troncoIssues, i * 8.3, 2),
      baseColo: status === "saudavel" ? ["normal"] : pickSome(baseIssues, i * 8.9, 2),
      copa: status === "saudavel" ? ["assimetrica"] : pickSome(copaIssues, i * 9.7, 2),
      inclinacaoTronco: status === "cortada" ? "critica" : pick(inclinacoes, i * 10.1),
      ancoragemRadicular: status === "cortada" ? "comprometida" : pick(ancoragens, i * 10.7),
      alvosPotenciais: pickSome(alvos, i * 11.3, 2),
      fluxoVeiculos: pick(fluxos, i * 11.9),
      fluxoPedestres: pick(fluxos, i * 12.7),
      tipoVia: pick(tiposVia, i * 13.1),
      alvosSensiveis: pickSome(alvosSensiveis, i * 13.9, 2),
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
          ? pick(acoesManejo.slice(1, 6), i * 14.3)
          : pick(acoesManejo.slice(5), i * 14.9),
      prioridade:
        status === "saudavel"
          ? "baixa"
          : status === "injuria"
          ? pick(prioridades.slice(1, 3), i * 15.1)
          : pick(prioridades.slice(2), i * 15.7),
    },
    registro: {
      aprovacao,
      fotos,
      registradoEm: registro.toISOString(),
      registradoPor: pesquisadores[i % pesquisadores.length],
      ultimaMedicao: coleta.toISOString(),
      motivoRejeicao: aprovacao === "rejeitada" ? "Pendencia na conferencia tecnica." : undefined,
    },
    observacoes:
      status === "saudavel"
        ? "Exemplar estavel, sem necessidade imediata de intervencao."
        : status === "injuria"
        ? "Recomenda-se monitoramento de rotina e avaliacao de poda."
        : "Arvore classificada para substituicao por risco estrutural.",
  };
}

export const mockTrees: Tree[] = Array.from({ length: 42 }, (_, index) =>
  makeTree(index + 1)
);

export const mockUsers: User[] = [
  { id: "u1", name: "Visitante", email: "visitante@arbor.local", role: "citizen" },
  { id: "u2", name: "Marina Silva", email: "marina@email.com", role: "citizen" },
  { id: "u3", name: "Ana Beatriz Lima", email: "ana.lima@ufrpe.br", role: "researcher" },
  { id: "u4", name: "Prof. Ricardo Mendes", email: "ricardo.mendes@ufrpe.br", role: "manager" },
  { id: "u5", name: "Dra. Helena Cavalcanti", email: "helena.cavalcanti@ufrpe.br", role: "admin" },
];
