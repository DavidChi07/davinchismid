import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, total } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const handleOrden = async () => {
    if (!usuario) return navigate('/login');
    setCargando(true);
    try {
      await api.post('/ordenes', {
        items: items.map(i => ({ productoId: i.id, cantidad: i.cantidad }))
      });
      vaciar();
      setExito(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear la orden');
    } finally {
      setCargando(false);
    }
  };

  if (exito) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-amber-800 mb-2">¡Orden enviada!</h2>
      <p className="text-gray-500 mb-6">Tu pedido está siendo preparado</p>
      <button
        onClick={() => navigate('/')}
        className="bg-amber-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-600 transition"
      >
        Seguir pidiendo
      </button>
    </div>
  );

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
      <p className="text-gray-500 mb-6">Agrega platillos del menú</p>
      <button
        onClick={() => navigate('/')}
        className="bg-amber-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-600 transition"
      >
        Ver menú
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-amber-800 mb-6">Tu pedido</h1>

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.nombre}</p>
              <p className="text-amber-600 font-semibold">${item.precio}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-amber-400 transition"
              >−</button>
              <span className="w-6 text-center font-medium">{item.cantidad}</span>
              <button
                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-amber-400 transition"
              >+</button>
            </div>
            <p className="font-semibold text-gray-700 w-16 text-right">
              ${item.precio * item.cantidad}
            </p>
            <button
              onClick={() => quitar(item.id)}
              className="text-gray-300 hover:text-red-400 transition text-lg"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between mb-6">
        <span className="font-semibold text-gray-700">Total</span>
        <span className="text-2xl font-bold text-amber-700">${total}</span>
      </div>

      <button
        onClick={handleOrden}
        disabled={cargando}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
      >
        {cargando ? 'Enviando orden...' : 'Confirmar pedido'}
      </button>
    </div>
  );
}