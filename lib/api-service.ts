// lib/api-service.ts
// Rutas verificadas contra el Swagger de la API desplegada en Railway.

import type {
  Bebida,
  BebidaRequestDTO,
  Turno,
  TurnoRequestDTO,
  Venta,
  VentaRequestDTO,
  RequestRecargoDTO,
  ResultadoFiltrado,
} from "./types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"

// ── Helper genérico ──────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(
      `[API] ${init?.method ?? "GET"} ${path} → ${res.status}: ${msg}`,
    )
  }

  // Manejar respuestas sin body (DELETE devuelve 200 vacío, no 204)
  const contentType = res.headers.get("content-type")
  if (!contentType?.includes("application/json")) return undefined as T
  const text = await res.text()
  if (!text.trim()) return undefined as T
  return JSON.parse(text) as T
}

// ── Turnos ───────────────────────────────────────────────────────────────────
// GET  /api/turnos/       → TurnosResponseDTO[]
// POST /api/turnos/       → TurnosResponseDTO   (crear)
// POST /api/turnos/{id}   → TurnosResponseDTO   (actualizar — la API usa POST, no PUT)
// DELETE /api/turnos/{id} → 200 vacío

export const getTurnos = (): Promise<Turno[]> =>
  request("/turnos/")

export const createTurno = (body: TurnoRequestDTO): Promise<Turno> =>
  request("/turnos/", { method: "POST", body: JSON.stringify(body) })

export const updateTurno = (id: number, body: TurnoRequestDTO): Promise<Turno> =>
  request(`/turnos/${id}`, { method: "POST", body: JSON.stringify(body) })

export const deleteTurno = (id: number): Promise<void> =>
  request(`/turnos/${id}`, { method: "DELETE" })

// ── Bebidas ──────────────────────────────────────────────────────────────────
// GET    /api/bebidas/       → BebidasResponseDTO[]
// POST   /api/bebidas/       → BebidasResponseDTO
// PUT    /api/bebidas/{id}   → BebidasResponseDTO
// DELETE /api/bebidas/{id}   → 200 vacío

export const getBebidas = (): Promise<Bebida[]> =>
  request("/bebidas/")

export const createBebida = (body: BebidaRequestDTO): Promise<Bebida> =>
  request("/bebidas/", { method: "POST", body: JSON.stringify(body) })

export const updateBebida = (id: number, body: BebidaRequestDTO): Promise<Bebida> =>
  request(`/bebidas/${id}`, { method: "PUT", body: JSON.stringify(body) })

export const deleteBebida = (id: number): Promise<void> =>
  request(`/bebidas/${id}`, { method: "DELETE" })

// ── Ventas ───────────────────────────────────────────────────────────────────
// GET  /api/ventas/  → ResultadoFiltradoDTO { ventas: VentaResponseDTO[], resumen: { totalResumen } }
// POST /api/ventas/  → VentaResponseDTO

export const getVentas = (): Promise<ResultadoFiltrado> =>
  request("/ventas/")

export const createVenta = (body: VentaRequestDTO): Promise<Venta> =>
  request("/ventas/", { method: "POST", body: JSON.stringify(body) })

// ── Configuración / Recargo ──────────────────────────────────────────────────
// GET  /api/configuracion/  → number  (devuelve el porcentaje directamente)
// POST /api/configuracion/  → 200 vacío

export const getRecargo = (): Promise<number> =>
  request("/configuracion/")

export const setRecargo = (body: RequestRecargoDTO): Promise<void> =>
  request("/configuracion/", { method: "POST", body: JSON.stringify(body) })
