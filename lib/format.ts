const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatARS(value: number): string {
  return currencyFormatter.format(value)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function currentMonthISO(): string {
  return todayISO().slice(0, 7)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const dayLabelFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  month: "short",
})

export function formatDayLabel(iso: string): string {
  // iso = YYYY-MM-DD, parse as local date
  const [y, m, d] = iso.split("-").map(Number)
  return dayLabelFormatter.format(new Date(y, m - 1, d))
}

const monthLabelFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
})

export function formatMonthLabel(isoMonth: string): string {
  const [y, m] = isoMonth.split("-").map(Number)
  return monthLabelFormatter.format(new Date(y, m - 1, 1))
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function daysInMonth(isoMonth: string): number {
  const [y, m] = isoMonth.split("-").map(Number)
  return new Date(y, m, 0).getDate()
}
