"use client"

import {
  createContext,
  useCallback,
  useContext,
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
import {
  RECARGO_INICIAL,
  bebidasSeed,
  turnosSeed,
  ventasSeed,
} from "./mock-data"

interface StoreContextValue {
  turnos: Turno[]
  bebidas: Bebida[]
  ventas: Venta[]
  recargoPct: number
  // turnos
  addTurno: (input: TurnoRequestDTO) => void
  updateTurno: (id: number, input: TurnoRequestDTO) => void
  deleteTurno: (id: number) => void
  // bebidas
  addBebida: (input: BebidaRequestDTO) => void
  updateBebida: (id: number, input: BebidaRequestDTO) => void
  deleteBebida: (id: number) => void
  // ventas
  addVenta: (items: ItemVenta[]) => void
  // config
  setRecargo: (pct: number) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

let nextTurnoId = turnosSeed.length + 1
let nextBebidaId = bebidasSeed.length + 1
let nextVentaId = ventasSeed.length + 1

export function StoreProvider({ children }: { children: ReactNode }) {
  const [turnos, setTurnos] = useState<Turno[]>(turnosSeed)
  const [bebidas, setBebidas] = useState<Bebida[]>(bebidasSeed)
  const [ventas, setVentas] = useState<Venta[]>(ventasSeed)
  const [recargoPct, setRecargoPct] = useState<number>(RECARGO_INICIAL)

  const addTurno = useCallback(
    (input: TurnoRequestDTO) => {
      const recargo = (input.precio * recargoPct) / 100
      const total = input.precio + recargo
      setTurnos((prev) => [
        ...prev,
        {
          id: nextTurnoId++,
          ...input,
          recargoCobrado: recargo,
          total,
        },
      ])
    },
    [recargoPct],
  )

  const updateTurno = useCallback((id: number, input: TurnoRequestDTO) => {
    setTurnos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const recargo = (input.precio * recargoPct) / 100
          const total = input.precio + recargo
          return { ...input, id, recargoCobrado: recargo, total }
        }
        return t
      }),
    )
  }, [recargoPct])

  const deleteTurno = useCallback((id: number) => {
    setTurnos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addBebida = useCallback((input: BebidaRequestDTO) => {
    setBebidas((prev) => [...prev, { ...input, id: nextBebidaId++ }])
  }, [])

  const updateBebida = useCallback((id: number, input: BebidaRequestDTO) => {
    setBebidas((prev) => prev.map((b) => (b.id === id ? { ...b, ...input } : b)))
  }, [])

  const deleteBebida = useCallback((id: number) => {
    setBebidas((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const addVenta = useCallback((items: ItemVenta[]) => {
    // Calcular total basado en bebidas
    let totalVenta = 0
    const detalles = items
      .map((item) => {
        const bebida = bebidas.find((b) => b.id === item.bebidaId)
        if (!bebida) return null
        const cant = item.cantidad || 1
        const subtotal = bebida.precioVenta * cant
        totalVenta += subtotal
        return {
          id: Math.random(),
          bebidas: {
            nombreProducto: bebida.nombreProducto,
            precioCompra: bebida.precioCompra,
            precioVenta: bebida.precioVenta,
          },
          cantidad: cant,
          precioUnitario: bebida.precioVenta,
          subtotal,
        }
      })
      .filter(Boolean) as Venta["detalles"]

    setVentas((prev) => [
      {
        id: nextVentaId++,
        fechaVenta: new Date().toISOString(),
        totalVenta,
        detalles,
      },
      ...prev,
    ])

    // Descontar stock
    setBebidas((prev) =>
      prev.map((b) => {
        const sold = items.find((i) => i.bebidaId === b.id)
        return sold
          ? { ...b, cantidad: Math.max(0, b.cantidad - (sold.cantidad || 1)) }
          : b
      }),
    )
  }, [bebidas])

  const setRecargo = useCallback((pct: number) => {
    setRecargoPct(pct)
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      turnos,
      bebidas,
      ventas,
      recargoPct,
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
      turnos,
      bebidas,
      ventas,
      recargoPct,
      addTurno,
      updateTurno,
      deleteTurno,
      addBebida,
      updateBebida,
      deleteBebida,
      addVenta,
      setRecargo,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider")
  return ctx
}
