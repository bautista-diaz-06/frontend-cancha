"use client"

import { useMemo } from "react"
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
import {
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
} from "lucide-react"

const STOCK_BAJO = 5

export function DashboardView() {
  const { turnos, ventas, bebidas } = useStore()
  const { openTurno, openVenta } = useUIActions()
  const hoy = todayISO()

  const stats = useMemo(() => {
    const turnosHoy = turnos.filter((t) => t.fecha === hoy)
    const recaudadoTurnos = turnosHoy.reduce((s, t) => s + (t.total || 0), 0)
    const ventasHoy = ventas.filter((v) => v.fechaVenta.slice(0, 10) === hoy)
    const recaudadoVentas = ventasHoy.reduce((s, v) => s + v.totalVenta, 0)
    const proximosTurnos = turnosHoy.sort(
      (a, b) => a.hora.localeCompare(b.hora),
    )
    const stockBajo = bebidas.filter((b) => b.cantidad <= STOCK_BAJO)
    return {
      turnosHoy,
      recaudadoTurnos,
      ventasHoy,
      recaudadoVentas,
      proximosTurnos,
      stockBajo,
      totalDia: recaudadoTurnos + recaudadoVentas,
    }
  }, [turnos, ventas, bebidas, hoy])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="col-span-2 bg-primary text-primary-foreground">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-primary-foreground/80">
              <DollarSign className="size-4" /> Recaudado hoy
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight">
              {formatARS(stats.totalDia)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary-foreground/80">
              {formatARS(stats.recaudadoTurnos)} en turnos ·{" "}
              {formatARS(stats.recaudadoVentas)} en bebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock className="size-4" /> Turnos
            </CardDescription>
            <CardTitle className="text-2xl">{stats.turnosHoy.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <ShoppingCart className="size-4" /> Ventas
            </CardDescription>
            <CardTitle className="text-2xl">{stats.ventasHoy.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Turnos de hoy</CardTitle>
          <CardDescription>Próximos turnos programados</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.proximosTurnos.length === 0 ? (
            <Empty className="py-6">
              <EmptyHeader>
                <EmptyTitle>Sin turnos</EmptyTitle>
                <EmptyDescription>No hay turnos programados para hoy.</EmptyDescription>
              </EmptyHeader>
              <Button onClick={() => openTurno()}>Crear turno</Button>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.proximosTurnos.slice(0, 3).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.hora}</span>
                    <span className="text-muted-foreground">
                      {formatARS(t.precio)}
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatARS(t.total || 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {stats.stockBajo.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" /> Stock bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              {stats.stockBajo.map((b) => (
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
          <Button
            className="w-full"
            onClick={() => openTurno()}
          >
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
