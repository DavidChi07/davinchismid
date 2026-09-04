import { Outlet, useNavigate, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition-colors ${
      isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 flex flex-col">
        <div className="px-4 py-5 text-white font-bold text-lg border-b border-gray-800">
          DavinchisMid
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink to="/dashboard/ordenes" className={linkClass}>
            Órdenes
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Hola, <span className="font-medium text-gray-800">{usuario.nombre}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}