"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { useStore } from "@/lib/store"
import { useUIActions } from "@/lib/ui-actions"
import { formatARS, todayISO } from "@/lib/format"
import { getTurnosPorDia, getVentasPorDia } from "@/lib/api-service"
import type { Turno } from "@/lib/types"
import type { ResultadoFiltrado, TurnoReporte } from "@/lib/types"
import { DollarSign, ShoppingCart, Clock, AlertTriangle } from "lucide-react"

const STOCK_BAJO = 5

export function DashboardView() {
  const { bebidas } = useStore()
  const { openTurno, openVenta } = useUIActions()
  const hoy = todayISO()

  const [turnosData, setTurnosData] = useState<TurnoReporte | null>(null)
  const [ventasData, setVentasData] = useState<ResultadoFiltrado | null>(null)

  useEffect(() => {
    getTurnosPorDia(hoy).then(setTurnosData).catch(() => null)
    getVentasPorDia(hoy).then(setVentasData).catch(() => null)
  }, [hoy])

  const turnosHoy: Turno[] = turnosData?.turnos ?? []
  const recaudadoTurnos = turnosData?.totalGeneral ?? 0
  const ventasHoy = ventasData?.ventas ?? []
  const recaudadoVentas = ventasData?.resumen?.totalResumen ?? 0
  const totalDia = recaudadoTurnos + recaudadoVentas
  const stockBajo = bebidas.filter((b) => b.cantidad <= STOCK_BAJO)

  const proximosTurnos = [...turnosHoy].sort((a, b) =>
    a.hora.localeCompare(b.hora),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="col-span-2 bg-primary text-primary-foreground">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-primary-foreground/80">
              <DollarSign className="size-4" /> Recaudado hoy
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight">
              {formatARS(totalDia)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary-foreground/80">
              {formatARS(recaudadoTurnos)} en turnos ·{" "}
              {formatARS(recaudadoVentas)} en bebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock className="size-4" /> Turnos
            </CardDescription>
            <CardTitle className="text-2xl">{turnosHoy.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <ShoppingCart className="size-4" /> Ventas
            </CardDescription>
            <CardTitle className="text-2xl">{ventasHoy.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Turnos de hoy</CardTitle>
          <CardDescription>Próximos turnos programados</CardDescription>
        </CardHeader>
        <CardContent>
          {proximosTurnos.length === 0 ? (
            <Empty className="py-6">
              <EmptyHeader>
                <EmptyTitle>Sin turnos</EmptyTitle>
                <EmptyDescription>
                  No hay turnos programados para hoy.
                </EmptyDescription>
              </EmptyHeader>
              <Button onClick={() => openTurno()}>Crear turno</Button>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {proximosTurnos.slice(0, 3).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.hora.slice(0, 5)}</span>
                    <span className="text-muted-foreground">
                      {formatARS(t.precio)}
                    </span>
                  </div>
                  <span className="font-medium">{formatARS(t.total || 0)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {stockBajo.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" /> Stock bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              {stockBajo.map((b) => (
                <li key={b.id} className="text-muted-foreground">
                  {b.nombreProducto} · {b.cantidad} unidades
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => openTurno()}>
            Nuevo turno
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => openVenta()}
          >
            Nueva venta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
