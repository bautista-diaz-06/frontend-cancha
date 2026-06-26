"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts"
import { useStore } from "@/lib/store"
import {
  currentMonthISO,
  daysInMonth,
  formatARS,
} from "@/lib/format"

const chartConfig = {
  turnos: { label: "Turnos", color: "var(--chart-1)" },
  ventas: { label: "Bebidas", color: "var(--chart-2)" },
} satisfies ChartConfig

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function ReportesView() {
  const { turnos, ventas } = useStore()
  const [mes, setMes] = useState(currentMonthISO())

  const data = useMemo(() => {
    const dias = daysInMonth(mes)
    const porDia = Array.from({ length: dias }, (_, i) => ({
      dia: String(i + 1),
      turnos: 0,
      ventas: 0,
    }))

    turnos
      .filter((t) => t.fecha.slice(0, 7) === mes)
      .forEach((t) => {
        const d = Number(t.fecha.slice(8, 10)) - 1
        if (porDia[d]) porDia[d].turnos += t.total || 0
      })

    ventas
      .filter((v) => v.fechaVenta.slice(0, 7) === mes)
      .forEach((v) => {
        const d = Number(v.fechaVenta.slice(8, 10)) - 1
        if (porDia[d]) porDia[d].ventas += v.totalVenta
      })

    const totalTurnos = porDia.reduce((s, d) => s + d.turnos, 0)
    const totalVentas = porDia.reduce((s, d) => s + d.ventas, 0)

    // top productos del mes
    const productoMap = new Map<string, number>()
    ventas
      .filter((v) => v.fechaVenta.slice(0, 7) === mes)
      .forEach((v) =>
        v.detalles.forEach((d) =>
          productoMap.set(
            d.bebidas.nombreProducto,
            (productoMap.get(d.bebidas.nombreProducto) ?? 0) + d.subtotal,
          ),
        ),
      )
    const topProductos = [...productoMap.entries()]
      .map(([nombre, valor]) => ({ nombre, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)

    return { porDia, totalTurnos, totalVentas, topProductos }
  }, [turnos, ventas, mes])

  const totalMes = data.totalTurnos + data.totalVentas

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardDescription className="text-primary-foreground/80">
            Total del mes
          </CardDescription>
          <CardTitle className="text-3xl">${formatARS(totalMes)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary-foreground/80">
            ${formatARS(data.totalTurnos)} en turnos ·{" "}
            ${formatARS(data.totalVentas)} en bebidas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Por día</CardTitle>
          <CardDescription>Ingresos diarios turnos vs bebidas</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={data.porDia} height={250}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="turnos" stackId="a" fill="var(--chart-1)" />
              <Bar dataKey="ventas" stackId="a" fill="var(--chart-2)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {data.topProductos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top bebidas</CardTitle>
            <CardDescription>Productos más vendidos del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart height={250}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={data.topProductos}
                  dataKey="valor"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {data.topProductos.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="mt-4 space-y-1 text-sm">
              {data.topProductos.map((p, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{p.nombre}</span>
                  <span className="font-medium">${formatARS(p.valor)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
