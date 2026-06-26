import type { Bebida, Turno, Venta } from "./types"
import { toISODate } from "./format"

function dayOffset(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return toISODate(d)
}

function dateTimeOffset(dayOff: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + dayOff)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export const RECARGO_INICIAL = 10

export const bebidasSeed: Bebida[] = [
  {
    id: 1,
    nombreProducto: "Coca-Cola 500ml",
    precioCompra: 800,
    precioVenta: 1500,
    cantidad: 24,
  },
  {
    id: 2,
    nombreProducto: "Agua mineral 500ml",
    precioCompra: 400,
    precioVenta: 900,
    cantidad: 30,
  },
  {
    id: 3,
    nombreProducto: "Gatorade 500ml",
    precioCompra: 1200,
    precioVenta: 2000,
    cantidad: 8,
  },
  {
    id: 4,
    nombreProducto: "Cerveza lata",
    precioCompra: 1100,
    precioVenta: 2200,
    cantidad: 18,
  },
  {
    id: 5,
    nombreProducto: "Speed energizante",
    precioCompra: 900,
    precioVenta: 1800,
    cantidad: 3,
  },
  {
    id: 6,
    nombreProducto: "Alfajor",
    precioCompra: 500,
    precioVenta: 1000,
    cantidad: 40,
  },
]

export const turnosSeed: Turno[] = [
  {
    id: 1,
    fecha: dayOffset(0),
    hora: "19:00",
    precio: 18000,
    efectivo: 19800,
    recargoCobrado: 1800,
    total: 19800,
  },
  {
    id: 2,
    fecha: dayOffset(0),
    hora: "20:00",
    precio: 18000,
    transferencia: 19800,
    recargoCobrado: 1800,
    total: 19800,
  },
  {
    id: 3,
    fecha: dayOffset(0),
    hora: "21:00",
    precio: 27000,
    efectivo: 14850,
    transferencia: 14850,
    recargoCobrado: 2700,
    total: 29700,
  },
  {
    id: 4,
    fecha: dayOffset(1),
    hora: "18:00",
    precio: 18000,
    recargoCobrado: 1800,
    total: 19800,
  },
  {
    id: 5,
    fecha: dayOffset(-1),
    hora: "20:00",
    precio: 18000,
    efectivo: 19800,
    recargoCobrado: 1800,
    total: 19800,
  },
  {
    id: 6,
    fecha: dayOffset(-2),
    hora: "19:00",
    precio: 27000,
    efectivo: 29700,
    recargoCobrado: 2700,
    total: 29700,
  },
  {
    id: 7,
    fecha: dayOffset(-3),
    hora: "21:00",
    precio: 18000,
    transferencia: 19800,
    recargoCobrado: 1800,
    total: 19800,
  },
]

export const ventasSeed: Venta[] = [
  {
    id: 1,
    fechaVenta: dateTimeOffset(0, 19),
    totalVenta: 6300,
    detalles: [
      {
        id: 1,
        bebidas: {
          nombreProducto: "Coca-Cola 500ml",
          precioCompra: 800,
          precioVenta: 1500,
        },
        cantidad: 3,
        precioUnitario: 1500,
        subtotal: 4500,
      },
      {
        id: 2,
        bebidas: {
          nombreProducto: "Agua mineral 500ml",
          precioCompra: 400,
          precioVenta: 900,
        },
        cantidad: 2,
        precioUnitario: 900,
        subtotal: 1800,
      },
    ],
  },
  {
    id: 2,
    fechaVenta: dateTimeOffset(0, 20),
    totalVenta: 8800,
    detalles: [
      {
        id: 3,
        bebidas: {
          nombreProducto: "Cerveza lata",
          precioCompra: 1100,
          precioVenta: 2200,
        },
        cantidad: 4,
        precioUnitario: 2200,
        subtotal: 8800,
      },
    ],
  },
  {
    id: 3,
    fechaVenta: dateTimeOffset(-1, 21),
    totalVenta: 7000,
    detalles: [
      {
        id: 4,
        bebidas: {
          nombreProducto: "Gatorade 500ml",
          precioCompra: 1200,
          precioVenta: 2000,
        },
        cantidad: 2,
        precioUnitario: 2000,
        subtotal: 4000,
      },
      {
        id: 5,
        bebidas: {
          nombreProducto: "Alfajor",
          precioCompra: 500,
          precioVenta: 1000,
        },
        cantidad: 3,
        precioUnitario: 1000,
        subtotal: 3000,
      },
    ],
  },
  {
    id: 4,
    fechaVenta: dateTimeOffset(-2, 20),
    totalVenta: 7500,
    detalles: [
      {
        id: 6,
        bebidas: {
          nombreProducto: "Coca-Cola 500ml",
          precioCompra: 800,
          precioVenta: 1500,
        },
        cantidad: 5,
        precioUnitario: 1500,
        subtotal: 7500,
      },
    ],
  },
]
