const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers,
    },
  });
  return res.json() as Promise<T>;
}

/* ── helpers ── */
export function formatearFecha(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getProximasDosSemanas(): Date[] {
  const dias: Date[] = [];
  const hoy = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    dias.push(d);
  }
  return dias;
}

export const DIAS_PT = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/* ── API types ── */
export interface Empleado {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  duracion: number;
  precio?: number;
}

export interface DiaDisponible {
  fecha: string;
  disponible: boolean;
  huecos: string[];
  horasOcupadas: string[];
  date: Date;
}
