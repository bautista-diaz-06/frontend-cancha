// Turnos
export interface Turno {
  id: number
  fecha: string // YYYY-MM-DD
  hora: string // HH:mm
  precio: number
  efectivo?: number
  transferencia?: number
  recargoCobrado?: number
  total?: number
}

export interface TurnoRequestDTO {
  fecha: string
  hora: string
  precio: number
  efectivo?: number
  transferencia?: number
}

// Bebidas
export interface Bebida {
  id: number
  nombreProducto: string
  precioCompra: number
  precioVenta: number
  cantidad: number
}

export interface BebidaRequestDTO {
  nombreProducto: string
  precioCompra: number
  precioVenta: number
  cantidad: number
}

// Ventas
export interface ItemVenta {
  bebidaId: number
  cantidad?: number
}

export interface DetalleVenta {
  id: number
  bebidas: {
    nombreProducto: string
    precioCompra: number
    precioVenta: number
  }
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Venta {
  id: number
  fechaVenta: string // ISO datetime
  totalVenta: number
  detalles: DetalleVenta[]
}

export interface VentaRequestDTO {
  fechaVenta: string
  items: ItemVenta[]
}

export interface ResumenVenta {
  totalResumen: number
}

export interface ResultadoFiltrado {
  ventas: Venta[]
  resumen: ResumenVenta
}

export interface TurnoReporte {
  turnos: Turno[]
  totalGeneral: number
}

// Config
export interface RequestRecargoDTO {
  recargo: number
}
