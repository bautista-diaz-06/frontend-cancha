"use client"

import { createContext, useContext } from "react"
import type { Bebida, Turno } from "./types"

export type TabKey = "inicio" | "turnos" | "ventas" | "reportes" | "config"

export interface UIActions {
  go: (tab: TabKey) => void
  openTurno: (turno?: Turno | null) => void
  openVenta: () => void
  openBebida: (bebida?: Bebida | null) => void
}

const UIActionsContext = createContext<UIActions | null>(null)

export const UIActionsProvider = UIActionsContext.Provider

export function useUIActions(): UIActions {
  const ctx = useContext(UIActionsContext)
  if (!ctx) throw new Error("useUIActions debe usarse dentro de UIActionsProvider")
  return ctx
}
