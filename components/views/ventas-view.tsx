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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { BebidasView } from "./bebidas-view"
import { useUIActions } from "@/lib/ui-actions"
import { getVentasPorDia, getVentasPorMes } from "@/lib/api-service"
import { formatARS, formatDateTime, todayISO, currentMonthISO } from "@/lib/format"
import type { ResultadoFiltrado } from "@/lib/types"
import { ShoppingCart } from "lucide-react"
import { useStore } from "@/lib/store"

export function VentasView() {
  const { openVenta } = useUIActions()
  const [modo, setModo] = useState<"dia" | "mes">("dia")
  const [fecha, setFecha] = useState(todayISO())
  const [mes, setMes] = useState(currentMonthISO())
  const [data, setData] = useState<ResultadoFiltrado | null>(null)
  const [loading, setLoading] = useState(false)
  const { ventas: storeVentas } = useStore()

  useEffect(() => {
    setLoading(true)
    const fn =
      modo === "dia"
        ? getVentasPorDia(fecha)
        : getVentasPorMes(mes)
    fn.then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [modo, fecha, mes, storeVentas.length])

  const ventas = data?.ventas ?? []
  const total = data?.resumen?.totalResumen ?? 0

  return (
    <Tabs defaultValue="registrar" className="gap-4">
      <TabsList className="w-full">
        <TabsTrigger value="registrar" className="flex-1">
          Ventas
        </TabsTrigger>
        <TabsTrigger value="stock" className="flex-1">
          Stock
        </TabsTrigger>
      </TabsList>

      <TabsContent value="registrar" className="flex flex-col gap-4">
        <Button size="lg" className="h-14" onClick={openVenta}>
          <ShoppingCart /> Registrar venta
        </Button>

        {/* Filtro día / mes */}
        <Card>
          <CardContent className="flex flex-col gap-3 pt-4">
            <ToggleGroup
              value={[modo]}
              onValueChange={(v) => v[0] && setModo(v[0] as "dia" | "mes")}
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem value="dia" className="flex-1">
                Por día
              </ToggleGroupItem>
              <ToggleGroupItem value="mes" className="flex-1">
                Por mes
              </ToggleGroupItem>
            </ToggleGroup>
            {modo === "dia" ? (
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            ) : (
              <Input
                type="month"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              />
            )}
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                {ventas.length} venta(s)
              </span>
              <span className="font-semibold">{formatARS(total)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial</CardTitle>
            <CardDescription>Consumos del período seleccionado.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Cargando…
              </p>
            ) : ventas.length === 0 ? (
              <Empty className="py-6">
                <EmptyHeader>
                  <EmptyTitle>Sin ventas</EmptyTitle>
                  <EmptyDescription>
                    No hay ventas registradas en este período.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="flex flex-col gap-2">
                {ventas.map((v) => (
                  <li key={v.id} className="rounded-lg border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(v.fechaVenta)}
                      </span>
                      <span className="font-semibold">
                        {formatARS(v.totalVenta)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      {(v.detalles ?? [])
                        .map((d) => `${d.cantidad}× ${d.bebidas.nombreProducto}`)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stock">
        <BebidasView />
      </TabsContent>
    </Tabs>
  )
}
