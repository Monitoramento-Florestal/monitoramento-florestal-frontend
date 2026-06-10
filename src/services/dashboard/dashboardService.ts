import axios from "axios";

import { API_ENDPOINTS } from "@/constants/api";
import { api } from "@/services/api/api";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
});

export interface DashboardPublico {
  totalArvores: number;
  arvoresSaudaveis: number;
  arvoresAcompanhamento: number;
}

export interface DashboardPesquisador {
  arvoresSaudaveis: number;
  solicitacoesPendentes: number;
  registrosCriados: number;
  totalArvores: number;
}

export interface DashboardAdministrativo {
  totalArvores: number;
  arvoresSaudaveis: number;
  arvoresInjuriadas: number;
  arvoresCortadas: number;
  aprovacoesPendentes: number;
}

export async function fetchDashboardPublico() {
  const { data } = await publicApi.get<DashboardPublico>(
    API_ENDPOINTS.DASHBOARD_PUBLICO,
  );

  return data;
}

export async function fetchDashboardPesquisador() {
  const { data } = await api.get<DashboardPesquisador>(
    API_ENDPOINTS.DASHBOARD_PESQUISADOR,
  );

  return data;
}

export async function fetchDashboardGestor() {
  const { data } = await api.get<DashboardAdministrativo>(
    API_ENDPOINTS.DASHBOARD_GESTOR,
  );

  return data;
}

export async function fetchDashboardAdmin() {
  const { data } = await api.get<DashboardAdministrativo>(
    API_ENDPOINTS.DASHBOARD_ADMIN,
  );

  return data;
}
