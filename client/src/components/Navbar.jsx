import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-amber-700 text-lg">
          🌮 DavinchisMid
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/carrito" className="relative text-gray-600 hover:text-amber-600 transition">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hola, {usuario.nombre.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-amber-600 transition">
                Entrar
              </Link>
              <Link to="/registro"
                className="bg-amber-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-amber-600 transition">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}