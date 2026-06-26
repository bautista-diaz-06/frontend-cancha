"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { BebidasView } from "./bebidas-view"
import { useStore } from "@/lib/store"
import { useUIActions } from "@/lib/ui-actions"
import { formatARS, formatDateTime } from "@/lib/format"
import { ShoppingCart } from "lucide-react"

export function VentasView() {
  const { ventas } = useStore()
  const { openVenta } = useUIActions()

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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de ventas</CardTitle>
            <CardDescription>Últimos consumos registrados.</CardDescription>
          </CardHeader>
          <CardContent>
            {ventas.length === 0 ? (
              <Empty className="py-6">
                <EmptyHeader>
                  <EmptyTitle>Sin ventas</EmptyTitle>
                  <EmptyDescription>
                    Registrá tu primera venta de bebidas.
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
                      {v.detalles
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
