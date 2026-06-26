"use client"

import { cn } from "@/lib/utils"
import type { TabKey } from "@/lib/ui-actions"
import { CalendarDays, Home, BarChart3, ShoppingCart, Settings } from "lucide-react"

const items: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "inicio", label: "Inicio", icon: Home },
  { key: "turnos", label: "Turnos", icon: CalendarDays },
  { key: "ventas", label: "Ventas", icon: ShoppingCart },
  { key: "reportes", label: "Reportes", icon: BarChart3 },
  { key: "config", label: "Ajustes", icon: Settings },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (tab: TabKey) => void
}) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5", isActive && "fill-primary/15")} />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
