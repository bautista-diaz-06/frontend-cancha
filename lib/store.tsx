"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  Bebida,
  BebidaRequestDTO,
  Turno,
  TurnoRequestDTO,
  Venta,
  ItemVenta,
} from "./types"
import * as api from "./api-service"

interface StoreContextValue {
  turnos: Turno[]
  bebidas: Bebida[]
  ventas: Venta[]
  recargoPct: number
  loading: boolean
  error: string | null
  refresh: () => void
  // turnos
  addTurno: (input: TurnoRequestDTO) => Promise<void>
  updateTurno: (id: number, input: TurnoRequestDTO) => Promise<void>
  deleteTurno: (id: number) => Promise<void>
  // bebidas
  addBebida: (input: BebidaRequestDTO) => Promise<void>
  updateBebida: (id: number, input: BebidaRequestDTO) => Promise<void>
  deleteBebida: (id: number) => Promise<void>
  // ventas
  addVenta: (items: ItemVenta[]) => Promise<void>
  // config
  setRecargo: (pct: number) => Promise<void>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [bebidas, setBebidas] = useState<Bebida[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [recargoPct, setRecargoPct] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Carga inicial ──────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [t, b, ventasResult, recargo] = await Promise.all([
        api.getTurnos(),
        api.getBebidas(),
        api.getVentas(),     // devuelve ResultadoFiltradoDTO
        api.getRecargo(),    // devuelve number directamente
      ])
      setTurnos(t)
      setBebidas(b)
      setVentas(ventasResult.ventas)  // extraer el array del wrapper
      setRecargoPct(recargo)          // ya es number, sin .recargo
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Turnos ─────────────────────────────────────────────────────────────────

  const addTurno = useCallback(async (input: TurnoRequestDTO) => {
    const newTurno = await api.createTurno(input)
    setTurnos((prev) => [...prev, newTurno])
  }, [])

  const updateTurno = useCallback(async (id: number, input: TurnoRequestDTO) => {
    const updated = await api.updateTurno(id, input)
    setTurnos((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }, [])

  const deleteTurno = useCallback(async (id: number) => {
    await api.deleteTurno(id)
    setTurnos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ── Bebidas ────────────────────────────────────────────────────────────────

  const addBebida = useCallback(async (input: BebidaRequestDTO) => {
    const newBebida = await api.createBebida(input)
    setBebidas((prev) => [...prev, newBebida])
  }, [])

  const updateBebida = useCallback(async (id: number, input: BebidaRequestDTO) => {
    const updated = await api.updateBebida(id, input)
    setBebidas((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }, [])

  const deleteBebida = useCallback(async (id: number) => {
    await api.deleteBebida(id)
    setBebidas((prev) => prev.filter((b) => b.id !== id))
  }, [])

  // ── Ventas ─────────────────────────────────────────────────────────────────

  const addVenta = useCallback(async (items: ItemVenta[]) => {
    const venta = await api.createVenta({
      fechaVenta: new Date().toISOString(),
      items,
    })
    setVentas((prev) => [venta, ...prev])
    // Refrescar bebidas para que el stock quede actualizado
    const updatedBebidas = await api.getBebidas()
    setBebidas(updatedBebidas)
  }, [])

  // ── Config ─────────────────────────────────────────────────────────────────

  const setRecargo = useCallback(async (pct: number) => {
    // La API devuelve 200 vacío, actualizamos el estado local directamente
    await api.setRecargo({ recargo: pct })
    setRecargoPct(pct)
  }, [])

  // ── Context value ──────────────────────────────────────────────────────────

  const value = useMemo<StoreContextValue>(
    () => ({
      turnos,
      bebidas,
      ventas,
      recargoPct,
      loading,
      error,
      refresh: fetchAll,
      addTurno,
      updateTurno,
      deleteTurno,
      addBebida,
      updateBebida,
      deleteBebida,
      addVenta,
      setRecargo,
    }),
    [
      turnos, bebidas, ventas, recargoPct, loading, error, fetchAll,
      addTurno, updateTurno, deleteTurno,
      addBebida, updateBebida, deleteBebida,
      addVenta, setRecargo,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider")
  return ctx
}
