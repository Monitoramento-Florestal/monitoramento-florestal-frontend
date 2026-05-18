"use client";

import { useState } from "react";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/constants/roles";
import type { Tree, TreeMeasurementRecord } from "@/types/trees";
import {
  getTreeRecordFooterHint,
  getTreeRecordFormSubtitle,
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

const TREE_PROBLEM_OPTIONS = ["pragas", "fungos", "podridao", "injuria", "nenhum"];
const TREE_POSITION_OPTIONS = ["tronco", "raiz", "copa"];
const TREE_VIGOR_OPTIONS = ["alto", "medio", "baixo"];
const TREE_CONFLICT_OPTIONS = {
  fiacao: ["ausente", "potencial", "conflito"],
  calcada: ["sem dano", "leve", "severo"],
  iluminacao: ["sem", "parcial", "bloqueio"],
  edificacao: ["sem", "potencial", "conflito"],
};
const TREE_STRUCTURE_OPTIONS = {
  tronco: ["sem defeitos", "fissuras longitudinais", "cavidades", "apodrecimento", "descascamento"],
  baseColo: ["normal", "raiz exposta", "solo compactado", "levantamento de calcada", "inclinacao da base"],
  copa: ["assimetrica", "excesso de peso lateral", "galhos secos", "galhos codominantes"],
};
const TREE_RISK_OPTIONS = {
  inclinacaoTronco: ["ausente", "leve", "moderada", "critica"],
  ancoragemRadicular: ["estavel", "parcialmente comprometida", "comprometida"],
  fluxoVeiculos: ["baixo", "medio", "alto"],
  fluxoPedestres: ["baixo", "medio", "alto"],
  tipoVia: ["residencial", "coletora", "arterial", "comercial/central"],
};
const TREE_TARGET_OPTIONS = {
  alvosPotenciais: ["pedestres", "veiculos", "residencia", "equipamento publico", "sem alvo relevante"],
  alvosSensiveis: ["escola", "hospital", "parada de onibus", "praca/area de lazer", "nenhum"],
};
const TREE_MANAGEMENT_OPTIONS = {
  acao: ["nenhuma", "poda leve", "poda conducao", "poda pesada", "controle fitossanitario", "ampliacao canteiro", "substituicao", "supressao"],
  prioridade: ["baixa", "media", "alta", "emergencial"],
};

export function TreeRecordFormScreen({
  mode,
  record = null,
  role,
  tree = null,
}: TreeRecordFormScreenProps) {
  const [values, setValues] = useState<TreeRecordFormValues>(() =>
    getTreeRecordFormValues(tree, record)
  );
  const [submissionState, setSubmissionState] = useState<"idle" | "success">("idle");

  function updateValue<Key extends keyof TreeRecordFormValues>(
    key: Key,
    value: TreeRecordFormValues[Key]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleArrayValue(key: "problemas" | "tronco" | "baseColo" | "copa" | "alvosPotenciais" | "alvosSensiveis", value: string) {
    setValues((current) => {
      const currentValues = current[key];
      const hasValue = currentValues.includes(value);

      return {
        ...current,
        [key]: hasValue
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("success");
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {tree ? (
        <DashboardCard className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/70">
                {tree.codigo}
              </p>
              <h2 className="mt-1 text-xl tracking-tight text-burgundy">
                {tree.nomeComum}
              </h2>
              <p className="mt-1 text-sm italic text-rosewood">{tree.especie}</p>
            </div>
            {record ? (
              <div className="rounded-full border border-rosewood/12 bg-secondary px-3 py-1 text-xs text-rosewood">
                Registro v{record.version}
              </div>
            ) : null}
          </div>
          <p className="text-sm leading-6 text-rosewood">
            {getTreeRecordFormSubtitle(role, mode)}
          </p>
        </DashboardCard>
      ) : null}

      {submissionState === "success" ? (
        <DashboardCard className="border-sage/20 bg-sage/8">
          <h3 className="text-base tracking-tight text-burgundy">
            {role === UserRole.RESEARCHER ? "Solicitacao preparada" : "Alteracao preparada"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            {getTreeRecordFooterHint(role, mode)}
          </p>
        </DashboardCard>
      ) : null}

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Identificacao da arvore</h3>
          <p className="mt-1 text-sm text-rosewood">Dados base da especie e georreferenciamento.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LabeledField label="Nome comum">
            <Input value={values.nomeComum} onChange={(event) => updateValue("nomeComum", event.target.value)} />
          </LabeledField>
          <LabeledField label="Nome cientifico">
            <Input value={values.especie} onChange={(event) => updateValue("especie", event.target.value)} />
          </LabeledField>
          <LabeledField label="Latitude">
            <Input value={values.lat} onChange={(event) => updateValue("lat", event.target.value)} />
          </LabeledField>
          <LabeledField label="Longitude">
            <Input value={values.lng} onChange={(event) => updateValue("lng", event.target.value)} />
          </LabeledField>
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Localizacao e coleta</h3>
          <p className="mt-1 text-sm text-rosewood">Contexto urbano e dados do momento da medicao.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <LabeledField label="Bairro">
            <Input value={values.bairro} onChange={(event) => updateValue("bairro", event.target.value)} />
          </LabeledField>
          <LabeledField label="Rua">
            <Input value={values.rua} onChange={(event) => updateValue("rua", event.target.value)} />
          </LabeledField>
          <LabeledField label="Numero da residencia">
            <Input value={values.numeroResidencia} onChange={(event) => updateValue("numeroResidencia", event.target.value)} />
          </LabeledField>
          <LabeledField label="Referencia">
            <Input value={values.referencia} onChange={(event) => updateValue("referencia", event.target.value)} />
          </LabeledField>
          <LabeledField label="Data da coleta">
            <Input type="date" value={values.dataColeta} onChange={(event) => updateValue("dataColeta", event.target.value)} />
          </LabeledField>
          <LabeledField label="Equipe">
            <Input value={values.equipe} onChange={(event) => updateValue("equipe", event.target.value)} />
          </LabeledField>
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Dimensoes e condicao</h3>
          <p className="mt-1 text-sm text-rosewood">Medidas dendrometricas e estado geral do exemplar.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <LabeledField label="DAP (cm)">
            <Input value={values.dapCm} onChange={(event) => updateValue("dapCm", event.target.value)} />
          </LabeledField>
          <LabeledField label="Altura (m)">
            <Input value={values.alturaM} onChange={(event) => updateValue("alturaM", event.target.value)} />
          </LabeledField>
          <LabeledField label="Copa (m)">
            <Input value={values.copaM} onChange={(event) => updateValue("copaM", event.target.value)} />
          </LabeledField>
        </div>

        <label className="flex items-center gap-2 text-sm text-rosewood">
          <input
            checked={values.medidaEstimada}
            type="checkbox"
            onChange={(event) => updateValue("medidaEstimada", event.target.checked)}
          />
          Medida estimada
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <LabeledField label="Estado geral">
            <select
              className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm"
              value={values.estadoGeral}
              onChange={(event) => updateValue("estadoGeral", event.target.value as TreeRecordFormValues["estadoGeral"])}
            >
              {["1", "2", "3", "4", "5"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </LabeledField>
          <LabeledField label="Vigor">
            <select
              className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm"
              value={values.vigor}
              onChange={(event) => updateValue("vigor", event.target.value as TreeRecordFormValues["vigor"])}
            >
              {TREE_VIGOR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </LabeledField>
        </div>

        <OptionGroup
          items={TREE_PROBLEM_OPTIONS}
          label="Problemas"
          selectedItems={values.problemas}
          onToggle={(value) => toggleArrayValue("problemas", value)}
        />

        <LabeledField label="Posicao do problema">
          <select
            className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm"
            value={values.posicaoProblema}
            onChange={(event) => updateValue("posicaoProblema", event.target.value as TreeRecordFormValues["posicaoProblema"])}
          >
            <option value="">Nao informado</option>
            {TREE_POSITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </LabeledField>
      </DashboardCard>

      <DashboardCard className="space-y-5">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Estrutura, risco e conflitos</h3>
          <p className="mt-1 text-sm text-rosewood">Leitura tecnica para risco estrutural e conflitos urbanos.</p>
        </div>

        <OptionGroup items={TREE_STRUCTURE_OPTIONS.tronco} label="Tronco" selectedItems={values.tronco} onToggle={(value) => toggleArrayValue("tronco", value)} />
        <OptionGroup items={TREE_STRUCTURE_OPTIONS.baseColo} label="Base / colo" selectedItems={values.baseColo} onToggle={(value) => toggleArrayValue("baseColo", value)} />
        <OptionGroup items={TREE_STRUCTURE_OPTIONS.copa} label="Copa" selectedItems={values.copa} onToggle={(value) => toggleArrayValue("copa", value)} />
        <OptionGroup items={TREE_TARGET_OPTIONS.alvosPotenciais} label="Alvos potenciais" selectedItems={values.alvosPotenciais} onToggle={(value) => toggleArrayValue("alvosPotenciais", value)} />
        <OptionGroup items={TREE_TARGET_OPTIONS.alvosSensiveis} label="Alvos sensiveis" selectedItems={values.alvosSensiveis} onToggle={(value) => toggleArrayValue("alvosSensiveis", value)} />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Inclinacao do tronco" value={values.inclinacaoTronco} options={TREE_RISK_OPTIONS.inclinacaoTronco} onChange={(value) => updateValue("inclinacaoTronco", value)} />
          <SelectField label="Ancoragem radicular" value={values.ancoragemRadicular} options={TREE_RISK_OPTIONS.ancoragemRadicular} onChange={(value) => updateValue("ancoragemRadicular", value)} />
          <SelectField label="Fluxo de veiculos" value={values.fluxoVeiculos} options={TREE_RISK_OPTIONS.fluxoVeiculos} onChange={(value) => updateValue("fluxoVeiculos", value)} />
          <SelectField label="Fluxo de pedestres" value={values.fluxoPedestres} options={TREE_RISK_OPTIONS.fluxoPedestres} onChange={(value) => updateValue("fluxoPedestres", value)} />
          <SelectField label="Tipo de via" value={values.tipoVia} options={TREE_RISK_OPTIONS.tipoVia} onChange={(value) => updateValue("tipoVia", value)} />
          <SelectField label="Fiacao" value={values.fiacao} options={TREE_CONFLICT_OPTIONS.fiacao} onChange={(value) => updateValue("fiacao", value)} />
          <SelectField label="Calcada" value={values.calcada} options={TREE_CONFLICT_OPTIONS.calcada} onChange={(value) => updateValue("calcada", value)} />
          <SelectField label="Iluminacao" value={values.iluminacao} options={TREE_CONFLICT_OPTIONS.iluminacao} onChange={(value) => updateValue("iluminacao", value)} />
          <SelectField label="Edificacao" value={values.edificacao} options={TREE_CONFLICT_OPTIONS.edificacao} onChange={(value) => updateValue("edificacao", value)} />
          <SelectField label="Acao de manejo" value={values.manejoAcao} options={TREE_MANAGEMENT_OPTIONS.acao} onChange={(value) => updateValue("manejoAcao", value)} />
          <SelectField label="Prioridade de manejo" value={values.manejoPrioridade} options={TREE_MANAGEMENT_OPTIONS.prioridade} onChange={(value) => updateValue("manejoPrioridade", value)} />
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div>
          <h3 className="text-xl tracking-tight text-burgundy">Observacoes e fotografias</h3>
          <p className="mt-1 text-sm text-rosewood">Complementos do laudo tecnico e registro visual opcional.</p>
        </div>

        <LabeledField label="Observacoes">
          <textarea
            className="min-h-32 w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm outline-none focus:border-sage"
            value={values.observacoes}
            onChange={(event) => updateValue("observacoes", event.target.value)}
          />
        </LabeledField>

        <div className="rounded-xl border border-dashed border-rosewood/25 bg-card/45 px-4 py-10 text-center text-sm text-rosewood">
          Fotos sao opcionais. O upload sera conectado na etapa de integracao.
        </div>
      </DashboardCard>

      <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-xl border border-rosewood/10 bg-cream/95 px-5 py-4 backdrop-blur">
        <p className="max-w-2xl text-sm leading-6 text-rosewood">
          {getTreeRecordFooterHint(role, mode)}
        </p>
        <Button type="submit" size="lg">
          {getTreeRecordSubmitLabel(role, mode)}
        </Button>
      </div>
    </form>
  );
}

function LabeledField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
        {label}
      </span>
      {children}
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <LabeledField label={label}>
      <select
        className="w-full rounded-md border border-rosewood/30 bg-white px-3 py-2 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </LabeledField>
  );
}

function OptionGroup({
  items,
  label,
  onToggle,
  selectedItems,
}: {
  items: string[];
  label: string;
  onToggle: (value: string) => void;
  selectedItems: string[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = selectedItems.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={[
                "rounded-full border px-3 py-2 text-sm transition-colors",
                isActive
                  ? "border-sage/35 bg-sage/12 text-burgundy"
                  : "border-rosewood/18 bg-white text-rosewood hover:bg-secondary",
              ].join(" ")}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
