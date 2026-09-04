import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuario");

  if (!token || !usuarioRaw) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(usuarioRaw);

  if (usuario.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}