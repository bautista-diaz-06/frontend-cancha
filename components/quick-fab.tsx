"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUIActions } from "@/lib/ui-actions"
import { CalendarPlus, Plus, ShoppingCart } from "lucide-react"

export function QuickFab() {
  const { openTurno, openVenta } = useUIActions()
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon"
              className="size-14 rounded-full shadow-lg"
              aria-label="Acciones rápidas"
            >
              <Plus className="size-6" />
            </Button>
          }
        />
        <DropdownMenuContent side="top" align="end" className="mb-2">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => openTurno()}>
              <CalendarPlus /> Nuevo turno
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openVenta}>
              <ShoppingCart /> Registrar venta
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
