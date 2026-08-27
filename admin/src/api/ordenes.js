import { apiFetch } from "./client";

export async function getTodasOrdenes() {
  return apiFetch("/api/ordenes/todas");
}

export async function actualizarStatus(id, status) {
  return apiFetch(`/api/ordenes/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}