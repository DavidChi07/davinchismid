const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function cerrarSesionYRedirigir() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Token vencido o inválido: cerrar sesión y mandar al login
  if (res.status === 401) {
    cerrarSesionYRedirigir();
    throw new Error("Sesión expirada");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }

  return data;
}