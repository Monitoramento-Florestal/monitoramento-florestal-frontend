"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LocateFixed } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/constants/roles";
import {
  mapFormValuesToExistingTreeRecordPayload,
  mapFormValuesToNewTreeRecordPayload,
} from "@/services/trees/treeFormMappers";
import {
  createExistingTreeRecord,
  createNewTreeRecord,
} from "@/services/trees/treeService";
import type { Tree, TreeMeasurementRecord } from "@/types/trees";
import { cn } from "@/utils/cn";
import { isSessionInvalidationError, normalizeApiError } from "@/utils/apiFunctions";
import {
  getTreeRecordFormValues,
  getTreeRecordSubmitLabel,
  type TreeRecordFormMode,
  type TreeRecordFormValues,
} from "@/utils/treeRecords";

interface TreeRecordFormScreenProps {
  mode: TreeRecordFormMode;
  record?: TreeMeasurementRecord | null;
  role: UserRole;
  tree?: Tree | null;
}

type SelectOption = {
  label: string;
  value: string;
};

type FieldKey =
  | "especie"
  | "bairro"
  | "rua"
  | "dapCm"
  | "alturaM"
  | "copaM"
  | "tronco"
  | "baseColo"
  | "copa"
  | "inclinacaoTronco"
  | "ancoragemRadicular"
  | "fluxoVeiculos"
  | "fluxoPedestres"
  | "tipoVia"
  | "fiacao"
  | "calcada"
  | "iluminacao"
  | "edificacao"
  | "manejoAcao"
  | "manejoPrioridade"
  | "posicaoProblema";

const ESTADO_GERAL_OPTIONS: SelectOption[] = [
  { value: "1", label: "1 - Ótimo" },
  { value: "2", label: "2 - Bom" },
  { value: "3", label: "3 - Regular" },
  { value: "4", label: "4 - Ruim" },
  { value: "5", label: "5 - Morta" },
];

const TREE_PROBLEM_OPTIONS: SelectOption[] = [
  { value: "pragas", label: "Pragas" },
  { value: "fungos", label: "Fungos" },
  { value: "podridao", label: "Podridão" },
  { value: "injuria", label: "Injúria" },
  { value: "nenhum", label: "Nenhum" },
];

const TREE_POSITION_OPTIONS: SelectOption[] = [
  { value: "tronco", label: "Tronco" },
  { value: "raiz", label: "Raiz" },
  { value: "copa", label: "Copa" },
];

const TREE_VIGOR_OPTIONS: SelectOption[] = [
  { value: "alto", label: "Alto" },
  { value: "medio", label: "Médio" },
  { value: "baixo", label: "Baixo" },
];

const TREE_CONFLICT_OPTIONS = {
  fiacao: [
    { value: "ausente", label: "Ausente" },
    { value: "potencial", label: "Potencial" },
    { value: "conflito", label: "Ocorrido" },
  ],
  calcada: [
    { value: "sem dano", label: "Sem Dano" },
    { value: "leve", label: "Leve" },
    { value: "severo", label: "Severo" },
  ],
  iluminacao: [
    { value: "sem", label: "Sem Conflito" },
    { value: "parcial", label: "Parcial" },
    { value: "bloqueio", label: "Bloqueio" },
  ],
  edificacao: [
    { value: "sem", label: "Ausente" },
    { value: "potencial", label: "Potencial" },
    { value: "conflito", label: "Ocorrido" },
  ],
} as const satisfies Record<string, SelectOption[]>;

const TREE_STRUCTURE_OPTIONS = {
  tronco: [
    { value: "sem defeitos", label: "Sem Defeitos" },
    { value: "fissuras longitudinais", label: "Fissuras Longitudinais" },
    { value: "cavidades", label: "Cavidades" },
    { value: "apodrecimento", label: "Apodrecimento" },
    { value: "descascamento", label: "Descascamento" },
  ],
  baseColo: [
    { value: "normal", label: "Normal" },
    { value: "raiz exposta", label: "Raiz Exposta" },
    { value: "solo compactado", label: "Solo Compactado" },
    { value: "levantamento de calcada", label: "Levantamento de Calçada" },
    { value: "inclinacao da base", label: "Inclinação da Base" },
  ],
  copa: [
    { value: "assimetrica", label: "Assimétrica" },
    { value: "excesso de peso lateral", label: "Excesso de Peso Lateral" },
    { value: "galhos secos", label: "Galhos Secos" },
    { value: "galhos codominantes", label: "Galhos Codominantes" },
  ],
} as const satisfies Record<string, SelectOption[]>;

const TREE_RISK_OPTIONS = {
  inclinacaoTronco: [
    { value: "ausente", label: "Ausente" },
    { value: "leve", label: "Leve" },
    { value: "moderada", label: "Moderada" },
    { value: "critica", label: "Crítica" },
  ],
  ancoragemRadicular: [
    { value: "estavel", label: "Estável" },
    { value: "parcialmente comprometida", label: "Parcialmente Comprometida" },
    { value: "comprometida", label: "Comprometida" },
  ],
  fluxoVeiculos: [
    { value: "baixo", label: "Baixo" },
    { value: "medio", label: "Médio" },
    { value: "alto", label: "Alto" },
  ],
  fluxoPedestres: [
    { value: "baixo", label: "Baixo" },
    { value: "medio", label: "Médio" },
    { value: "alto", label: "Alto" },
  ],
  tipoVia: [
    { value: "residencial", label: "Residencial" },
    { value: "coletora", label: "Coletora" },
    { value: "arterial", label: "Arterial" },
    { value: "comercial/central", label: "Comercial / Central" },
  ],
} as const satisfies Record<string, SelectOption[]>;

const TREE_TARGET_OPTIONS = {
  alvosPotenciais: [
    { value: "pedestres", label: "Pedestres" },
    { value: "veiculos", label: "Veículos" },
    { value: "residencia", label: "Residência" },
    { value: "equipamento publico", label: "Equipamento Público" },
    { value: "sem alvo relevante", label: "Sem Alvo Relevante" },
  ],
  alvosSensiveis: [
    { value: "escola", label: "Escola" },
    { value: "hospital", label: "Hospital" },
    { value: "parada de onibus", label: "Parada de Ônibus" },
    { value: "praca/area de lazer", label: "Praça / Área de Lazer" },
    { value: "nenhum", label: "Nenhum" },
  ],
} as const satisfies Record<string, SelectOption[]>;

const TREE_MANAGEMENT_OPTIONS = {
  acao: [
    { value: "nenhuma", label: "Nenhuma" },
    { value: "poda leve", label: "Poda Leve" },
    { value: "poda conducao", label: "Poda de Condução" },
    { value: "poda pesada", label: "Poda Pesada" },
    { value: "controle fitossanitario", label: "Controle Fitossanitário" },
    { value: "ampliacao canteiro", label: "Ampliação do Canteiro" },
    { value: "substituicao", label: "Substituição" },
    { value: "supressao", label: "Supressão" },
  ],
  prioridade: [
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "emergencial", label: "Emergencial" },
  ],
} as const satisfies Record<string, SelectOption[]>;

const VALIDATION_ORDER: FieldKey[] = [
  "especie",
  "bairro",
  "rua",
  "dapCm",
  "alturaM",
  "copaM",
  "tronco",
  "baseColo",
  "copa",
  "inclinacaoTronco",
  "ancoragemRadicular",
  "fluxoVeiculos",
  "fluxoPedestres",
  "tipoVia",
  "fiacao",
  "calcada",
  "iluminacao",
  "edificacao",
  "manejoAcao",
  "manejoPrioridade",
  "posicaoProblema",
];

export function TreeRecordFormScreen({
  mode,
  role,
  record = null,
  tree = null,
}: TreeRecordFormScreenProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState<TreeRecordFormValues>(() =>
    getTreeRecordFormValues(tree, record),
  );
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationState, setLocationState] = useState<
    "idle" | "loading" | "success" | "denied" | "unavailable" | "error"
  >("idle");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [hasAttemptedAutoLocation, setHasAttemptedAutoLocation] = useState(false);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>({});

  const isCreateTree = mode === "create-tree";
  const selectedProblemValues = useMemo(
    () => values.problemas.filter((value) => value !== "nenhum"),
    [values.problemas],
  );

  function setFieldRef(field: FieldKey, element: HTMLDivElement | null) {
    fieldRefs.current[field] = element;
  }

  function clearFieldError(field: FieldKey) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  }

  function updateValue<Key extends keyof TreeRecordFormValues>(
    key: Key,
    value: TreeRecordFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));

    if (key in fieldRefs.current) {
      clearFieldError(key as FieldKey);
    }
  }

  function hasValidCoordinateInput(value: string) {
    return Number.isFinite(Number(value));
  }

  function treeHasCoordinates() {
    return Boolean(tree && Number.isFinite(tree.lat) && Number.isFinite(tree.lng));
  }

  function shouldAutofillLocation() {
    if (mode === "create-record" && treeHasCoordinates()) {
      return false;
    }

    return !hasValidCoordinateInput(values.lat) || !hasValidCoordinateInput(values.lng);
  }

  function fillWithCurrentLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationState("unavailable");
      setLocationMessage("Localização indisponível neste dispositivo.");
      return;
    }

    setLocationState("loading");
    setLocationMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValues((current) => ({
          ...current,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setLocationState("success");
        setLocationMessage("Localização atual preenchida automaticamente.");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationState("denied");
          setLocationMessage("Permissão negada. Preencha latitude e longitude manualmente.");
          return;
        }

        setLocationState("error");
        setLocationMessage("Não foi possível obter a localização atual.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  useEffect(() => {
    if (hasAttemptedAutoLocation) {
      return;
    }

    setHasAttemptedAutoLocation(true);

    if (!shouldAutofillLocation()) {
      return;
    }

    fillWithCurrentLocation();
  }, [hasAttemptedAutoLocation, mode, tree, values.lat, values.lng]);

  function toggleArrayValue(
    key:
      | "problemas"
      | "tronco"
      | "baseColo"
      | "copa"
      | "alvosPotenciais"
      | "alvosSensiveis",
    value: string,
  ) {
    setValues((current) => {
      const currentValues = current[key];
      const hasValue = currentValues.includes(value);
      const isSingleSelectionGroup =
        key === "tronco" || key === "baseColo" || key === "copa";

      if (key === "problemas") {
        if (value === "nenhum") {
          return {
            ...current,
            problemas: hasValue ? [] : ["nenhum"],
            posicaoProblema: "",
          };
        }

        const nextValues = hasValue
          ? currentValues.filter((item) => item !== value)
          : [...currentValues.filter((item) => item !== "nenhum"), value];

        return {
          ...current,
          problemas: nextValues,
        };
      }

      if (isSingleSelectionGroup) {
        return {
          ...current,
          [key]: hasValue ? [] : [value],
        };
      }

      return {
        ...current,
        [key]: hasValue
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });

    if (key === "problemas") {
      clearFieldError("posicaoProblema");
    }
  }

  function isPositiveNumber(value: string) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0;
  }

  function validateForm() {
    const nextErrors: Partial<Record<FieldKey, string>> = {};

    if (isCreateTree && !values.especie.trim()) {
      nextErrors.especie = "Informe o nome científico.";
    }

    if (!values.bairro.trim()) {
      nextErrors.bairro = "Informe o bairro.";
    }

    if (!values.rua.trim()) {
      nextErrors.rua = "Informe a rua.";
    }

    if (!isPositiveNumber(values.dapCm)) {
      nextErrors.dapCm = "Informe um DAP válido.";
    }

    if (!isPositiveNumber(values.alturaM)) {
      nextErrors.alturaM = "Informe uma altura válida.";
    }

    if (!isPositiveNumber(values.copaM)) {
      nextErrors.copaM = "Informe uma copa válida.";
    }

    if (values.tronco.length === 0) {
      nextErrors.tronco = "Selecione a condição do tronco.";
    }

    if (values.baseColo.length === 0) {
      nextErrors.baseColo = "Selecione a condição da base / colo.";
    }

    if (values.copa.length === 0) {
      nextErrors.copa = "Selecione a condição da copa.";
    }

    if (!values.inclinacaoTronco) {
      nextErrors.inclinacaoTronco = "Selecione a inclinação do tronco.";
    }

    if (!values.ancoragemRadicular) {
      nextErrors.ancoragemRadicular = "Selecione a ancoragem radicular.";
    }

    if (!values.fluxoVeiculos) {
      nextErrors.fluxoVeiculos = "Selecione o fluxo de veículos.";
    }

    if (!values.fluxoPedestres) {
      nextErrors.fluxoPedestres = "Selecione o fluxo de pedestres.";
    }

    if (!values.tipoVia) {
      nextErrors.tipoVia = "Selecione o tipo de via.";
    }

    if (!values.fiacao) {
      nextErrors.fiacao = "Selecione a condição da fiação.";
    }

    if (!values.calcada) {
      nextErrors.calcada = "Selecione a condição da calçada.";
    }

    if (!values.iluminacao) {
      nextErrors.iluminacao = "Selecione a condição da iluminação.";
    }

    if (!values.edificacao) {
      nextErrors.edificacao = "Selecione a condição da edificação.";
    }

    if (!values.manejoAcao) {
      nextErrors.manejoAcao = "Selecione a ação de manejo.";
    }

    if (!values.manejoPrioridade) {
      nextErrors.manejoPrioridade = "Selecione a prioridade de manejo.";
    }

    if (selectedProblemValues.length > 0 && !values.posicaoProblema) {
      nextErrors.posicaoProblema = "Selecione a posição do problema.";
    }

    return nextErrors;
  }

  function scrollToField(field: FieldKey) {
    const container = fieldRefs.current[field];

    if (!container) {
      return;
    }

    container.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const focusTarget = container.querySelector<HTMLElement>(
      "input, select, textarea, button",
    );

    focusTarget?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);

      const firstInvalidField = VALIDATION_ORDER.find((field) => nextErrors[field]);
      if (firstInvalidField) {
        scrollToField(firstInvalidField);
      }

      showToast({
        title: "Revise os campos obrigatórios",
        description: "Corrija os campos destacados para continuar.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create-record") {
        if (!tree) {
          throw new Error("Árvore não encontrada para criar o registro.");
        }

        await createExistingTreeRecord(
          mapFormValuesToExistingTreeRecordPayload(tree.id, values),
        );
      } else if (mode === "create-tree") {
        await createNewTreeRecord(mapFormValuesToNewTreeRecordPayload(values));
      } else {
        throw new Error("Edição de registros ainda não está disponível.");
      }

      showToast({
        title:
          mode === "create-tree"
            ? "Solicitação enviada com sucesso"
            : "Registro enviado com sucesso",
        description:
          mode === "create-tree"
            ? "A nova árvore foi enviada para análise."
            : "O novo registro foi enviado para análise.",
        variant: "success",
      });
    } catch (error) {
      if (isSessionInvalidationError(error)) {
        return;
      }

      showToast({
        title: "Não foi possível concluir o envio",
        description: normalizeApiError(error).message,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitLabel = getTreeRecordSubmitLabel(role, mode);

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {tree ? (
        <DashboardCard className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/70">
                {tree.codigo}
              </p>
              <h2 className="mt-1 text-xl tracking-tight text-burgundy">{tree.nomeComum}</h2>
              <p className="mt-1 text-sm italic text-rosewood">{tree.especie}</p>
            </div>
            {record ? (
              <div className="rounded-full border border-rosewood/12 bg-secondary px-3 py-1 text-xs text-rosewood">
                Registro v{record.version}
              </div>
            ) : null}
          </div>
        </DashboardCard>
      ) : null}

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Identificação da Árvore</h3>
          <p className="mt-1 text-sm text-rosewood">
            Dados-base da espécie e georreferenciamento.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LabeledField label="Nome Comum">
            <Input
              value={values.nomeComum}
              disabled={mode === "create-record" && Boolean(tree)}
              onChange={(event) => updateValue("nomeComum", event.target.value)}
            />
          </LabeledField>

          <LabeledField
            label="Nome Científico"
            required={isCreateTree}
            invalid={Boolean(fieldErrors.especie)}
            error={fieldErrors.especie}
            fieldRef={(element) => setFieldRef("especie", element)}
          >
            <Input
              value={values.especie}
              disabled={mode === "create-record" && Boolean(tree)}
              className={getFieldClassName(Boolean(fieldErrors.especie))}
              onChange={(event) => updateValue("especie", event.target.value)}
            />
          </LabeledField>

          <LabeledField label="Latitude">
            <Input value={values.lat} onChange={(event) => updateValue("lat", event.target.value)} />
          </LabeledField>

          <LabeledField label="Longitude">
            <Input value={values.lng} onChange={(event) => updateValue("lng", event.target.value)} />
          </LabeledField>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rosewood/10 bg-card/45 px-4 py-3">
          <p className="text-sm text-rosewood">
            {locationMessage ??
              "A localização atual pode ser preenchida automaticamente e continua editável."}
          </p>
          <Button
            type="button"
            variant="outline"
            icon={LocateFixed}
            iconSide="left"
            disabled={locationState === "loading"}
            onClick={fillWithCurrentLocation}
          >
            {locationState === "loading"
              ? "Obtendo Localização..."
              : "Usar Localização Atual"}
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Localização e Coleta</h3>
          <p className="mt-1 text-sm text-rosewood">
            Contexto urbano e dados do momento da medição.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LabeledField
            label="Bairro"
            required
            invalid={Boolean(fieldErrors.bairro)}
            error={fieldErrors.bairro}
            fieldRef={(element) => setFieldRef("bairro", element)}
          >
            <Input
              value={values.bairro}
              className={getFieldClassName(Boolean(fieldErrors.bairro))}
              onChange={(event) => updateValue("bairro", event.target.value)}
            />
          </LabeledField>

          <LabeledField
            label="Rua"
            required
            invalid={Boolean(fieldErrors.rua)}
            error={fieldErrors.rua}
            fieldRef={(element) => setFieldRef("rua", element)}
          >
            <Input
              value={values.rua}
              className={getFieldClassName(Boolean(fieldErrors.rua))}
              onChange={(event) => updateValue("rua", event.target.value)}
            />
          </LabeledField>

          <LabeledField label="Número da Residência">
            <Input
              value={values.numeroResidencia}
              onChange={(event) => updateValue("numeroResidencia", event.target.value)}
            />
          </LabeledField>

          <LabeledField label="Referência">
            <Input
              value={values.referencia}
              onChange={(event) => updateValue("referencia", event.target.value)}
            />
          </LabeledField>

          <LabeledField label="Data da Coleta">
            <Input
              type="date"
              value={values.dataColeta}
              onChange={(event) => updateValue("dataColeta", event.target.value)}
            />
          </LabeledField>

          <LabeledField label="Equipe">
            <Input value={values.equipe} onChange={(event) => updateValue("equipe", event.target.value)} />
          </LabeledField>
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Dimensões e Condição</h3>
          <p className="mt-1 text-sm text-rosewood">
            Medidas dendrométricas e estado geral do exemplar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <LabeledField
            label="DAP (cm)"
            required
            invalid={Boolean(fieldErrors.dapCm)}
            error={fieldErrors.dapCm}
            fieldRef={(element) => setFieldRef("dapCm", element)}
          >
            <Input
              value={values.dapCm}
              className={getFieldClassName(Boolean(fieldErrors.dapCm))}
              onChange={(event) => updateValue("dapCm", event.target.value)}
            />
          </LabeledField>

          <LabeledField
            label="Altura (m)"
            required
            invalid={Boolean(fieldErrors.alturaM)}
            error={fieldErrors.alturaM}
            fieldRef={(element) => setFieldRef("alturaM", element)}
          >
            <Input
              value={values.alturaM}
              className={getFieldClassName(Boolean(fieldErrors.alturaM))}
              onChange={(event) => updateValue("alturaM", event.target.value)}
            />
          </LabeledField>

          <LabeledField
            label="Copa (m)"
            required
            invalid={Boolean(fieldErrors.copaM)}
            error={fieldErrors.copaM}
            fieldRef={(element) => setFieldRef("copaM", element)}
          >
            <Input
              value={values.copaM}
              className={getFieldClassName(Boolean(fieldErrors.copaM))}
              onChange={(event) => updateValue("copaM", event.target.value)}
            />
          </LabeledField>
        </div>

        <label className="flex items-center gap-2 text-sm text-rosewood">
          <input
            checked={values.medidaEstimada}
            type="checkbox"
            onChange={(event) => updateValue("medidaEstimada", event.target.checked)}
          />
          Medida Estimada
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Estado Geral"
            value={values.estadoGeral}
            options={ESTADO_GERAL_OPTIONS}
            onChange={(value) =>
              updateValue("estadoGeral", value as TreeRecordFormValues["estadoGeral"])
            }
          />

          <SelectField
            label="Vigor"
            value={values.vigor}
            options={TREE_VIGOR_OPTIONS}
            onChange={(value) => updateValue("vigor", value as TreeRecordFormValues["vigor"])}
          />
        </div>

        <OptionGroup
          label="Problemas"
          items={TREE_PROBLEM_OPTIONS}
          selectedItems={values.problemas}
          onToggle={(value) => toggleArrayValue("problemas", value)}
        />

        <SelectField
          label="Posição do Problema"
          value={values.posicaoProblema}
          options={TREE_POSITION_OPTIONS}
          placeholder="Selecione uma opção"
          required={selectedProblemValues.length > 0}
          invalid={Boolean(fieldErrors.posicaoProblema)}
          error={fieldErrors.posicaoProblema}
          fieldRef={(element) => setFieldRef("posicaoProblema", element)}
          onChange={(value) =>
            updateValue(
              "posicaoProblema",
              value as TreeRecordFormValues["posicaoProblema"],
            )
          }
        />
      </DashboardCard>

      <DashboardCard className="space-y-5">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Estrutura, Risco e Conflitos</h3>
          <p className="mt-1 text-sm text-rosewood">
            Leitura técnica para risco estrutural e conflitos urbanos.
          </p>
        </div>

        <OptionGroup
          label="Tronco"
          items={TREE_STRUCTURE_OPTIONS.tronco}
          selectedItems={values.tronco}
          selectionMode="single"
          required
          invalid={Boolean(fieldErrors.tronco)}
          error={fieldErrors.tronco}
          fieldRef={(element) => setFieldRef("tronco", element)}
          onToggle={(value) => toggleArrayValue("tronco", value)}
        />

        <OptionGroup
          label="Base / Colo"
          items={TREE_STRUCTURE_OPTIONS.baseColo}
          selectedItems={values.baseColo}
          selectionMode="single"
          required
          invalid={Boolean(fieldErrors.baseColo)}
          error={fieldErrors.baseColo}
          fieldRef={(element) => setFieldRef("baseColo", element)}
          onToggle={(value) => toggleArrayValue("baseColo", value)}
        />

        <OptionGroup
          label="Copa"
          items={TREE_STRUCTURE_OPTIONS.copa}
          selectedItems={values.copa}
          selectionMode="single"
          required
          invalid={Boolean(fieldErrors.copa)}
          error={fieldErrors.copa}
          fieldRef={(element) => setFieldRef("copa", element)}
          onToggle={(value) => toggleArrayValue("copa", value)}
        />

        <OptionGroup
          label="Alvos Potenciais"
          items={TREE_TARGET_OPTIONS.alvosPotenciais}
          selectedItems={values.alvosPotenciais}
          onToggle={(value) => toggleArrayValue("alvosPotenciais", value)}
        />

        <OptionGroup
          label="Alvos Sensíveis"
          items={TREE_TARGET_OPTIONS.alvosSensiveis}
          selectedItems={values.alvosSensiveis}
          onToggle={(value) => toggleArrayValue("alvosSensiveis", value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Inclinação do Tronco"
            value={values.inclinacaoTronco}
            options={TREE_RISK_OPTIONS.inclinacaoTronco}
            required
            invalid={Boolean(fieldErrors.inclinacaoTronco)}
            error={fieldErrors.inclinacaoTronco}
            fieldRef={(element) => setFieldRef("inclinacaoTronco", element)}
            onChange={(value) => updateValue("inclinacaoTronco", value)}
          />

          <SelectField
            label="Ancoragem Radicular"
            value={values.ancoragemRadicular}
            options={TREE_RISK_OPTIONS.ancoragemRadicular}
            required
            invalid={Boolean(fieldErrors.ancoragemRadicular)}
            error={fieldErrors.ancoragemRadicular}
            fieldRef={(element) => setFieldRef("ancoragemRadicular", element)}
            onChange={(value) => updateValue("ancoragemRadicular", value)}
          />

          <SelectField
            label="Fluxo de Veículos"
            value={values.fluxoVeiculos}
            options={TREE_RISK_OPTIONS.fluxoVeiculos}
            required
            invalid={Boolean(fieldErrors.fluxoVeiculos)}
            error={fieldErrors.fluxoVeiculos}
            fieldRef={(element) => setFieldRef("fluxoVeiculos", element)}
            onChange={(value) => updateValue("fluxoVeiculos", value)}
          />

          <SelectField
            label="Fluxo de Pedestres"
            value={values.fluxoPedestres}
            options={TREE_RISK_OPTIONS.fluxoPedestres}
            required
            invalid={Boolean(fieldErrors.fluxoPedestres)}
            error={fieldErrors.fluxoPedestres}
            fieldRef={(element) => setFieldRef("fluxoPedestres", element)}
            onChange={(value) => updateValue("fluxoPedestres", value)}
          />

          <SelectField
            label="Tipo de Via"
            value={values.tipoVia}
            options={TREE_RISK_OPTIONS.tipoVia}
            required
            invalid={Boolean(fieldErrors.tipoVia)}
            error={fieldErrors.tipoVia}
            fieldRef={(element) => setFieldRef("tipoVia", element)}
            onChange={(value) => updateValue("tipoVia", value)}
          />

          <SelectField
            label="Fiação"
            value={values.fiacao}
            options={TREE_CONFLICT_OPTIONS.fiacao}
            required
            invalid={Boolean(fieldErrors.fiacao)}
            error={fieldErrors.fiacao}
            fieldRef={(element) => setFieldRef("fiacao", element)}
            onChange={(value) => updateValue("fiacao", value)}
          />

          <SelectField
            label="Calçada"
            value={values.calcada}
            options={TREE_CONFLICT_OPTIONS.calcada}
            required
            invalid={Boolean(fieldErrors.calcada)}
            error={fieldErrors.calcada}
            fieldRef={(element) => setFieldRef("calcada", element)}
            onChange={(value) => updateValue("calcada", value)}
          />

          <SelectField
            label="Iluminação"
            value={values.iluminacao}
            options={TREE_CONFLICT_OPTIONS.iluminacao}
            required
            invalid={Boolean(fieldErrors.iluminacao)}
            error={fieldErrors.iluminacao}
            fieldRef={(element) => setFieldRef("iluminacao", element)}
            onChange={(value) => updateValue("iluminacao", value)}
          />

          <SelectField
            label="Edificação"
            value={values.edificacao}
            options={TREE_CONFLICT_OPTIONS.edificacao}
            required
            invalid={Boolean(fieldErrors.edificacao)}
            error={fieldErrors.edificacao}
            fieldRef={(element) => setFieldRef("edificacao", element)}
            onChange={(value) => updateValue("edificacao", value)}
          />

          <SelectField
            label="Ação de Manejo"
            value={values.manejoAcao}
            options={TREE_MANAGEMENT_OPTIONS.acao}
            required
            invalid={Boolean(fieldErrors.manejoAcao)}
            error={fieldErrors.manejoAcao}
            fieldRef={(element) => setFieldRef("manejoAcao", element)}
            onChange={(value) => updateValue("manejoAcao", value)}
          />

          <SelectField
            label="Prioridade de Manejo"
            value={values.manejoPrioridade}
            options={TREE_MANAGEMENT_OPTIONS.prioridade}
            required
            invalid={Boolean(fieldErrors.manejoPrioridade)}
            error={fieldErrors.manejoPrioridade}
            fieldRef={(element) => setFieldRef("manejoPrioridade", element)}
            onChange={(value) => updateValue("manejoPrioridade", value)}
          />
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Observações</h3>
          <p className="mt-1 text-sm text-rosewood">
            Acrescente informações complementares sobre a avaliação.
          </p>
        </div>

        <LabeledField label="Observações">
          <textarea
            className="min-h-32 w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none focus:border-sage"
            value={values.observacoes}
            onChange={(event) => updateValue("observacoes", event.target.value)}
          />
        </LabeledField>
      </DashboardCard>

      <div className="sticky bottom-0 flex justify-end rounded-xl border border-rosewood/10 bg-cream/95 px-5 py-4 backdrop-blur">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function getFieldClassName(invalid: boolean) {
  return invalid ? "border-burgundy focus:border-burgundy" : undefined;
}

function LabeledField({
  label,
  children,
  required = false,
  invalid = false,
  error,
  fieldRef,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  invalid?: boolean;
  error?: string;
  fieldRef?: (element: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={fieldRef} className="space-y-2">
      <label className="space-y-2">
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.18em] text-rosewood/75",
            invalid && "text-burgundy",
          )}
        >
          {label}
          {required ? <span className="ml-1 text-burgundy">*</span> : null}
        </span>
        {children}
      </label>
      {error ? <p className="text-sm text-burgundy">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  invalid = false,
  error,
  fieldRef,
}: {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  error?: string;
  fieldRef?: (element: HTMLDivElement | null) => void;
}) {
  return (
    <LabeledField
      label={label}
      required={required}
      invalid={invalid}
      error={error}
      fieldRef={fieldRef}
    >
      <select
        className={cn(
          "w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none focus:border-sage",
          invalid && "border-burgundy focus:border-burgundy",
        )}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </LabeledField>
  );
}

function OptionGroup({
  label,
  items,
  selectedItems,
  onToggle,
  selectionMode = "multiple",
  required = false,
  invalid = false,
  error,
  fieldRef,
}: {
  label: string;
  items: readonly SelectOption[];
  selectedItems: string[];
  onToggle: (value: string) => void;
  selectionMode?: "multiple" | "single";
  required?: boolean;
  invalid?: boolean;
  error?: string;
  fieldRef?: (element: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={fieldRef}
      className={cn(
        "space-y-2 rounded-xl",
        invalid && "ring-2 ring-burgundy/20",
      )}
    >
      <p className={cn("text-[10px] uppercase tracking-[0.18em] text-rosewood/75", invalid && "text-burgundy")}>
        {label}
        {required ? <span className="ml-1 text-burgundy">*</span> : null}
      </p>
      {selectionMode === "single" ? (
        <p className="text-xs text-rosewood/70">Selecione apenas uma opção.</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = selectedItems.includes(item.value);

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition-colors",
                isActive
                  ? "border-sage/35 bg-sage/12 text-burgundy"
                  : "border-rosewood/18 bg-white text-rosewood hover:bg-secondary",
                invalid && !isActive && "border-burgundy/30",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-burgundy">{error}</p> : null}
    </div>
  );
}
