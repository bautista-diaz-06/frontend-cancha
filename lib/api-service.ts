// lib/api-service.ts
const API_BASE_URL = "http://localhost:8080/api";

export async function fetchVentas() {
  const response = await fetch(`${API_BASE_URL}/ventas`);
  if (!response.ok) throw new Error("Error al obtener ventas");
  return await response.json();
}