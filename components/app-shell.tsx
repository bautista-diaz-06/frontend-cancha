"use client"

import { useCallback, useMemo, useState } from "react"
import { StoreProvider } from "@/lib/store"
import {
  UIActionsProvider,
  type TabKey,
  type UIActions,
} from "@/lib/ui-actions"
import type { Bebida, Turno } from "@/lib/types"
import { BottomNav } from "@/components/bottom-nav"
import { QuickFab } from "@/components/quick-fab"
import { DashboardView } from "@/components/views/dashboard-view"
import { TurnosView } from "@/components/views/turnos-view"
import { VentasView } from "@/components/views/ventas-view"
import { ReportesView } from "@/components/views/reportes-view"
import { ConfigView } from "@/components/views/config-view"
import { TurnoSheet } from "@/components/forms/turno-sheet"
import { BebidaSheet } from "@/components/forms/bebida-sheet"
import { VentaSheet } from "@/components/forms/venta-sheet"
import { Toaster } from "@/components/ui/sonner"

const titles: Record<TabKey, { title: string; subtitle: string }> = {
  inicio: { title: "Inicio", subtitle: "Resumen del día" },
  turnos: { title: "Turnos", subtitle: "Reservas de cancha" },
  ventas: { title: "Ventas", subtitle: "Bebidas y consumos" },
  reportes: { title: "Reportes", subtitle: "Ingresos del mes" },
  config: { title: "Ajustes", subtitle: "Configuración del complejo" },
}

export function AppShell() {
  return (
    <StoreProvider>
      <ShellInner />
    </StoreProvider>
  )
}

function ShellInner() {
  const [tab, setTab] = useState<TabKey>("inicio")
  const [turnoOpen, setTurnoOpen] = useState(false)
  const [bebidaOpen, setBebidaOpen] = useState(false)
  const [ventaOpen, setVentaOpen] = useState(false)
  const [editingTurno, setEditingTurno] = useState<Turno | null>(null)
  const [editingBebida, setEditingBebida] = useState<Bebida | null>(null)

  const openTurno = useCallback((turno?: Turno | null) => {
    setEditingTurno(turno ?? null)
    setTurnoOpen(true)
  }, [])

  const openBebida = useCallback((bebida?: Bebida | null) => {
    setEditingBebida(bebida ?? null)
    setBebidaOpen(true)
  }, [])

  const openVenta = useCallback(() => setVentaOpen(true), [])

  const actions = useMemo<UIActions>(
    () => ({ go: setTab, openTurno, openVenta, openBebida }),
    [openTurno, openVenta, openBebida],
  )

  const header = titles[tab]

  return (
    <UIActionsProvider value={actions}>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
        <header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">A</span>
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">
                {header.title}
              </h1>
              <p className="text-xs text-muted-foreground">{header.subtitle}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-4">
          {tab === "inicio" && <DashboardView />}
          {tab === "turnos" && <TurnosView />}
          {tab === "ventas" && <VentasView />}
          {tab === "reportes" && <ReportesView />}
          {tab === "config" && <ConfigView />}
        </main>

        <QuickFab />
        <BottomNav active={tab} onChange={setTab} />
      </div>

      <TurnoSheet
        open={turnoOpen}
        onOpenChange={setTurnoOpen}
        turno={editingTurno}
      />
      <BebidaSheet
        open={bebidaOpen}
        onOpenChange={setBebidaOpen}
        bebida={editingBebida}
      />
      <VentaSheet open={ventaOpen} onOpenChange={setVentaOpen} />
      <Toaster position="top-center" />
    </UIActionsProvider>
  )
}
