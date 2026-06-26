"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { formatARS } from "@/lib/format"
import { Percent } from "lucide-react"
import { toast } from "sonner"

export function ConfigView() {
  const { recargoPct, setRecargo } = useStore()
  const [valor, setValor] = useState(String(recargoPct))

  const pct = Number(valor) || 0
  const ejemploBase = 18000
  const ejemploTotal = Math.round(ejemploBase * (1 + pct / 100))

  function handleSave() {
    if (pct < 0 || pct > 100) {
      toast.error("El recargo debe estar entre 0 y 100%")
      return
    }
    setRecargo(pct)
    toast.success("Recargo actualizado")
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Percent className="size-4 text-primary" />
            Recargo global
          </CardTitle>
          <CardDescription>
            Se aplica sobre el precio base de cada nuevo turno.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="recargo">Porcentaje de recargo</FieldLabel>
            <div className="relative">
              <Input
                id="recargo"
                type="number"
                inputMode="numeric"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            <FieldDescription>
              Recargo actual aplicado: {recargoPct}%
            </FieldDescription>
          </Field>

          <Separator />

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium">Ejemplo de cálculo</p>
            <div className="mt-2 flex items-center justify-between text-muted-foreground">
              <span>Precio base</span>
              <span>{formatARS(ejemploBase)}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Recargo ({pct}%)</span>
              <span>{formatARS(ejemploTotal - ejemploBase)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>Total a cobrar</span>
              <span>{formatARS(ejemploTotal)}</span>
            </div>
          </div>

          <Button size="lg" onClick={handleSave}>
            Guardar recargo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acerca de AppCancha</CardTitle>
          <CardDescription>
            Gestión de turnos y bebidas para complejos de fútbol 5.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Versión demo con datos de prueba. Los cambios se mantienen mientras la
          sesión esté abierta y se reinician al recargar.
        </CardContent>
      </Card>
    </div>
  )
}
