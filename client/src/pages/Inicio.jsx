import { useEffect, useState } from 'react';
import api from '../services/api';
import { useCarrito } from '../context/CarritoContext';

const getIconoCategoria = (categoria) => {
  if (categoria === 'postre') return '🍮';
  if (categoria === 'sopa') return '🍲';
  if (categoria === 'bebida') return '🥤';
  return '🌮';
};

const getImagenProducto = (producto) => {
  const posibleImagen =
    producto.imagen ??
    producto.imagenUrl ??
    producto.imagen_url ??
    producto.foto ??
    producto.fotoUrl ??
    producto.foto_url ??
    producto.urlImagen ??
    producto.url_imagen;

  if (!posibleImagen || typeof posibleImagen !== 'string') return '';
  if (posibleImagen.startsWith('http://') || posibleImagen.startsWith('https://') || posibleImagen.startsWith('data:')) {
    return posibleImagen;
  }

  return posibleImagen.startsWith('/') ? posibleImagen : `/${posibleImagen}`;
};

export default function Inicio() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [cargando, setCargando] = useState(true);
  const { agregar } = useCarrito();

  const categorias = ['', 'plato fuerte', 'sopa', 'antojo', 'postre', 'bebida'];

  useEffect(() => {
    const params = categoria ? `?categoria=${categoria}` : '';
    api.get(`/productos${params}`)
      .then(res => setProductos(res.data.productos))
      .finally(() => setCargando(false));
  }, [categoria]);

  if (cargando) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-amber-600 text-lg">Cargando platillos...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-800 mb-2">
        🌮 Menú DavinchisMid
      </h1>
      <p className="text-gray-500 mb-6">Auténtica comida yucateca</p>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
              ${categoria === cat
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'
              }`}
          >
            {cat || 'Todos'}
          </button>
        ))}
      </div>

      {/* Grid de platillos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
          >
            <div className="bg-amber-50 h-40 flex items-center justify-center text-5xl overflow-hidden">
              {getImagenProducto(producto) ? (
                <img
                  src={getImagenProducto(producto)}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <span
                className="w-full h-full items-center justify-center"
                style={{ display: getImagenProducto(producto) ? 'none' : 'flex' }}
              >
                {getIconoCategoria(producto.categoria)}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                {producto.categoria}
              </span>
              <h3 className="font-semibold text-gray-800 mt-1">{producto.nombre}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{producto.descripcion}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-amber-700">
                  ${producto.precio}
                </span>
                <button
                  onClick={() => agregar(producto)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}