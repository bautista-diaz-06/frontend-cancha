"use client"

import { useEffect, useState } from "react"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useStore } from "@/lib/store"
import type { Bebida, BebidaRequestDTO } from "@/lib/types"
import { toast } from "sonner"

interface BebidaSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bebida?: Bebida | null
}

const emptyForm: BebidaRequestDTO = {
  nombreProducto: "",
  precioCompra: 0,
  precioVenta: 0,
  cantidad: 0,
}

export function BebidaSheet({ open, onOpenChange, bebida }: BebidaSheetProps) {
  const { addBebida, updateBebida } = useStore()
  const [form, setForm] = useState<BebidaRequestDTO>(emptyForm)

  useEffect(() => {
    if (open) {
      setForm(
        bebida
          ? {
              nombreProducto: bebida.nombreProducto,
              precioCompra: bebida.precioCompra,
              precioVenta: bebida.precioVenta,
              cantidad: bebida.cantidad,
            }
          : emptyForm,
      )
    }
  }, [open, bebida])

  function handleSave() {
    if (!form.nombreProducto.trim()) {
      toast.error("Ingresá el nombre del producto")
      return
    }
    if (form.precioCompra <= 0 || form.precioVenta <= 0) {
      toast.error("Los precios deben ser mayores a cero")
      return
    }
    if (form.cantidad < 0) {
      toast.error("La cantidad no puede ser negativa")
      return
    }

    const input: BebidaRequestDTO = {
      nombreProducto: form.nombreProducto.trim(),
      precioCompra: form.precioCompra,
      precioVenta: form.precioVenta,
      cantidad: form.cantidad,
    }

    if (bebida) {
      updateBebida(bebida.id, input)
      toast.success("Bebida actualizada")
    } else {
      addBebida(input)
      toast.success("Bebida registrada")
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{bebida ? "Editar bebida" : "Nueva bebida"}</SheetTitle>
          <SheetDescription>
            Nombre, precios de compra y venta, cantidad en stock.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 py-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="b-nombre">Nombre</FieldLabel>
              <Input
                id="b-nombre"
                placeholder="Coca Cola, Agua, etc."
                value={form.nombreProducto}
                onChange={(e) =>
                  setForm({ ...form, nombreProducto: e.target.value })
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="b-compra">Precio compra</FieldLabel>
                <Input
                  id="b-compra"
                  type="number"
                  inputMode="decimal"
                  step="100"
                  value={form.precioCompra}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      precioCompra: Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="b-venta">Precio venta</FieldLabel>
                <Input
                  id="b-venta"
                  type="number"
                  inputMode="decimal"
                  step="100"
                  value={form.precioVenta}
                  onChange={(e) =>
                    setForm({ ...form, precioVenta: Number(e.target.value) })
                  }
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="b-cant">Stock (unidades)</FieldLabel>
              <Input
                id="b-cant"
                type="number"
                inputMode="numeric"
                value={form.cantidad}
                onChange={(e) =>
                  setForm({ ...form, cantidad: Number(e.target.value) })
                }
              />
            </Field>
          </FieldGroup>
        </div>

        <SheetFooter>
          <Button size="lg" onClick={handleSave}>
            {bebida ? "Guardar cambios" : "Registrar bebida"}
          </Button>
          <SheetClose
            render={
              <Button size="lg" variant="outline">
                Cancelar
              </Button>
            }
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
