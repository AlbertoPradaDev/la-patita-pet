import { apiFetch } from "./api";

const TOKEN_KEY = "patita_admin_token";
const NEGOCIO_KEY = "patita_admin_negocio";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NEGOCIO_KEY);
}
export function getNegocio() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(NEGOCIO_KEY) || "null"); } catch { return null; }
}
export function setNegocio(n: unknown) { localStorage.setItem(NEGOCIO_KEY, JSON.stringify(n)); }

export async function adminFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (res.status === 204) return {} as T;
  return res.json();
}

export async function isAdminConfigured(): Promise<boolean> {
  const data = await apiFetch<{ configurado: boolean }>(`/api/admin/check?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`);
  return data.configurado;
}

/* ── Types ── */
export interface Negocio { id: number; nombre: string; email: string; }
export interface Empleado { id: number; nombre: string; email?: string; telefono?: string; }
export interface Servicio { id: number; nombre: string; duracion: number; precio?: number; empleadoId: number; }
export interface Horario { id: number; diaSemana: string; horaInicio: string; horaFin: string; empleadoId: number; }
export interface Pausa { id: number; diaSemana: string; horaInicio: string; horaFin: string; empleadoId: number; }
export interface DiaBloqueado { id: number; fecha: string; motivo?: string; empleadoId: number; }
export interface Cita {
  id: number;
  nombreCliente: string;
  emailCliente: string;
  fecha: string;
  estado: "pendiente" | "confirmada" | "cancelada";
  creadoEn: string;
  servicio: { id: number; nombre: string; duracion: number; precio?: number; };
  empleado: { id: number; nombre: string; email?: string; };
}

/* ── Constants ── */
export const DIAS_SEMANA = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"] as const;
export const DIAS_SEMANA_PT = ["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"];
export const MESES_PT_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const MESES_PT_CURTO = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
export const DIAS_SEMANA_HEADER = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

/* ── Helpers ── */
export function formatarFechaYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
export function formatarHora(fecha: string): string {
  const d = new Date(fecha);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
export function formatarFechaHora(fecha: string): string {
  const d = new Date(fecha);
  return `${String(d.getDate()).padStart(2,"0")} ${MESES_PT_CURTO[d.getMonth()]} · ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
export function formatarFechaLegible(fechaStr: string): string {
  const d = new Date(fechaStr);
  return d.toLocaleDateString("pt-PT", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
}
