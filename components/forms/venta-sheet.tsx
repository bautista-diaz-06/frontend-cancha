"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { useStore } from "@/lib/store"
import { formatARS, todayISO } from "@/lib/format"
import type { ItemVenta } from "@/lib/types"
import { Minus, Plus, Search } from "lucide-react"
import { toast } from "sonner"

interface VentaSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VentaSheet({ open, onOpenChange }: VentaSheetProps) {
  const { bebidas, addVenta } = useStore()
  const [cart, setCart] = useState<Record<number, number>>({})
  const [query, setQuery] = useState("")
  const [fecha, setFecha] = useState(todayISO())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setCart({})
      setQuery("")
      setFecha(todayISO())
    }
  }, [open])

  const filtered = useMemo(
    () =>
      bebidas.filter((b) =>
        b.nombreProducto.toLowerCase().includes(query.toLowerCase()),
      ),
    [bebidas, query],
  )

  const items: ItemVenta[] = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({
          bebidaId: Number(id),
          cantidad: qty,
        })),
    [cart],
  )

  const total = items.reduce((s, i) => {
    const b = bebidas.find((x) => x.id === i.bebidaId)
    return s + (b ? i.cantidad! * b.precioVenta : 0)
  }, 0)
  const totalUnidades = items.reduce((s, i) => s + (i.cantidad ?? 0), 0)

  function setQty(id: number, qty: number, max: number) {
    const clamped = Math.max(0, Math.min(qty, max))
    setCart((prev) => ({ ...prev, [id]: clamped }))
  }

  async function handleConfirm() {
    if (items.length === 0) {
      toast.error("Agregá al menos un producto")
      return
    }
    if (!fecha) {
      toast.error("Elegí una fecha para la venta")
      return
    }
    setSaving(true)
    try {
      await addVenta(items, fecha)
      toast.success(`Venta registrada · ${formatARS(total)}`)
      onOpenChange(false)
    } catch {
      toast.error("Error al registrar la venta. Verificá la conexión con el servidor.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[92vh] flex-col">
        <SheetHeader>
          <SheetTitle>Registrar venta</SheetTitle>
          <SheetDescription>Sumá productos al carrito y confirmá.</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <Field>
            <FieldLabel htmlFor="v-fecha">Fecha de la venta</FieldLabel>
            <Input
              id="v-fecha"
              type="date"
              max={todayISO()}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Field>
        </div>

        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar bebida"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {filtered.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Sin resultados</EmptyTitle>
                <EmptyDescription>No hay productos para esa búsqueda.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((b) => {
                const qty = cart[b.id] ?? 0
                const agotado = b.cantidad === 0
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{b.nombreProducto}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatARS(b.precioVenta)} · stock {b.cantidad}
                      </p>
                    </div>
                    {agotado ? (
                      <Badge variant="secondary">Agotado</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setQty(b.id, qty - 1, b.cantidad)}
                          disabled={qty === 0 || saving}
                          aria-label={`Quitar ${b.nombreProducto}`}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center font-medium tabular-nums">
                          {qty}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setQty(b.id, qty + 1, b.cantidad)}
                          disabled={qty >= b.cantidad || saving}
                          aria-label={`Agregar ${b.nombreProducto}`}
                        >
                          <Plus />
                        </Button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <Separator />
        <SheetFooter>
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-sm text-muted-foreground">
              {totalUnidades} {totalUnidades === 1 ? "unidad" : "unidades"}
            </span>
            <span className="text-xl font-semibold">{formatARS(total)}</span>
          </div>
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={items.length === 0 || saving}
          >
            {saving ? "Registrando…" : "Confirmar venta"}
          </Button>
          <SheetClose
            render={
              <Button size="lg" variant="outline" disabled={saving}>
                Cancelar
              </Button>
            }
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}