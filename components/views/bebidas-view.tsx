"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { useUIActions } from "@/lib/ui-actions"
import { formatARS } from "@/lib/format"
import type { Bebida } from "@/lib/types"
import { MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

const STOCK_BAJO = 5

export function BebidasView() {
  const { bebidas, deleteBebida } = useStore()
  const { openBebida } = useUIActions()
  const [query, setQuery] = useState("")

  const filtradas = useMemo(
    () =>
      bebidas.filter((b) =>
        b.nombreProducto.toLowerCase().includes(query.toLowerCase()),
      ),
    [bebidas, query],
  )

  const valorStock = bebidas.reduce(
    (s, b) => s + b.precioVenta * b.cantidad,
    0,
  )

  async function handleDelete(b: Bebida) {
    try {
      await deleteBebida(b.id)
      toast.success("Producto eliminado")
    } catch {
      toast.error("Error al eliminar el producto")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-6">
          <div>
            <p className="text-sm text-muted-foreground">Valor del stock</p>
            <p className="text-2xl font-semibold">{formatARS(valorStock)}</p>
          </div>
          <Button onClick={() => openBebida()}>
            <Plus /> Producto
          </Button>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar producto"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventario</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Venta</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    {b.nombreProducto}
                    <span className="block text-xs font-normal text-muted-foreground">
                      Compra {formatARS(b.precioCompra)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatARS(b.precioVenta)}
                  </TableCell>
                  <TableCell className="text-right">
                    {b.cantidad <= STOCK_BAJO ? (
                      <Badge variant="outline" className="text-destructive">
                        {b.cantidad}
                      </Badge>
                    ) : (
                      <span className="tabular-nums">{b.cantidad}</span>
                    )}
                  </TableCell>
                  <TableCell>
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
                          <DropdownMenuItem onClick={() => openBebida(b)}>
                            <Pencil /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(b)}
                          >
                            <Trash2 /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtradas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No se encontraron productos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
