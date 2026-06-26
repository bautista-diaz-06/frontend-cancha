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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { useStore } from "@/lib/store"
import { formatARS, todayISO } from "@/lib/format"
import type { Turno, TurnoRequestDTO } from "@/lib/types"
import { toast } from "sonner"

interface TurnoSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  turno?: Turno | null
}

const emptyForm: TurnoRequestDTO = {
  fecha: todayISO(),
  hora: "19:00",
  precio: 0,
}

export function TurnoSheet({ open, onOpenChange, turno }: TurnoSheetProps) {
  const { addTurno, updateTurno, recargoPct } = useStore()
  const [form, setForm] = useState<TurnoRequestDTO>(emptyForm)

  useEffect(() => {
    if (open) {
      setForm(
        turno
          ? {
              fecha: turno.fecha,
              hora: turno.hora,
              precio: turno.precio,
              efectivo: turno.efectivo,
              transferencia: turno.transferencia,
            }
          : emptyForm,
      )
    }
  }, [open, turno])

  const precioNum = form.precio || 0
  const recargo = (precioNum * recargoPct) / 100
  const total = precioNum + recargo

  function handleSave() {
    if (!form.fecha || !form.hora || !form.precio) {
      toast.error("Completá fecha, hora y precio")
      return
    }
    if (turno) {
      updateTurno(turno.id, form)
      toast.success("Turno actualizado")
    } else {
      addTurno(form)
      toast.success("Turno registrado")
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{turno ? "Editar turno" : "Nuevo turno"}</SheetTitle>
          <SheetDescription>
            Recargo {recargoPct}% se aplica automáticamente al precio base.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="t-fecha">Fecha</FieldLabel>
              <Input
                id="t-fecha"
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="t-hora">Hora</FieldLabel>
              <Input
                id="t-hora"
                type="time"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="t-precio">Precio base</FieldLabel>
            <Input
              id="t-precio"
              type="number"
              inputMode="decimal"
              step="100"
              value={form.precio}
              onChange={(e) =>
                setForm({ ...form, precio: Number(e.target.value) })
              }
              placeholder="0"
            />
            <FieldDescription>
              Recargo ${formatARS(recargo)} · Total ${formatARS(total)}
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="t-efectivo">Efectivo (opcional)</FieldLabel>
              <Input
                id="t-efectivo"
                type="number"
                inputMode="decimal"
                step="100"
                value={form.efectivo || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    efectivo: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="t-transf">
                Transferencia (opcional)
              </FieldLabel>
              <Input
                id="t-transf"
                type="number"
                inputMode="decimal"
                step="100"
                value={form.transferencia || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transferencia: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0"
              />
            </Field>
          </div>
        </div>

        <SheetFooter>
          <Button size="lg" onClick={handleSave}>
            {turno ? "Guardar cambios" : "Registrar turno"}
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
