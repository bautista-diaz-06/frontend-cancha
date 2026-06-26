"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { useStore } from "@/lib/store"
import { useUIActions } from "@/lib/ui-actions"
import {
  currentMonthISO,
  formatARS,
  formatMonthLabel,
  todayISO,
} from "@/lib/format"
import type { Turno } from "@/lib/types"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function TurnosView() {
  const { turnos, deleteTurno } = useStore()
  const { openTurno } = useUIActions()
  const [modo, setModo] = useState<"dia" | "mes">("dia")
  const [fecha, setFecha] = useState(todayISO())
  const [mes, setMes] = useState(currentMonthISO())

  const filtrados = useMemo(() => {
    const list =
      modo === "dia"
        ? turnos.filter((t) => t.fecha === fecha)
        : turnos.filter((t) => t.fecha.slice(0, 7) === mes)
    return [...list].sort(
      (a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora),
    )
  }, [turnos, modo, fecha, mes])

  const totalRecaudado = filtrados.reduce((s, t) => s + (t.total || 0), 0)

  function handleDelete(t: Turno) {
    deleteTurno(t.id)
    toast.success("Turno eliminado")
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtrar turnos</CardTitle>
          <CardDescription>Por día o por mes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
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
              {filtrados.length} turno(s)
            </span>
            <span className="font-semibold">${formatARS(totalRecaudado)}</span>
          </div>
        </CardContent>
      </Card>

      {filtrados.length === 0 ? (
        <Empty className="rounded-lg border border-dashed py-10">
          <EmptyHeader>
            <EmptyTitle>Sin turnos</EmptyTitle>
            <EmptyDescription>
              No hay turnos registrados para este período.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => openTurno()}>Nuevo turno</Button>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtrados.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                <span className="text-sm font-semibold leading-none">
                  {t.hora}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  {t.fecha.split("-")[2]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Precio base
                </p>
                <p className="font-semibold">${formatARS(t.precio)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-xs text-muted-foreground">
                  Recargo ${formatARS(t.recargoCobrado || 0)}
                </p>
                <p className="font-bold">${formatARS(t.total || 0)}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="icon" variant="ghost" aria-label="Acciones">
                      <MoreVertical />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => openTurno(t)}>
                      <Pencil /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete(t)}
                    >
                      <Trash2 /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
